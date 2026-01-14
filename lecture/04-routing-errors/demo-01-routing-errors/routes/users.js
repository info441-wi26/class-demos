import express from 'express';
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a list of all users');
});

router.get('/1', function(req, res, next) {
  res.send('respond with info about user 1');
});

export default router;
