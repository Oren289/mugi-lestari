const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const { body, validationResult, check } = require('express-validator');

require('../../utils/db');
const Umkm = require('../../model/umkm');

router.get('/', async (req, res) => {
  if (req.session.umkm) {
    res.redirect('/umkm-home');
  } else {
    res.render('umkm-login-page', {
      title: 'Umkm Login',
      layout: 'layouts/main-layout',
    });
  }
});

router.post('/', async (req, res) => {
  const errors = validationResult(req);
  try {
    const umkm = await Umkm.findOne({ username: req.body.username.trim() });
    if (umkm) {
      const match = await bcrypt.compare(req.body.password.trim(), umkm.password);
      if (match) {
        req.session.umkm = umkm.username;
        res.redirect('/umkm-home');
      } else {
        req.flash('msg', 'Wrong username or password  ');
        res.render('umkm-login-page', {
          title: 'Umkm Login',
          layout: 'layouts/main-layout',
          prevData: req.body,
          msg: req.flash('msg'),
        });
      }
    } else {
      req.flash('msg', 'User does not exist');
      res.render('umkm-login-page', {
        title: 'Umkm Login',
        layout: 'layouts/main-layout',
        prevData: req.body,
        msg: req.flash('msg'),
      });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
