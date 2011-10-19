package uk.ac.manchester.cs.wireit;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;

/**
 * This is a base class for the various wireit classes.
 * Adds the abilty to open a connection to the mysql server and keep it open.
 * 
 * @author Christian
 */
public class WireitSQLBase extends HttpServlet{
    
    /**
     * Statement against which sql queries and updates can be run.
     */
    Statement stmt = null;

    /**
     * Sets up the servlet and creates an SQL statement against which queries can be run.
     * 
     * @throws ServletException Thrown if the SQL connection and statement can not be created.
     *     Including if the hard coded database, user and password are not found.
     */
    WireitSQLBase() throws ServletException{
        try {
            Class.forName("com.mysql.jdbc.Driver");         // for MySQL
        } catch (ClassNotFoundException ex) {
            throw new ServletException(ex);
        }

        Connection conn = null;
        SQLException sqlError = null;
        try {
            conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/wireit", "wireit", "taverna");
            stmt = conn.createStatement();
        } catch (SQLException ex) {
            ex.printStackTrace();
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException ex2) {
                ex2.printStackTrace();
                throw new ServletException(ex2);
            }        
            throw new ServletException(ex);
        }
    }    
    
        /**
     * Reads the data from the request body
     * @see http://java.sun.com/developer/onlineTraining/Programming/BasicJava1/servlet.html
     * @param request
     * @return 
     */
     String readRequestBody(HttpServletRequest request) throws IOException{
        StringBuilder json = new StringBuilder();
        String line = null;
        BufferedReader reader = request.getReader();
        while((line=reader.readLine()) != null ){
            json.append(line);
        }
        return json.toString();
    }

}
