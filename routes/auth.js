const express = require('express');
const router = express.Router();
const debug = require('debug')('passport-learning:login');

/* GET users listing. */
router.get('/', function (req, res, next) {
  debug(req.cookies);
  res.end('login');
});

module.exports = router;
