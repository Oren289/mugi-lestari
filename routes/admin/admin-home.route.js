const express = require('express');
const router = express.Router();

require('../../utils/db');
const Order = require('../../model/order');
const Admin = require('../../model/admin');

router.get('/', async (req, res) => {
  const orders = await Order.find();
  if (!req.session.admin) {
    res.redirect('/admin-login');
  } else {
    res.render('admin-home-page', {
      title: 'Dashboard',
      layout: 'layouts/admin-main-layout',
      sessionUser: req.session.admin,
      homeActive: 'active',
      orderListActive: '',
      productListActive: '',
      umkmListActive: '',
      orders,
    });
  }
});

module.exports = router;
