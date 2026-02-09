import express from 'express';
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.session.isAuthenticated){
    res.send(`Here is the information for you:
      your account name is: ${req.session.account.name}
      and your username is: ${req.session.account.username}`)
  } else {
    res.send("error: You must be logged in")
  }
});

export default router;
