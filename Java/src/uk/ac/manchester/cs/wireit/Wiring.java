/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package uk.ac.manchester.cs.wireit;

import java.io.IOException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import uk.ac.manchester.cs.wireit.module.*;
import uk.ac.manchester.cs.wireit.taverna.TavernaException;

/**
 *
 * @author Christian
 */
public class Wiring {
    
    Module[] modules;
    JSONObject properties;
    JSONArray wires;
    
    public Wiring(JSONObject jsonInput) throws JSONException, TavernaException, IOException{
        JSONArray jsonArray = jsonInput.getJSONArray("modules");
        modules = new Module[jsonArray.length()];
        for (int i = 0; i < jsonArray.length(); i++){
            Object json = jsonArray.get(i);
            if (json instanceof JSONObject){
                JSONObject jsonObject = (JSONObject)json;
                String name = jsonObject.getString("name");
                if (name.equals("Input")){
                   modules[i] = new InputModule(jsonObject); 
                } else if (name.equals("Output")){
                   modules[i] = new OutputModule(jsonObject); 
                } else if (name.equals("PassThrough")){
                   modules[i] = new PassThroughModule(jsonObject); 
                } else if (name.equals("HelloWorld")){
                   modules[i] = new HelloWorldModule(jsonObject); 
                } else if (name.equals("comment")){
                   modules[i] = new CommentModule(jsonObject); 
                } else {
                    throw new JSONException("Unexpected name " + name + " in modules");
                }
            } else {
                throw new JSONException("Unexpected type " + json.getClass() + " in modules");
            }
        }
        properties = jsonInput.getJSONObject("properties");
        wires = jsonInput.getJSONArray("wires");
        for (int i = 0; i < wires.length(); i++){
            JSONObject wire = wires.optJSONObject(i);
            JSONObject tgt = wire.getJSONObject("tgt");
            int tgtNum = tgt.getInt("moduleId");
            Module target = modules[tgtNum];
            String terminal = tgt.getString("terminal");
            System.out.println(tgtNum + " " + terminal + " " + target);
            InputPort inputPort = target.getInputPort(terminal);
            JSONObject src = wire.getJSONObject("src");
            int srcNum = src.getInt("moduleId");
            Module source = modules[srcNum];
            terminal = src.getString("terminal");
            source.setOutputPort(terminal, inputPort);           
        }
    }
    
    public void run() throws JSONException{
        for (int i = 0; i < modules.length; i++){
            modules[i].run();
        }
    }
    
    public JSONObject getJsonObject() throws JSONException{
        JSONObject me = new JSONObject();
        me.put("wires", wires);
        me.put("properties", properties);
        for (int i = 0; i < modules.length; i++){
            me.append("modules", modules[i].getJsonObject());
        }       
        return me;
    }
}
