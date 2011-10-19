/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package uk.ac.manchester.cs.wireit.module;

import java.util.Date;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author Christian
 */
public class CommentModule extends Module{

    public CommentModule (JSONObject json) throws JSONException{
        super(json);
    }
    @Override
    public InputPort getInputPort(String terminal) throws JSONException {
        throw new JSONException("CommentModule has no InputPorts");
    }

    @Override
    public void setOutputPort(String terminal, InputPort inputPort) throws JSONException {
        throw new JSONException("CommentModule has no InputPorts");
    }

    @Override
    public void run() throws JSONException {
        Date now = new Date();
        values.put("comment", "Ran successfully at " + now);
    }
    
}
