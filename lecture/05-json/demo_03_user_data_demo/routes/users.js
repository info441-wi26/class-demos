import {promises as fs} from 'fs'
import express from 'express';
var router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let userInfo = await fs.readFile("data/usersData.json")
  res.type("json")
  res.send(userInfo)
});

router.post('/', async (req, res) => {
  console.log(req.body)

  await fs.writeFile("data/usersData.json", 
    JSON.stringify(req.body))
  
  res.send("success")
})



export default router;
