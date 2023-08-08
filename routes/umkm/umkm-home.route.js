const express = require('express');
const router = express.Router();

require('../../utils/db');
const Umkm = require('../../model/umkm');

router.get('/', async (req, res) => {
  const umkm = await Umkm.findOne({ username: req.session.umkm.trim() });
  if (!req.session.umkm) {
    res.redirect('/umkm-login');
  } else {
    res.render('umkm-home-page', {
      title: 'Dashboard',
      layout: 'layouts/umkm-main-layout',
      sessionUser: req.session.umkm,
      homeActive: 'active',
      orderListActive: '',
      productListActive: '',
      umkmListActive: '',
      umkm,
    });
  }
});

module.exports = router;
