import express from 'express';
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.session.userid){
    res.send(`Here is the information for you (${req.session.userid})`)
  } else {
    res.send("error: You must be logged in")
  }
});

router.post('/login', (req, res) => {

  if(req.session.userid){
    res.send("Error: you are already logged in as " + req.session.userid )
    return
  }

  // check username and password
  if(req.body.username == "asfg" && req.body.password == "12345"){
    req.session.userid = "asfg"
    res.send("you logged in")
  } else if(req.body.username == "anotheruser" && req.body.password == "pwd"){
    req.session.userid = "anotheruser"
    res.send("you logged in")
  } else {
    res.send("wrong login info")
  }
})

router.post('/logout', (req, res) => {
  req.session.destroy()
  res.send("you are logged out")
})
export default router;
