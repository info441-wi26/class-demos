package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

// ------ Context Struct Definition ------

// DatabaseContext contains a reference to a MySQL database connection
type DatabaseContext struct {
	Client *sql.DB
}

// NewDatabaseContext is a constructor for creating a new DatabaseContext struct
func NewDatabaseContext(client *sql.DB) *DatabaseContext {
	return &DatabaseContext{client}
}

// ------ Post Struct Definition ------

// Post represents a blog post
type Post struct {
	Title  string `json:"title"`
	Body   string `json:"body"`
	Time   string `json:"time"`
	Author string `json:"author"`
}

// AllPosts represents a list of blog posts
type AllPosts struct {
	Posts []*Post `json:"posts"`
}

// ------ Starting Point of Program Execution ------

func main() {
	// Get the server address (i.e. "localhost:80") from the ADDR environment variable
	// Otherwise set the default to be port 8000
	addr := os.Getenv("ADDR")
	if len(addr) == 0 {
		addr = ":8000"
	}

	// Define our data source name (DSN), used to start a connection with the database
	// The DSN takes the form: `username:password@protocol(address)/dbname`
	dsn := "root:root@tcp(localhost:8889)/Blog"

	// Create a database object, which manages a pool of network connections to the
	// database server using the above dsn
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}

	// Ensure that the database gets closed when we are done
	defer db.Close()

	// We need a way of accessing the database connection we just created
	// in each of our handler functions. We can do this by constructing a
	// new DatabaseContext struct so we can store our DB connection. Below
	// each of our handler functions will be called with the DBContext as a
	// receiver and thus allow each handler to access the data stored within
	// the context.
	dbc := NewDatabaseContext(db)

	// Create new server (similar to const app = express(); in Node)
	mux := http.NewServeMux()

	// Define API routes and associated handler functions
	mux.HandleFunc("/posts", dbc.GetAllPosts)
	mux.HandleFunc("/newpost", dbc.CreateNewPost)
	mux.HandleFunc("/search", dbc.SearchForPosts)

	// Serve static clientside files at the "/" route
	fs := http.FileServer(http.Dir("../public"))
	mux.Handle("/", fs)

	// Start server at the given address
	log.Printf("Server is listening at %s...", addr)
	log.Fatal(http.ListenAndServe(addr, mux))
}

// ------ Handler Function Definitions ------

// GetAllPosts returns all posts by all authors, ordered by time.
// Method: GET
// Params: None
// Return: JSON
func (dbc *DatabaseContext) GetAllPosts(w http.ResponseWriter, r *http.Request) {
	// Only execute the handler function code if the HTTP Method is GET
	if r.Method == http.MethodGet {
		// Access our database reference contained within our DatabaseContext
		db := dbc.Client

		// Execute our SQL statement and get the returned rows
		rows, err := db.Query("SELECT title,author,body,timestamp FROM posts ORDER BY timestamp")
		defer rows.Close()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError) // 500 Status Code
			w.Write([]byte(fmt.Sprintf("Error selecting posts from DB: %v", err)))
			return
		}

		// Create an AllPosts struct for storing all the posts we get from
		// our SQL query
		allPosts := &AllPosts{}

		// For each row returned from the SQL query
		for rows.Next() {
			// Create a new post struct
			post := &Post{}

			// Scan SQL data into post struct
			// Remember the values you pass into scan should match the order of your SQL table columns
			err := rows.Scan(&post.Title, &post.Author, &post.Body, &post.Time)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError) // 500 Status Code
				w.Write([]byte(fmt.Sprintf("Error scanning posts: %v", err)))
				return
			}

			// Add post struct to the AllPosts.Posts slice (i.e. Go version of an array)
			allPosts.Posts = append(allPosts.Posts, post)
		}

		// If we got an error fetching the next row, report it
		if err := rows.Err(); err != nil {
			w.WriteHeader(http.StatusInternalServerError) // 500 Status Code
			w.Write([]byte(fmt.Sprintf("Error fetching posts: %v", err)))
			return
		}

		// Convert (marshal) the allPosts struct into JSON for sending to the client
		allPostsJSON, err := json.Marshal(allPosts)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError) // 500 Status Code
			w.Write([]byte(fmt.Sprintf("Error marshaling all posts into JSON: %v", err)))
			return
		}

		// Set the correct response headers and send the JSON back to the client
		w.WriteHeader(http.StatusOK) // 200 Status Code
		w.Header().Set("Content-Type", "application/json")
		w.Write(allPostsJSON)
	} else {
		// If the client called this endpoint with the incorrect HTTP method let them know
		w.WriteHeader(http.StatusMethodNotAllowed) // 405 Status Code
		w.Write([]byte("HTTP Method Not Allowed: This endpoint only allows GET requests."))
	}
}

