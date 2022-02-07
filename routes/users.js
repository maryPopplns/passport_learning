const express = require('express');
const router = express.Router();
const debug = require('debug')('passport-learning:users');

/* GET users listing. */
router.get('/', function (req, res, next) {
  debug(req.cookies);
  res.send('respond with a resource');
});

module.exports = router;
