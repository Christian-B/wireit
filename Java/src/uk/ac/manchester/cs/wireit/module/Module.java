package uk.ac.manchester.cs.wireit.module;

import java.util.HashMap;
import java.util.Iterator;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author Christian
 */
public abstract class Module {
    
    String name;
    JSONObject config;
    HashMap <String, String> values;
    
    Module (JSONObject json) throws JSONException{
        name = json.getString("name");
        config = json.getJSONObject("config");
        Object valuesObject = json.get("value");
        values = new HashMap <String, String>();
        if (valuesObject instanceof JSONObject){
           JSONObject valuePair = (JSONObject) valuesObject;
           Iterator keys = valuePair.keys();
           String key = (String)keys.next();
           String value = valuePair.getString(key);
           values.put(key, value);
           if (keys.hasNext()){
               throw new JSONException("Unexpected more than one key in value");
           }
        } else {
            throw new JSONException ("Unexpected value type " + valuesObject.getClass());
        }
    }
    
    public abstract InputPort getInputPort(String terminal) throws JSONException;

    public abstract void setOutputPort(String terminal, InputPort inputPort) throws JSONException;
    
    public abstract void run() throws JSONException;
 
    public JSONObject getJsonObject() throws JSONException{
        JSONObject me = new JSONObject();
        me.put("name", name);
        me.put("config", config);
        
        JSONObject value = new JSONObject(values);
        me.put("value", value);
        me.put("config", config);
        return me;
     
     }

}
