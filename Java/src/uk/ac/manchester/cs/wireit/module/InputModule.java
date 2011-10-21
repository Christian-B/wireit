package uk.ac.manchester.cs.wireit.module;

import org.json.JSONException;
import org.json.JSONObject;
import uk.ac.manchester.cs.wireit.event.OutputFirer;
import uk.ac.manchester.cs.wireit.event.OutputListener;

/**
 *
 * @author Christian
 */
public class InputModule extends Module{
        
    OutputFirer output;
    
    public InputModule (JSONObject json) throws JSONException{
        super(json);
        output = new OutputFirer();
    }
    
    @Override
    public void run() throws JSONException {
        Object value = values.get("output1");
        output.fireOutputReady(value);
    }

    @Override
    public OutputListener getOutputListener(String terminal) throws JSONException {
        throw new JSONException("InputModule has no Inputs");
    }

    @Override
    public void addOutputListener(String terminal, OutputListener listener) throws JSONException {
        if (terminal.equals("output1")){
            output.addOutputListener(listener);
        } else {
            throw new JSONException("Unsupported port name");
        }
    }

}
