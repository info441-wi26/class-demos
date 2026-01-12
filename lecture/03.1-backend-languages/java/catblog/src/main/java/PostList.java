import java.util.ArrayList;

public class PostList {
    public PostList(ArrayList<Post> posts) {
        this.posts = posts;
    }

    public ArrayList<Post> getPosts() {
        return posts;
    }

    public void setPosts(ArrayList<Post> posts) {
        this.posts = posts;
    }

    ArrayList<Post> posts;

}
