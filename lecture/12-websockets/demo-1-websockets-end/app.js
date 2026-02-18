import express from 'express'
import enableWs from 'express-ws'

const app = express()
enableWs(app)

// track websocket connections
let socketCounter = 1
const allSockets = []

app.ws('/chatSocket', (ws, res) => {
    let mySocketNum = socketCounter
    socketCounter++
    console.log(`user ${mySocketNum} connected`)

    // add this ws to the global array tracking all websockets
    allSockets.push(ws)

    ws.on('message', chatMsg => {
        console.log(`msg (user ${mySocketNum}): ${chatMsg}`)
        // I want to send the message I got to all the other
        // browsers connected (using their websockets)
        for(const socket of allSockets){
            socket.send(`${mySocketNum}: ${chatMsg}`)
        }
    })

    ws.on('close', () => {
        console.log(`user ${mySocketNum} disconnected`)
        console.log("I should probably delete them from the array or something")
    })
})

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + "/index.html")
})

app.listen(3000, () => {
    console.log("Example app listening at http://localhost:3000")
})