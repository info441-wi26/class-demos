import express from 'express'
var router = express.Router()

router.get('/', (req, res) => {
    res.send("this is the desserts section")
})

router.get('/1', (req, res) => {
    res.send("Chocolate Cake")
})

// broken endpoint to show error problems
router.get('/2', async (req, res) => {

    // Fake an error to pretend our database failed or something
    throw(new Error("Loading dessert 2 failed"))

    res.send("Ice Cream")
})

//error handling done correctly
router.get('/3', async (req, res) => {
    try{
        // Fake an error to pretend our database failed or something
        throw(new Error("Loading dessert 2 failed"))

        res.send("Pie")
    }catch(err){
        console.log(err)
        res.status(500).send("Error loading dessert")
    }
})

export default router