const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  next();
});

router.get('/cool', function(req, res, next) {
  res.send('You\'re so cool')
  next()
})

module.exports = router;
