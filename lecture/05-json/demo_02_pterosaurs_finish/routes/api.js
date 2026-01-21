import {promises as fs} from 'fs'
import express from 'express'
var router = express.Router()

router.get("/getPterosaurs", async (req, res) => {
    const data = await fs.readFile('data/pterosaur.json')
    let pterosaurInfo = JSON.parse(data)
    
    // filter out any without images
    let filteredPterosaurInfo = pterosaurInfo
        .filter(onePterosaur => onePterosaur.img != "")

    res.json(filteredPterosaurInfo)
})

export default router