// CreateNewPost writes a new post to the database.
// Method: POST
// Params: title, author, body
// Return: plain text (error/success message)
func (dbc *DatabaseContext) CreateNewPost(w http.ResponseWriter, r *http.Request) {
	// Only execute the handler function code if the HTTP Method is POST
	if r.Method == http.MethodPost {
		// Create new post struct to store information from the request body
		newPost := &Post{}

		r.ParseMultipartForm(r.ContentLength)

		// NOTE: this is not idiomatic Go!
		err := ""
		if val, ok := r.Form["title"]; ok {
			newPost.Title = val[0]
		} else {
			err = "Missing field!"
		}

		if val, ok := r.Form["author"]; ok {
			newPost.Author = val[0]
		} else {
			err = "Missing field!"
		}

		if val, ok := r.Form["body"]; ok {
			newPost.Body = val[0]
		} else {
			err = "Missing field!"
		}

		// Decode the request body into the Post struct. If there is an error,
		// respond to the client with the error message and a 400 status code.
		//err := json.NewDecoder(r.PostForm).Decode(newPost)

		if err != "" {
			w.WriteHeader(http.StatusBadRequest) // 400 Status Code
			w.Write([]byte(fmt.Sprintf("Error decoding request body: %v", err)))
			return
		}

		// Access our database reference contained within our DatabaseContext
		db := dbc.Client

		// Execute our SQL statement
		insertQry := "INSERT INTO posts (title, author, body) VALUES (?,?,?)"
		_, sqlErr := db.Exec(insertQry, newPost.Title, newPost.Author, newPost.Body)
		if sqlErr != nil {
			w.WriteHeader(http.StatusInternalServerError) // 500 Status Code
			w.Write([]byte(fmt.Sprintf("Error inserting new post into DB: %v", err)))
			return
		}

		// If the post is successfully added to our DB, let the client know
		w.WriteHeader(http.StatusCreated) // 201 Status Code
		w.Write([]byte("New post successfully created!"))
	} else {
		// If the client called this endpoint with the incorrect HTTP method let them know
		w.WriteHeader(http.StatusMethodNotAllowed) // 405 Status Code
		w.Write([]byte("HTTP Method Not Allowed: This endpoint only allows POST requests."))
	}
}

// SearchForPosts searches for posts containing text in the given fields.
// Method: GET
// Params: Query string, one of author, title, body.
// Return: JSON
func (dbc *DatabaseContext) SearchForPosts(w http.ResponseWriter, r *http.Request) {
	// Only execute the handler function code if the HTTP Method is GET
	if r.Method == http.MethodGet {
		// Get query parameters and check that they exist
		query := r.URL.Query()
		author := query.Get("author")
		if len(author) <= 0 {
			w.WriteHeader(http.StatusBadRequest) // 400 Status Code
			w.Write([]byte("Error missing author parameter."))
			return
		}
		title := query.Get("title")
		if len(title) <= 0 {
			w.WriteHeader(http.StatusBadRequest) // 400 Status Code
			w.Write([]byte("Error missing title parameter."))
			return
		}
		body := query.Get("body")
		if len(body) <= 0 {
			w.WriteHeader(http.StatusBadRequest) // 400 Status Code
			w.Write([]byte("Error missing body parameter."))
			return
		}

		// Concatnate '%' to given query parameters in preparation for the below SQL statement
		// Note: '%' is the escape character in formatted Golang strings, so the below strings
		// will be of the form '%author%', '%title%', and '%body%'. Where author, title, and body
		// are replaced with the values that those variables were associated with above.
		author = fmt.Sprintf("%%%s%%", author)
		title = fmt.Sprintf("%%%s%%", title)
		body = fmt.Sprintf("%%%s%%", body)

		// Access our database reference contained within our DatabaseContext
		db := dbc.Client

		// Execute SQL statement and get the returned rows
		qry := "SELECT title,author,body,timestamp FROM posts WHERE author LIKE ? AND title LIKE ? AND body LIKE ?"
		rows, err := db.Query(qry, author, title, body)
		defer rows.Close()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError) // 500 Status Code
			w.Write([]byte(fmt.Sprintf("Error selecting posts from DB: %v", err)))
			return
		}

		// Create an AllPosts struct for storing all the posts we get from
		// our SQL query
		allPosts := &AllPosts{}

		// For each row returned from the SQL query
		for rows.Next() {
			// Create a new post struct
			post := &Post{}

			// Scan SQL data into post struct
			// Remember the values you pass into scan should match the order of your SQL table columns
			err := rows.Scan(&post.Title, &post.Author, &post.Body, &post.Time)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError) // 500 Status Code
				w.Write([]byte(fmt.Sprintf("Error scanning posts: %v", err)))
				return
			}

			// Add post struct to the AllPosts.Posts slice (i.e. Go version of an array)
			allPosts.Posts = append(allPosts.Posts, post)
		}

		// If we got an error fetching the next row, report it
		if err := rows.Err(); err != nil {
			w.WriteHeader(http.StatusInternalServerError) // 500 Status Code
			w.Write([]byte(fmt.Sprintf("Error fetching posts: %v", err)))
			return
		}

		// Convert (marshal) the allPosts struct into JSON for sending to the client
		allPostsJSON, err := json.Marshal(allPosts)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError) // 500 Status Code
			w.Write([]byte(fmt.Sprintf("Error marshaling all posts into JSON: %v", err)))
			return
		}

		// Set the correct response headers and send the JSON back to the client
		w.WriteHeader(http.StatusOK) // 200 Status Code
		w.Header().Set("Content-Type", "application/json")
		w.Write(allPostsJSON)
	} else {
		// If the client called this endpoint with the incorrect HTTP method let them know
		w.WriteHeader(http.StatusMethodNotAllowed) // 405 Status Code
		w.Write([]byte("HTTP Method Not Allowed: This endpoint only allows GET requests."))
	}
}
