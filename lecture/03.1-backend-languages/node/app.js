"use strict";

const SEARCHABLE_BLOG_POST_FIELDS = ['title', 'body', 'author'];

const express = require('express');
const fs = require('fs').promises;
const util = require('util');
const multer = require('multer');
const glob = require('glob');
const mysql = require('mysql2/promise');

const globPromise = util.promisify(glob);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(multer().none());

const db = mysql.createPool({
  // Variables for connections to the database.
  host: process.env.DB_URL || 'localhost',
  port: process.env.DB_PORT || '8889',
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'Blog'
});

app.get('/search', async function (req, res) {
  let author = req.query['author'];

  try {
    let searchResult = await getPostsFromDb({author: '%' + author + '%'});
    res.json( {"posts": searchResult} );
  } catch (err) {
    res.status(500).type('text').send("Error fetching from DB: " + err);
  }
});

app.get('/posts', async function (req, res) {
  let returnPosts = await allPosts();
  res.json(returnPosts);
});

app.post('/newpost', async function (req, res) {
  // validate: title, body, author needed at minimum
  let requiredFields = ['title', 'body', 'author'];
  let missingFields = [];
  requiredFields.forEach((field) => {
    if (req.body[field] === undefined) {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    res.status(400).type('text').send("Missing parameters: " + missingFields);
  }

  try {
    await writePost(req.body);
    res.status(200).type('text').send("OK");
  } catch (err) {
    res.status(500).type('text').send("Error writing post: " + err);
  }
});

async function allPosts() {
  let returnPosts = {
    "posts": []
  };

  let posts;
  try {
    posts = await getPostsFromDb();
  } catch (err) {
    console.log(err);
  }

  for (let i = 0; i < posts.length; i++) {
    let post = {
      "title": posts[i]['title'],
      "body": posts[i]['body'],
      "author": posts[i]['author'],
      "time": posts[i]['timestamp']
    };
    returnPosts["posts"].push(post);
  }

  return returnPosts;
}

/**
 * Retrieve posts from the database.
 * 
 * @param {JSON} searchParams JSON object containing the fields to search for. Unknown fields will be ignored.
 */
async function getPostsFromDb(searchParams) {
  let statement = "SELECT * FROM posts";
  if (searchParams) {
    statement += " WHERE ";
    for (let field of SEARCHABLE_BLOG_POST_FIELDS) {
      if (searchParams[field]) {
        statement += field + ' LIKE :' + field + ' AND ';
      }
    }
    statement += '1=1'; // Fencepost
  }

  statement += " ORDER BY timestamp";

  console.log(statement);
  let [rows, fields] = await db.query({
    sql: statement,
    namedPlaceholders: true
  }, searchParams);

  return rows;
}

async function writePost(post) {
  let title = post.title;
  let body = post.body;
  let author = post.author;

  let statement = 'INSERT INTO posts (title, author, body) VALUES (?,?,?)'; 
  let [rows, fields] = await db.query(statement, [title, author, body]);
  console.log(rows);
}

function isEmpty(value) {
  if (value == null || value == undefined || value.length == 0) {
    return true;
  } else {
    return true;
  }
};


app.use(express.static("../public"));
const PORT = process.env.PORT || 8000;
app.listen(PORT);
