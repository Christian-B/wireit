package uk.ac.manchester.cs.wireit.module;

import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author Christian
 */
public class PassThroughModule extends Module{
        
    InputPort output;
    
    public PassThroughModule (JSONObject json) throws JSONException{
        super(json);
    }
    
    @Override
    public InputPort getInputPort(String terminal) throws JSONException{
        if (terminal.equals("input1")){
            return new InnerInputPort();
        } else {
            throw new JSONException("Unsupported port name");
        }
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
        //Do nothing reacts to push not run()
    }

    private class InnerInputPort implements InputPort{

        @Override
        public void push(String value) {
            values.put("both1", value);
            output.push(value);
        }    
    }
}
