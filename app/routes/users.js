var express = require('express');
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLogger (req, res, next) {
  console.log('Router-level middleware. Time:', Date.now());
  next();
});

module.exports = router;
