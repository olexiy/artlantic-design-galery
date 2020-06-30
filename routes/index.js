const express = require('express');

const router = express.Router();

// @desc Login/Landing page
// @route GET /
router.get('/', (req, res) => {
  res.send('<h1>Hallo World!</h1>');
});

module.exports = router;
