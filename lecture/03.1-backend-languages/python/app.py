from flask import Flask
from flask import json
from flask import request
from flask import send_from_directory
from flaskext.mysql import MySQL

app = Flask(__name__, static_folder='../public/')

mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'root'
app.config['MYSQL_DATABASE_DB'] = 'Blog'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
app.config['MYSQL_DATABASE_PORT'] = 8889
mysql.init_app(app)

@app.route('/posts')
def posts():
  data = all_posts()
  return json.dumps({
    'posts': data
  })

@app.route('/search')
def search_posts():
  author = request.args.get('author')
  return json.dumps({
    'posts': get_posts_from_db(search_params={'author': author})
  })

@app.route('/newpost', methods=['POST'])
def new_post():
  title = request.form['title']
  body = request.form['body']
  author = request.form['author']

  return write_post(post={
    'title': title,
    'body': body,
    'author': author
  })

@app.route('/')
def root():
  return app.send_static_file('index.html')

@app.route('/<path:path>')
def static_files(path):
  return send_from_directory(app.static_folder, path)

def write_post(post={}):
  qry = 'INSERT INTO posts (title, body, author) VALUES (%s, %s, %s)'
  placeholders = [
    post['title'],
    post['body'],
    post['author']
  ]

  conn = mysql.connect()
  cursor = conn.cursor()
  cursor.execute(qry, placeholders)
  data = cursor.fetchall()
  conn.close()

  return "OK"

def all_posts():
  return get_posts_from_db()

def get_posts_from_db(search_params={}):
  placeholders = []
  qry = "SELECT title,author,body from posts WHERE "
  for key in search_params:
    qry += '{0} LIKE %s AND '.format(key)
    placeholders.append(search_params[key])
  qry += '1=1'

  conn = mysql.connect()
  cursor = conn.cursor()
  cursor.execute(qry, placeholders)
  data = cursor.fetchall()
  conn.close()

  ret_data = []
  for row in data:
    ret_data.append({
      'title': row[0],
      'author': row[1],
      'body': row[2]
    })

  return ret_data