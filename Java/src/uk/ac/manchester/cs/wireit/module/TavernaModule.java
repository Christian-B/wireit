/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package uk.ac.manchester.cs.wireit.module;

import uk.ac.manchester.cs.wireit.utils.DelimiterURI;
import uk.ac.manchester.cs.wireit.exception.WireItRunException;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.json.JSONException;
import org.json.JSONObject;
import uk.ac.manchester.cs.wireit.RunWireit;
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
import uk.ac.manchester.cs.wireit.utils.Resolver;

/**
 * This module wraps the running of a taverna workflow.
 * <p>
 * The current implentation is written around A Taverna command line Wrapper written for Ondex.
 * That tool does not provide the security nor all the options that Taverna Server does.
 * It is therefor recommended that this class be updated to use Taverna Server.
 * <p>
 * The main functionality (which should stay even with a server versions) is.
 * <ul>
 *    <li> Extract the required inputs and outputs from the Workflow 
 *    <li> Allow Wiring to connect to terminals with that match does in the workflow
 *    <li>Listen for the required inputs from other modules
 *    <ul> 
 *        <li> Could be a Baclava ULI
 *        <li> If individual inputs are used this module will them. All are required for the next steps.
 *    </ul>
 *    <li> Pass the inputs to Taverna
 *    <li> Execute the workflow
 *    <li> Obtain the resulting Baclava output file
 *    <li> Extract the indiviual results
 *    <li> Pass the idividual results to any listeners
 *    <li> Pass the Baclava outout to and Listeners on the Baclava port
 * </ul>
 * @author Christian
 */
public class TavernaModule extends Module{

    /** Wrapper around Taverna Command Line. Original written for Ondex*/
    private CommandLineWrapper commandLine;
    
    /** Map of Listeners. 
     *  One for each input port. (Exceluding the Baclava input)
     *  React to any data from upstream Modules.    
     */
    private Map<String,ValueListener> inputPorts;

    /**
     * Map of input storage classes.
     * One for each input port. (Exceluding the Baclava input)
     * Store data from upstream Modules.    
     * <p>
     * TavernaInput was written for the ONDEX project.
     * The functionality includes
     * <ul>
     *    <li>Allowing different types of inputs to be stored.
     *    <ul>
     *        <li>Depth 0 value (ast String)
     *        <li>Depth 0 URI
     *        <li>Depth 1 arrays of Values (as Strings)
     *        <li>depth 1 URI and delimiter
     *    </ul>
     *    <li>Single method to say if it has ai input or not
     *    <li>Ability to add the required command line arguements for the input passed in.
     *    <ul>
     *        <li>Correct parameter flag  
     *        <li>Name of the port
     *        <li>Value / uri
     *        <li>Where applicable Delimiter 
     *        <li>Array fo Strings conctanated to a Single String with a suitable Delimiter
     * </ul>     
     * <p>
     * Even if using Taverna Server something like this will be required to handle the inputs.
     */
    private Map<String,TavernaInput> tavernaInputs;
    
    /** For Baclava input the URI is saved as a String. */
    private String baclavaInput;

    /** Map of Firers. One for each output port. Passing to any data from downstream Modules */    
    private Map<String,OutputFirer> outputPorts;
    
    /** Firer for anyone Listening ofr the Baclava */
    private OutputFirer baclavaOutput;
    
    /** Flag to avoid run causing execution if inputs alread have */
    private boolean alreadyRun = false;
    
    /** Handles absolute to relative URI mapping */
    private Resolver resolver;
    
    /** Relative name of the folder to put outputs in */
    private static final String OUTPUT_DIR = "Output";
            
