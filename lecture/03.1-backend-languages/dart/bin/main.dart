import 'dart:convert';

import 'package:angel_framework/angel_framework.dart';
import 'package:angel_framework/http.dart';
import 'package:angel_static/angel_static.dart';
import 'package:file/local.dart';
import 'package:mysql1/mysql1.dart';

const int PORT = 8000;
const String STATIC_DIR = "../public";
const List SEARCHABLE_KEYS = ['author', 'title', 'body'];

var dbSettings = ConnectionSettings(
  host: 'localhost',
  port: 8889,
  user: 'root',
  password: 'root',
  db: 'Blog',
);

main() async {
  var app = Angel();
  var http = AngelHttp(app);

  app.get('/posts', (req, res) async {
    List posts = [];
    try {
      posts = await allPosts();
      res.write(jsonEncode({'posts': posts}));
    } catch (e) {
      print('Something bad happened: $e');
      throw e;
    }
  });

  app.get('/search', (req, res) async {
    Map searchParams = {};
    SEARCHABLE_KEYS.forEach((key) {
      if (req.queryParameters.containsKey(key)) {
        searchParams[key] = '%${req.queryParameters[key]}%';
      }
    });

    if (searchParams.isEmpty) {
      throw AngelHttpException.badRequest(
          message:
              'Missing search parameters. Allowed values: $SEARCHABLE_KEYS');
    }

    List posts = [];
    try {
      posts = await getPostsFromDb(queryParameters: searchParams);
      res.write(jsonEncode({'posts': posts}));
    } catch (e) {
      print('Something bad happened: $e');
      throw e;
    }
  });

  app.post('/newpost', (req, res) async {
    await req.parseBody();

    List<String> requiredParams = ['title', 'author', 'body'];

    requiredParams.forEach((key) {
      if (!req.bodyAsMap.containsKey(key)) {
        throw AngelHttpException.badRequest(message: 'Missing parameter: $key');
      }
    });

    try {
      await writePost(postFields: req.bodyAsMap);
      res.write("OK");
    } catch (e) {
      print('Something bad happened: $e');
      throw e;
    }
  });

  var fs = const LocalFileSystem();
  var vDir = CachingVirtualDirectory(app, fs, source: fs.directory(STATIC_DIR));
  app.fallback(vDir.handleRequest);

  await http.startServer('localhost', PORT);
}

Future writePost({Map postFields = const {}}) async {
  String statement = "INSERT INTO posts (title, author, body) values (?, ?, ?)";
  List placeholders = [
    postFields['title'],
    postFields['author'],
    postFields['body'],
  ];

  final connection = await MySqlConnection.connect(dbSettings);
  await connection.query(statement, placeholders);
  connection.close();
}

Future<List> allPosts() async {
  return await getPostsFromDb();
}

Future<List> getPostsFromDb({Map queryParameters = const {}}) async {
  String statement = "SELECT author,title,body,timestamp FROM posts WHERE ";
  List<String> placeholders = [];
  SEARCHABLE_KEYS.forEach((key) {
    if (queryParameters.containsKey(key)) {
      statement += "$key LIKE ? AND ";
      placeholders.add(queryParameters[key]);
    }
  });

  statement += ' 1=1 ORDER BY timestamp';

  List posts = [];
  final connection = await MySqlConnection.connect(dbSettings);
  var results = await connection.query(statement, placeholders);

  results.forEach((row) {
    posts.add(Post(row[0], row[1], row[2], row[3]));
  });

  connection.close();

  return posts;
}

class Post {
  final String author;
  final String title;
  final Blob body;
  final DateTime time;

  Post(this.author, this.title, this.body, this.time);

  Map toJson() {
    return {
      'author': author,
      'title': title,
      'body': body.toString(),
      'time': time.toString(),
    };
  }
}
