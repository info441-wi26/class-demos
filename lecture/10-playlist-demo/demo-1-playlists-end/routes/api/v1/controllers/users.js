import express from 'express'
let router = express.Router()

router.get('/', async (req, res) => {
    try{
        const allUsers = await req.models.User.find()
        res.json(allUsers)
    }catch(err){
        console.log("error: ", err)
        res.status(500).json({status: "error"})
    }
})

router.post('/', async (req, res) => {
    try{
        const username = req.body.username

        const newUser = new req.models.User({
            username: username
        })

        await newUser.save()

        res.json({status: "success"})

    }catch(err){
        console.log("error: ", err)
        res.status(500).json({status: "error"})
    }
})

router.delete("/", async (req, res) => {
    const userId = req.body.userId

    // delete playslists for the user, then delete the given user
    await req.models.Playlist.deleteMany({user: userId})
    await req.models.User.deleteOne({_id: userId})

    res.json({status: "success"})
})

router.post('/bands', async (req, res) => {
    //TODO: try / catch
    const userId = req.body.userId
    const band = req.body.band

    // find the right user
    const user = await req.models.User.findById(userId)

    // update with the new band (if it wasn't already there)
    if(!user.favorite_bands.includes(band)){
        user.favorite_bands.push(band)
    }

    // save
    await user.save()

    res.json({status: "success"})
})

export default router