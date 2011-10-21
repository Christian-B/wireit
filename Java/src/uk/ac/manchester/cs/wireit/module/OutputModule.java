package uk.ac.manchester.cs.wireit.module;

import org.json.JSONException;
import org.json.JSONObject;
import uk.ac.manchester.cs.wireit.event.OutputListener;

/**
 *
 * @author Christian
 */
public class OutputModule extends Module{
           
    public OutputModule (JSONObject json) throws JSONException{
        super(json);
    }
    
    @Override
    public void run() throws JSONException {
        //Do nothing reacts to push not run()
    }

    @Override
    public OutputListener getOutputListener(String terminal) throws JSONException {
        if (terminal.equals("input1")){
            return new InnerLisener();
        } else {
            throw new JSONException("Unsupported port name");
        }
    }

    @Override
    public void addOutputListener(String terminal, OutputListener listener) throws JSONException {
        throw new JSONException("Module OutputPort has no output ports");
    }

    private class InnerLisener implements OutputListener{

        @Override
        public void outputReady(Object output) {
            values.put("input1", output);
        }
        
    }
}
