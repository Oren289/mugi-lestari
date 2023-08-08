const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/admin-login');
    }
  });
});

module.exports = router;
