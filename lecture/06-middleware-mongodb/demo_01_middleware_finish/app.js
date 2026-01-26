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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    console.log("This is the first additional piece of middleware that I made")
    next()
    console.log("The first middleware gets one last chance to do something")
})

app.use((req, res, next) => {
    console.log("Second middleware adds information to the request to be used later")
    req.testValue = 3
    next()
})

app.use((req, res, next) => {
    console.log(
        "Third middleware, looks up the testValue, which is",
        req.testValue
    )
    next()
})

app.use('/users', usersRouter);

export default app;
