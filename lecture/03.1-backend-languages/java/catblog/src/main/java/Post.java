import java.util.Date;

public class Post {
    public Post(String title, String author, String body, Date time) {
        this.title = title;
        this.author = author;
        this.body = body;
        this.time = time;
    }

    private String title;
    private String author;
    private String body;
    private Date time;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }
}
