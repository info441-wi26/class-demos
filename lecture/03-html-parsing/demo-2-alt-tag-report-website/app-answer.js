import {promises as fs} from 'fs'
import fetch from 'node-fetch'
import parser from 'node-html-parser'
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

app.get('/api/auditurl', async (req, res) => {
    let url = req.query.url

    const response = await fetch(url)
    const pageText = await response.text()
    
    const htmlPage = parser.parse(pageText)
    const imgTags = htmlPage.querySelectorAll("img")
    let htmlReturn = ""
    for(let i = 0; i < imgTags.length; i++){
        const imgTag = imgTags[i]
    
        htmlReturn += `
        <p>
            Image ${i} info: <br>
            alt text: ${imgTag.attributes.alt} <br>
            img src: ${imgTag.attributes.src} <br>
            <img src="${
                imgTag.attributes.src && imgTag.attributes.src.startsWith("http") ?
                 imgTag.attributes.src :
                 url + imgTag.attributes.src
                }" 
                style="max-width:300px"/>
        </p>`
    }

    res.type("txt")
    res.send(htmlReturn)
})

app.listen(3000, () => {
    console.log("Example app listening at http://localhost:3000")
})