    /**
     * Constructor which sets up the module based on the json.
     * <p>
     * See setWorkflow for specific json required.
     * <p>
     * Taverna home must be set either from the environment variable "TAVERNA_HOME"  
     * or from RunWireit which gets it from the servlet context InitParameter(TAVERNA_CMD_HOME_PARAMETER);
     * @param json JSON object including "wfURI" in the "config"
     * @param resolver  Handles absolute to relative URI mapping
     * @throws JSONException Thrown if the json is not in the expected format.
     * @throws TavernaException thrown if a 
     * @throws IOException
     * @throws WireItRunException 
     */
    public TavernaModule(JSONObject json, Resolver resolver) throws JSONException, TavernaException, IOException, WireItRunException{
        super(json);
        commandLine = new CommandLineWrapper();
        setTavernaHome(System.getenv("TAVERNA_HOME"));
        setTavernaHome(RunWireit.getTavernaHome());
        this.resolver = resolver;
        commandLine.setOutputRootDirectory(resolver.getRelativeFile(OUTPUT_DIR));
        
        setWorkflow(json);  
       // URLRoot = URL.substring(0, URL.lastIndexOf("/"));
    }
    
    public final void setTavernaHome(String tavernaHome) throws TavernaException, IOException {
        if (tavernaHome != null && !tavernaHome.isEmpty()){
            commandLine.setTavernaHome(new File(tavernaHome));        
        } 
    }
    
    private void setWorkflow(JSONObject json) throws JSONException, TavernaException, IOException, WireItRunException{
        String fileSt = config.optString("wfURI");
        //Checks for security. Change as required
        if (fileSt.contains("..")){
            throw new TavernaException ("Security exception uris can not contain \"..\"");
        }
        File workflowFile = resolver.getRelativeFile(fileSt);
        commandLine.setWorkflowFile(workflowFile);
        
        TavernaWorkflow workflow = new XMLBasedT2Flow(workflowFile);
        setInputs(workflow);
        setOutputs(workflow);
    }
        
    private void setInputs(TavernaWorkflow workflow) throws TavernaException{
        //removeNullandEmptyValues();
        Map<String,Integer> inputs = workflow.getInputs();  
        inputPorts = new HashMap<String,ValueListener>();
        tavernaInputs = new HashMap<String,TavernaInput>();
        for (String key:inputs.keySet()){
            TavernaInput tavernaInput = new TavernaInput(key, inputs.get(key));
            tavernaInputs.put(key, tavernaInput);
            ValueListener port = new ValueListener(tavernaInput);
            inputPorts.put(key, port);
        }
        baclavaInput = null;
    }

    private void setOutputs(TavernaWorkflow workflow){
        outputPorts = new HashMap<String,OutputFirer>();
        List<String> outputs = workflow.getOutputs();
        for (String output: outputs){
            outputPorts.put(output, new OutputFirer());
        }
        baclavaOutput = new OutputFirer();
    }
    
    @Override
    public void run(StringBuilder outputBuilder) throws WireItRunException {
        //Just in case their are no inputs are all set as values.
        if (!alreadyRun) { 
            runIfReady(outputBuilder);
        }
    }
    
    @Override
    public OutputListener getOutputListener(String terminal) throws JSONException {
        if (inputPorts.containsKey(terminal)){
            return inputPorts.get(terminal);
        } else if (terminal.startsWith("in_") && inputPorts.containsKey(terminal.substring(3))) {
            return inputPorts.get(terminal.substring(3));            
        } else if (terminal.equals("Baclava Input")){
            return new BaclavaListener();
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
        } else if (terminal.equals("Baclava Output")){
            baclavaOutput.addOutputListener(listener);
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
            if (!tavernaInputs.get(key).hasValue()){
                return false;
            }
        }
        return true;
    }
     
    File runWorkflowWithInputs() throws TavernaException, ProcessException{
        System.out.println("Workflow ready based on inputs!");
        TavernaInput[] inputArray = new TavernaInput[0];
        inputArray = tavernaInputs.values().toArray(inputArray);
        commandLine.setInputs(inputArray);
        System.out.println("ready to run");
        CommandLineRun run = commandLine.runWorkFlow();
        System.out.println("ready started");
        File output = run.getOutputFile();
        System.out.println("Workflow ran");
        return output;
    }

