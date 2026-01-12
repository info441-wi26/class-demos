import {promises as fs} from 'fs'
import pluralize from 'pluralize';
import express from 'express'
const app = express()

app.get('/', async (req, res) => {
    console.log("request to '/', sending back html")
    res.type('html')
    let fileContents = await fs.readFile('index.html')

    res.send(fileContents)
})

app.get('/style.css', async (req, res) => {
    console.log("request to '/style.css', sending back css")
    res.type('css')
    let fileContents = await fs.readFile('style.css')
    res.send(fileContents)
})

app.get('/index.js', async (req, res) => {
    console.log("request to '/index.js', sending back js")
    res.type('js')
    let fileContents = await fs.readFile('index.js')
    res.send(fileContents)
})

app.get('/favicon.ico', async (req, res) => {
    console.log("request to '/favicon.ico', sending back png")
    res.type('png')
    let fileContents = await fs.readFile('favicon.ico')
    res.send(fileContents)
})

/**
 * @method GET 
 * @param query: word
 */
app.get('/api/pluralize', async (req, res) => {
    // expect GET localhost:3000/api/pluralize?word=coffee
    let inputWord = req.query.word
    if (!inputWord) {
        res.status(400)
        res.type("text")
        res.send("Error: need word")
    }

    let pluralWord = pluralize(inputWord)
    res.type("txt")
    res.send(pluralWord)
})

app.listen(3000, () => {
    console.log("Example app listening at http://localhost:3000")
})