const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const { body, validationResult, check } = require('express-validator');

require('../../utils/db');
const Admin = require('../../model/admin');

router.get('/', async (req, res) => {
  if (req.session.admin) {
    res.redirect('/admin-home');
  } else {
    res.render('admin-login-page', {
      title: 'Admin Login',
      layout: 'layouts/main-layout',
    });
  }
});

router.post('/', async (req, res) => {
  const errors = validationResult(req);
  try {
    const admin = await Admin.findOne({ username: req.body.username.trim() });
    console.log(admin);
    if (admin) {
      const match = await bcrypt.compare(req.body.password.trim(), admin.password);
      if (match) {
        req.session.admin = admin.username;
        res.redirect('/admin-home');
      } else {
        req.flash('msg', 'Wrong username or password  ');
        res.render('admin-login-page', {
          title: 'Admin Login',
          layout: 'layouts/main-layout',
          prevData: req.body,
          msg: req.flash('msg'),
        });
      }
    } else {
      req.flash('msg', 'User does not exist');
      res.render('admin-login-page', {
        title: 'Admin Login',
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
