import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import usersRouter from './routes/users.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

console.log("********************************")
console.log()

console.log("Pretending to log into mongodb database")
console.log()

console.log("I've set environment variables in the file '.env'; look to package.json for how it's included")
console.log("Note: IF YOU USE THIS, YOU SHOULD GIT IGNORE .env")
console.log("But if you set environment variables on the command line, those will override the ones in the file.")
console.log()

const dbUser = process.env.DB_USER_NAME
const dbPwd = process.env.DB_PASSWORD

console.log(`I've now loaded my username ("${dbUser}") and password ("${dbPwd}")`)
console.log()
console.log("so I can connect to mongo db with a string like: ")
console.log(`mongodb+srv://${dbUser}:${dbPwd}@cluster0.4pad9.mongodb.net/myFirstDatabase`)
// await mongoose.connect(`mongodb+srv://${dbUser}:${dbPwd}@cluster0.4pad9.mongodb.net/myFirstDatabase`)

console.log()
console.log("********************************")

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);

export default app;
