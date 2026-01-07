const express = require('express')
const app = express()

app.get('/', (req, res) => {
    console.log("request to '/', sending back html")
    res.type("html")
    res.send(`
        <html>
            <head>
                <link rel="stylesheet" href="style.css">
            </head>
            <body>
                <h1>Hello World</h1>
            </body>
        </html>
        `)
})

app.get('/style.css', (req, res) => {
    console.log("request to 'style.css', sending back css content")
    res.type("css")
    res.send(`
        h1{color:red;}
        body{background-color:lightyellow;}
    `)
})


app.listen(3000, () => {
    console.log("Example app listening at http://localhost:3000")
})