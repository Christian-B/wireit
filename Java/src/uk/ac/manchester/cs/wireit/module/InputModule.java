package uk.ac.manchester.cs.wireit.module;

import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author Christian
 */
public class InputModule extends Module{
        
    InputPort output;
    
    public InputModule (JSONObject json) throws JSONException{
        super(json);
    }
    
    @Override
    public InputPort getInputPort(String terminal) throws JSONException{
        throw new JSONException("InputModule has no InputPorts");
    }

    @Override
    public void setOutputPort(String terminal, InputPort inputPort) throws JSONException {
        if (terminal.equals("output1")){
            output = inputPort;
        } else {
            throw new JSONException("Unsupported port name");
        }
    }

    @Override
    public void run() throws JSONException {
        String value = values.get("output1");
        output.push(value);
    }

}
