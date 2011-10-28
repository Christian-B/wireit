package uk.ac.manchester.cs.wireit;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLDecoder;
import java.util.Date;
import java.util.HashMap;
import java.util.StringTokenizer;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONException;
import org.json.JSONObject;
import uk.ac.manchester.cs.wireit.module.WireItRunException;
import uk.ac.manchester.cs.wireit.taverna.TavernaException;

public class RunWireit extends WireitSQLBase {
    
    public RunWireit() throws ServletException{
        super();
    }
 
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        System.out.println();
         System.out.println((new Date()) + "in runWireit.doPost");
        try {
            String input = readRequestBody(request);
            System.out.println(input);
            HashMap<String, String> parameters = convertBody(input);
            String workingString = parameters.get("working");
            JSONObject jsonInput = new JSONObject(workingString);
            System.out.println(jsonInput.toString(4));
            JSONObject jsonReply = doRun(jsonInput, request.getRequestURL());
            System.out.println(jsonReply.toString(4));
            // Set the MIME type for the response message
            response.setContentType("text/x-json;charset=UTF-8");  
            // Get a output writer to write the response message into the network socket
            PrintWriter out = response.getWriter();
            String output = getOutput(parameters.get("name"), jsonReply, parameters.get("language"));
            out.println(output);
        } catch (Exception ex) {
            ex.printStackTrace();
            throw new ServletException(ex);
        }        
    }
  
    private String getOutput(String name, JSONObject working, String language){
        StringBuilder builder = new StringBuilder();
        builder.append("{\"id\":\"0\",\n");
        builder.append("\"name\":\"");
        builder.append(name);
        builder.append("\",\n");
        String workingSt = URLEncoder.encode(working.toString());
        workingSt = workingSt.replace("\"","\\\"");
        builder.append("\"working\":\"");
        builder.append(workingSt);
        builder.append("\",\n");
        builder.append("\"language\":\"");
        builder.append(language);
        builder.append("\"}");
        return builder.toString();
    }
    
    private HashMap<String, String> convertBody(String input) {
        StringTokenizer tokens = new StringTokenizer(input, "&");
        HashMap<String, String> parameters = new HashMap<String, String>();
        while (tokens.hasMoreElements()){
            String token = tokens.nextToken();
            String key = token.substring(0,token.indexOf("="));
            String encoded = token.substring(token.indexOf("=")+1,token.length());
            String decoded = URLDecoder.decode(encoded);
            parameters.put(key, decoded);
        }
        return parameters;
    }

    private JSONObject doRun(JSONObject jsonInput, StringBuffer URL) 
            throws WireItRunException, JSONException, TavernaException, IOException{
        Wiring wiring = new Wiring(jsonInput, URL);
        wiring.run();
        return wiring.getJsonObject();
        //JSONArray jsonModules = jsonInput.getJSONArray("modules");
        //JSONObject commentBox = (JSONObject)jsonModules.get(0);
        //JSONObject value = commentBox.getJSONObject("value");
        //value.put("comment", "Ran sucessfullly");
        //return jsonInput;
    }

}
