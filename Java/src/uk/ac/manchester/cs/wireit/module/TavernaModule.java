/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package uk.ac.manchester.cs.wireit.module;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.json.JSONException;
import org.json.JSONObject;
import uk.ac.manchester.cs.wireit.event.OutputFirer;
import uk.ac.manchester.cs.wireit.event.OutputListener;
import uk.ac.manchester.cs.wireit.taverna.CommandLineRun;
import uk.ac.manchester.cs.wireit.taverna.CommandLineWrapper;
import uk.ac.manchester.cs.wireit.taverna.ProcessException;
import uk.ac.manchester.cs.wireit.taverna.TavernaException;
import uk.ac.manchester.cs.wireit.taverna.TavernaInput;
import uk.ac.manchester.cs.wireit.taverna.baclava.DataThingBasedBaclava;
import uk.ac.manchester.cs.wireit.taverna.workflow.TavernaWorkflow;
import uk.ac.manchester.cs.wireit.taverna.workflow.XMLBasedT2Flow;

/**
 *
 * @author Christian
 */
public class TavernaModule extends Module{

    private CommandLineWrapper commandLine;
    private Map<String,PortListener> inputPorts;
    private Map<String,OutputFirer> outputPorts;
    private Map<String,TavernaInput> tavernaInputs;
    
    public TavernaModule(JSONObject json) throws JSONException, TavernaException, IOException{
        super(json);
        commandLine = new CommandLineWrapper();
        setTavernaHome(System.getenv("TAVERNA_HOME"));
        setWorkflow(json);    
    }
    
    private void setWorkflow(JSONObject json) throws JSONException, TavernaException, IOException{
        JSONObject config = json.getJSONObject("config");
        String fileSt = config.optString("wfURI");
        
        //Checks for security. Change as required
        if (fileSt.contains("..")){
            throw new TavernaException ("Security exception uris can not contain \"..\"");
        }
        File workflowFile = new File("webapps/WireIt/Workflows/" + fileSt);
        commandLine.setWorkflowFile(workflowFile);
        
        TavernaWorkflow workflow = new XMLBasedT2Flow(workflowFile);
        setInputs(workflow);
        setOutputs(workflow);
    }
    
    /*private void removeNullandEmptyValues(){
        //remove any null or empty values as we check that all values are set to run
        for (String key:values.keySet()){
            Object value = values.get(key);
            if (value == null){
                values.remove(key);
            }
            if (value instanceof String){
                String valueSt = (String)value;
                if (valueSt.isEmpty()){
                    values.remove(key);
                }
            }
        }
    }*/
    
    private void setInputs(TavernaWorkflow workflow) throws TavernaException{
        //removeNullandEmptyValues();
        Map<String,Integer> inputs = workflow.getInputs();  
        inputPorts = new HashMap<String,PortListener>();
        tavernaInputs = new HashMap<String,TavernaInput>();
        for (String key:inputs.keySet()){
            TavernaInput tavernaInput = new TavernaInput(key, inputs.get(key));
            tavernaInputs.put(key, tavernaInput);
            PortListener port = new PortListener(tavernaInput);
            inputPorts.put(key, port);
        }
    }

    private void setOutputs(TavernaWorkflow workflow){
        outputPorts = new HashMap<String,OutputFirer>();
        List<String> outputs = workflow.getOutputs();
        for (String output: outputs){
            outputPorts.put(output, new OutputFirer());
        }
    }
    
    public final void setTavernaHome(String tavernaHome) throws TavernaException, IOException {
        if (tavernaHome != null && !tavernaHome.isEmpty()){
            commandLine.setTavernaHome(new File(tavernaHome));        
        } 
    }

    @Override
    public void run() throws WireItRunException {
        //Just in case their are no inputs are all set as values.
        runIfReady();
    }
    
    DataThingBasedBaclava runWorkflow() throws TavernaException, ProcessException{
        System.out.println("Workflow ready!");
        TavernaInput[] inputArray = new TavernaInput[0];
        inputArray = tavernaInputs.values().toArray(inputArray);
        System.out.println(inputArray);
        System.out.println(inputArray.length);
        commandLine.setInputs(inputArray);
        CommandLineRun run = commandLine.runWorkFlow();
        File output = run.getOutputFile();
        System.out.println("Workflow ran");
        return new DataThingBasedBaclava(output);
    }

    @Override
    public OutputListener getOutputListener(String terminal) throws JSONException {
        if (inputPorts.containsKey(terminal)){
            return inputPorts.get(terminal);
        } else if (terminal.startsWith("in_") && inputPorts.containsKey(terminal.substring(3))) {
            return inputPorts.get(terminal.substring(3));            
        } else {
            String portNames = "";
            for (String key:inputPorts.keySet()){
                portNames = portNames + key + ", ";
            }
            throw new JSONException("No input Port found with name " + terminal + " Ports are: " + portNames);
        }
    }

    @Override
    public void addOutputListener(String terminal, OutputListener listener) throws JSONException {
        if (outputPorts.containsKey(terminal)){
            outputPorts.get(terminal).addOutputListener(listener);
        } else if (terminal.startsWith("out_") && outputPorts.containsKey(terminal.substring(4))) {
            outputPorts.get(terminal.substring(4)).addOutputListener(listener);           
        } else {
            String portNames = "";
            for (String key:outputPorts.keySet()){
                portNames = portNames + key + ", ";
            }
            throw new JSONException("No output Port found with name " + terminal + " Ports are: " + portNames);
        }
    }
    
    private boolean allValuesSet(){        //ystem.out.println("in allValuesSet" + values.size());
        for (String key:tavernaInputs.keySet()){
            //The assumption here is that all values that are null or empty have been removed.
            if (!tavernaInputs.get(key).hasValue()){
                return false;
            }
        }
        return true;
    }
     
    private void runIfReady() throws WireItRunException {
        if (allValuesSet()){
            try {
                DataThingBasedBaclava baclava = runWorkflow();
                for (String key:outputPorts.keySet()){
                    System.out.print (key + ": ");
                    Object value = baclava.getValue(key);
                    System.out.println(value);
                    outputPorts.get(key).fireOutputReady(value);
                }
            } catch (Exception ex) {
                 throw new WireItRunException("Error running workflow ", ex);
            } 
        }  
    }
    
    private class PortListener implements OutputListener{

        private TavernaInput myInput;
        
        private PortListener(TavernaInput input){
            myInput = input;
        }
        
        @Override
        public void outputReady(Object output) throws WireItRunException{
            if (output instanceof String){
                try {
                    myInput.setStringInput(output.toString());
                } catch (TavernaException ex) {
                    throw new WireItRunException ("Error setting Taverna input ",ex);
                }
            } else {
                 throw new WireItRunException ("Unknown inpiut type " + output.getClass());
            }
            runIfReady();
        }
    }

}