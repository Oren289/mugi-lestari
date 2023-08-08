const express = require('express');
const router = express.Router();

require('../../utils/db');
const Order = require('../../model/order');

router.get('/', async (req, res) => {
  const orders = await Order.find();
  console.log(orders);
  if (!req.session.admin) {
    res.redirect('/admin-login');
  } else {
    res.render('admin-order-list-page', {
      title: 'Daftar Pemesanan',
      layout: 'layouts/admin-main-layout',
      sessionUser: req.session.admin,
      homeActive: '',
      orderListActive: 'active',
      productListActive: '',
      umkmListActive: '',
      orders,
    });
  }
});

router.get('/:id', async (req, res) => {
  const order = await Order.findOne({ id: req.params.id });
  if (!req.session.admin) {
    res.redirect('/admin-login');
  } else {
    res.render('admin-order-detail-page', {
      title: 'Order Detail',
      layout: 'layouts/admin-main-layout',
      sessionUser: req.session.admin,
      homeActive: '',
      orderListActive: 'active',
      productListActive: '',
      umkmListActive: '',
      order,
    });
  }
});

router.get('/change-payment-status/:orderid', async (req, res) => {
  if (!req.session.admin) {
    res.redirect('admin-login');
  } else {
    const order = await Order.findOne({ id: req.params.orderid });
    await Order.updateOne(
      { id: order.id },
      {
        $set: {
          paymentStatus: 'Payment confirmed',
        },
      }
    );
    res.redirect('/admin-order-list/' + order.id);
  }
});

router.get('/delete/:id', async (req, res) => {
  if (!req.session.admin) {
    res.redirect('/login');
  } else {
    try {
      await Order.deleteOne({ id: req.params.id });
      res.redirect('/admin-order-list');
    } catch (err) {
      console.log(err);
    }
  }
});

module.exports = router;
