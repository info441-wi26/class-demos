import spark.Request;
import spark.Response;
import spark.Route;

import java.sql.*;
import java.util.ArrayList;

import com.google.gson.Gson;

import javax.servlet.MultipartConfigElement;

import static spark.Spark.*;

public class Main {
    public static void main(String[] args) {
        Gson gson = new Gson();
        port(8000);
        staticFiles.location("public");
        get("/posts", allPosts, gson::toJson);
        get("/search", search, gson::toJson);
        post("/newpost", "multipart/form-data", newPost);
    }

    private static Route allPosts =
            (Request request, Response response) -> getPosts("SELECT title,author,body,timestamp FROM posts ORDER BY timestamp");

    private static Route search = (Request request, Response response) -> {
        String author = String.format("%%%s%%", request.queryParams("author"));
        String title = String.format("%%%s%%", request.queryParams("title"));
        String body = String.format("%%%s%%", request.queryParams("body"));

        String stmt = "SELECT title,author,body,timestamp FROM posts WHERE";
        if (author != null) {
            stmt += " author LIKE ? AND ";
        }

        if (title != null) {
            stmt += " title LIKE ? AND ";
        }

        if (body != null) {
            stmt += " title LIKE ? AND ";
        }
        stmt += "1=1";

        return getPosts(stmt);
    };

    private static Route newPost = (Request request, Response response) -> {
        MultipartConfigElement multipartConfigElement = new MultipartConfigElement("");
        request.raw().setAttribute("org.eclipse.jetty.multipartConfig", multipartConfigElement);

        String author = request.queryParams("author");
        String title = request.queryParams("title");
        String body = request.queryParams("body");

        Connection conn = null;
        Statement statement = null;
        ResultSet resultSet = null;

        try {
            conn = DriverManager.getConnection(
                    "jdbc:mysql://localhost:8889/Blog?" +
                            "user=root&password=root");

            PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO posts (title,author,body) VALUES (?,?,?)");

            ps.setString(1, title);
            ps.setString(2, author);
            ps.setString(3, body);

            ps.executeUpdate();
            ps.close();
        } catch (SQLException ex) {
            // handle any errors
            System.out.println("SQLException: " + ex.getMessage());
            System.out.println("SQLState: " + ex.getSQLState());
            System.out.println("VendorError: " + ex.getErrorCode());
            throw ex;
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException sqlEx) {
                } // ignore
            }
        }

        return "OK";
    };

    private static PostList getPosts(String query) throws SQLException {
        Connection conn = null;
        Statement statement = null;
        ResultSet resultSet = null;

        ArrayList<Post> results = new ArrayList<>();

        try {
            conn = DriverManager.getConnection(
                    "jdbc:mysql://localhost:8889/Blog?" +
                            "user=root&password=root");

            statement = conn.createStatement();
            resultSet = statement.executeQuery(query);

            while (resultSet.next()) {
                Post post = new Post(
                        resultSet.getString(1),
                        resultSet.getString(2),
                        resultSet.getString(3),
                        resultSet.getDate(4)
                );
                results.add(post);
            }
        } catch (SQLException ex) {
            // handle any errors
            System.out.println("SQLException: " + ex.getMessage());
            System.out.println("SQLState: " + ex.getSQLState());
            System.out.println("VendorError: " + ex.getErrorCode());
            throw ex;
        } finally {
            if (resultSet != null) {
                try {
                    resultSet.close();
                } catch (SQLException sqlEx) {
                } // ignore
            }

            if (statement != null) {
                try {
                    statement.close();
                } catch (SQLException sqlEx) {
                } // ignore
            }

            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException sqlEx) {
                } // ignore
            }
        }

        return new PostList(results);
    }
}