    File runWorkflowWithBaclava() throws TavernaException, ProcessException{
        System.out.println("Workflow ready based on Baclava!" + baclavaInput);
        commandLine.setInputsURI(baclavaInput);        
        CommandLineRun run = commandLine.runWorkFlow();
        File output = run.getOutputFile();
        System.out.println("Workflow ran");
        return output;
    }

    private void runIfReady(StringBuilder outputBuilder) throws WireItRunException {
        File output;
        if (allValuesSet()){
            try {
                output = runWorkflowWithInputs();             
            } catch (Exception ex) {
                 throw new WireItRunException("Error running workflow: " + name + "  " + ex.getMessage(), ex);
            } 
            processRun(output, outputBuilder);
        } else if (baclavaInput != null) {
            try {
                output = runWorkflowWithBaclava();             
            } catch (Exception ex) {
                 throw new WireItRunException("Error running workflow: " + name + "  " + ex.getMessage(), ex);
            } 
            processRun(output, outputBuilder);
        }
    }
    
    private void processRun(File output, StringBuilder outputBuilder) throws WireItRunException {
        alreadyRun = true;
        DataThingBasedBaclava baclava;
        outputBuilder.append("Workflow ");
        outputBuilder.append(name);
        outputBuilder.append(" succesfully.\n");
        try {
            baclava = new DataThingBasedBaclava(output);
        } catch (TavernaException ex) {
            throw new WireItRunException ("Unable to read baclava from " + name, ex);
        }
        for (String key:outputPorts.keySet()){
            //ystem.out.print (key + ": ");
            Object value;
            try {
                value = baclava.getValue(key);
            } catch (TavernaException ex) {
                throw new WireItRunException ("Unable to read value " + key + " from baclava form " + name, ex);
            }
            //ystem.out.println(value);
            outputPorts.get(key).fireOutputReady(value, outputBuilder);
        }
        URI uri = resolver.FileAndParentToURI(OUTPUT_DIR, output);
        baclavaOutput.fireOutputReady(uri, outputBuilder);
   }
    
    private class ValueListener implements OutputListener{

        private TavernaInput myInput;
        
        private ValueListener(TavernaInput input){
            myInput = input;
        }
        
        @Override
        public void outputReady(Object output, StringBuilder outputBuilder) throws WireItRunException{
             try {
                if (output instanceof String){
                    System.out.println("Setting string");
                    myInput.setStringInput(output.toString());
                } else if (output instanceof byte[]){
                    //This is a hack. 
                    //A nicer way would be to save to file and then pass as file.
                    byte[] array = (byte[])output;
                    String asString = new String(array);
                    myInput.setStringInput(asString);
                } else if (output instanceof String[]){
                    //TavernaInputs will throw an exception is depth is not 1
                    System.out.println("Setting string array");
                    myInput.setStringsInput((String[])output);
                } else if (output instanceof URI){
                    System.out.println("setting URI");
                    myInput.setSingleURIInput(resolver.getURIObjectToRelativeURIString(output));                    
                } else if (output instanceof DelimiterURI){
                    //TavernaInputs will throw an exception is depth is not 1
                    DelimiterURI delimiterURI = (DelimiterURI)output;
                    myInput.setListURIInput(delimiterURI.getURI().toString(), delimiterURI.getDelimiter());
               } else {
                    //I could have done output.toString() but for now want to check every type is handled correctly.
                     throw new WireItRunException ("Unknown input type " + output.getClass() + " in " + name);
                }
            } catch (TavernaException ex) {
                throw new WireItRunException ("Error setting Taverna input for " + name + ex.getMessage(), ex);
            }
            runIfReady(outputBuilder);
        }
    }

    private class BaclavaListener implements OutputListener{
       
        private BaclavaListener(){
        }
        
        @Override
        public void outputReady(Object output, StringBuilder outputBuilder) throws WireItRunException{
            if (output instanceof URI){
                baclavaInput = resolver.getURIObjectToRelativeURIString(output);
                runIfReady(outputBuilder);
            } else {
                 throw new WireItRunException ("Unknown inpiut type " + output.getClass() + " in " + name);
            }
        }
    }

}