import sqlite3 from 'sqlite3'
import express from 'express';
var router = express.Router();

// create/load database
let db = new sqlite3.Database(':memory:', (err) => {
  if(err){
    return console.error(err.message)
  }
  console.log("Connected to the in-memory sqlite database")
})

db.serialize(() => {
  db
    .run('CREATE TABLE people(first_name text, last_name text)')
    .run(`INSERT INTO people(first_name, last_name)
          VALUES ("Alessia", "Fitz Gibbon"),
                 ("Julie", "Ganbold")
      `)
    .run('CREATE TABLE secret_table(message text)')
    .run(`INSERT INTO secret_table(message)
        VALUES ('The password for the db is: pa55w0rd'),
               ('The treasure is hidden on the 5th floor')
               ('Operation treadstone has been shut down'),
               ('You also get this bonus message that was not in the lecture code!')
      `)
})


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

export default router;
