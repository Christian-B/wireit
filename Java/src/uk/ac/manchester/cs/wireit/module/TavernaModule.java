/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package uk.ac.manchester.cs.wireit.module;

import java.io.File;
import java.io.IOException;
import org.json.JSONException;
import org.json.JSONObject;
import uk.ac.manchester.cs.wireit.taverna.CommandLineRun;
import uk.ac.manchester.cs.wireit.taverna.CommandLineWrapper;
import uk.ac.manchester.cs.wireit.taverna.ProcessException;
import uk.ac.manchester.cs.wireit.taverna.TavernaException;
import uk.ac.manchester.cs.wireit.taverna.baclava.DataThingBasedBaclava;

/**
 *
 * @author Christian
 */
public abstract class TavernaModule extends Module{

    private CommandLineWrapper commandLine;
    
    TavernaModule(JSONObject json) throws JSONException, TavernaException, IOException{
        super(json);
        commandLine = new CommandLineWrapper();
        setTavernaHome(System.getenv("TAVERNA_HOME"));

    }
    
    public final void setTavernaHome(String tavernaHome) throws TavernaException, IOException {
        if (tavernaHome != null && !tavernaHome.isEmpty()){
            commandLine.setTavernaHome(new File(tavernaHome));        
        } 
    }

    void setWorkflowFile(File file) throws IOException, TavernaException{
        commandLine.setWorkflowFile(file);
    }
    
    @Override
    public void run() throws JSONException {
        //Do nothing work when all inputs have been pushed.
    }
    
    DataThingBasedBaclava runWorkflow() throws TavernaException, ProcessException{
        CommandLineRun run = commandLine.runWorkFlow();
        File output = run.getOutputFile();
        return new DataThingBasedBaclava(output);
    }
}