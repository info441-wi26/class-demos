# Backends in a variety of languages

## Node
HTTP framework used: Express.

## Java
HTTP framework used: SparkJava

## Python
HTTP framework used: Flask

## Dart
HTTP framework used: Angel

## Go
HTTP framework used: Http/Mux

# API

The API implemented here is a straightforward 3 endpoints. The corresponding SQL table is in `setup.sql`.

## `/posts`

Returns all posts by all authors, ordered by time.

Method: GET
Params: None
Return: JSON

### Example Response
```javascript
{
  "posts": [
    {
      "title": "Intro to Orange and Juice!",
      "body": "This is an introduction to Fitz's two cats, Orange and Juice.",
      "time": "2019-11-01T21:15:00-08:00",
      "author": "Fitz"
    }
  ]
}
```

## `/newpost`

Writes a new post to the database.

Method: POST
Params: title, author, body
Return: plain text (error/success message)

## `/search`

Searches for posts containing text in the given fields.

Method: GET
Params: Query string, one of author, title, body.
Return: JSON

### Example Response
```javascript
{
  "posts": [
    {
      "title": "Intro to Orange and Juice!",
      "body": "This is an introduction to Fitz's two cats, Orange and Juice.",
      "time": "2019-11-01T21:15:00-08:00",
      "author": "Fitz"
    }
  ]
}
```