/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package uk.ac.manchester.cs.wireit.module;

import java.io.File;
import java.io.IOException;
import org.json.JSONException;
import org.json.JSONObject;
import uk.ac.manchester.cs.wireit.event.OutputFirer;
import uk.ac.manchester.cs.wireit.event.OutputListener;
import uk.ac.manchester.cs.wireit.taverna.TavernaException;
import uk.ac.manchester.cs.wireit.taverna.baclava.DataThingBasedBaclava;

/**
 *
 * @author Christian
 */
public class HelloWorldModule extends TavernaModule {
    
    private OutputFirer output;
    
    private final String PORT_NAME = "Foo";

    public HelloWorldModule(JSONObject json) throws JSONException, TavernaException, IOException{
        super(json);
        setWorkflowFile(new File("webapps/WireIt/Java/HelloWorld.t2flow"));
        output = new OutputFirer();
    }
        
    @Override
    public void run() throws JSONException {
        try {
            DataThingBasedBaclava baclava = runWorkflow();
            Object value = baclava.getValue(PORT_NAME);
            output.fireOutputReady(value);
        } catch (Exception ex) {
            throw new JSONException(ex);
        }
    }

    @Override
    public OutputListener getOutputListener(String terminal) throws JSONException {
        throw new JSONException("HelloWorld has no Inputs");
    }

    @Override
    public void addOutputListener(String terminal, OutputListener listener) throws JSONException {
        if (terminal.equals(PORT_NAME)){
            output.addOutputListener(listener);
        } else {
            throw new JSONException("Unsupported port name " + terminal + " Expected Foo");
        }
    }

}
