import express from 'express'
let router = express.Router()

router.get("/", async (req, res) => {
    const userId = req.query.userId

    //load playlists for the given user
    const userPlaylists = await req.models.Playlist.find({user: userId})

    res.json(userPlaylists)
})

router.post("/", async (req, res) => {
    const title = req.body.title
    const songs = req.body.songs
    const userId = req.body.userId

    //create playlist
    const newPlaylist = new req.models.Playlist({
        title: title,
        songs: songs,
        user: userId
    })

    await newPlaylist.save()
    
    res.json({status: "success"})
    // TODO: catch errors
})

export default router