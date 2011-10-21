/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package uk.ac.manchester.cs.wireit.module;

import java.io.File;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.JSONException;
import org.json.JSONObject;
import uk.ac.manchester.cs.wireit.taverna.ProcessException;
import uk.ac.manchester.cs.wireit.taverna.TavernaException;
import uk.ac.manchester.cs.wireit.taverna.baclava.DataThingBasedBaclava;

/**
 *
 * @author Christian
 */
public class HelloWorldModule extends TavernaModule {
    
    InputPort output;
    
    public HelloWorldModule(JSONObject json) throws JSONException, TavernaException, IOException{
        super(json);
        setWorkflowFile(new File("webapps/WireIt/Java/HelloWorld.t2flow"));
    }
        
    @Override
    public void run() throws JSONException {
        try {
            DataThingBasedBaclava baclava = runWorkflow();
            Object value = baclava.getValue("Foo");
            output.push(value.toString());
        } catch (Exception ex) {
            throw new JSONException(ex);
        }
    }

    @Override
    public InputPort getInputPort(String terminal) throws JSONException {
        throw new JSONException("HelloWorld has no InputPorts");
    }

    @Override
    public void setOutputPort(String terminal, InputPort inputPort) throws JSONException {
        if (terminal.equals("Foo")){
            output = inputPort;
        } else {
            throw new JSONException("Unsupported port name");
        }
    }

}
