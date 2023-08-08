const express = require('express');
const router = express.Router();

require('../../utils/db');
const Order = require('../../model/order');
const Umkm = require('../../model/umkm');

router.get('/', async (req, res) => {
  const orders = await Order.find({ username_umkm: req.session.umkm });
  const umkm = await Umkm.findOne({ username: req.session.umkm.trim() });
  console.log(orders);
  if (!req.session.umkm) {
    res.redirect('/umkm-login');
  } else {
    res.render('umkm-order-list', {
      title: 'Daftar Pemesanan',
      layout: 'layouts/umkm-main-layout',
      sessionUser: req.session.admin,
      homeActive: '',
      orderListActive: 'active',
      productListActive: '',
      umkmListActive: '',
      orders,
      umkm,
    });
  }
});

router.get('/:id', async (req, res) => {
  const order = await Order.findOne({ id: req.params.id });
  const umkm = await Umkm.findOne({ username: req.session.umkm.trim() });
  if (!req.session.umkm) {
    res.redirect('/umkm-login');
  } else {
    res.render('umkm-order-detail-page', {
      title: 'Order Detail',
      layout: 'layouts/umkm-main-layout',
      sessionUser: req.session.umkm,
      homeActive: '',
      orderListActive: 'active',
      productListActive: '',
      umkmListActive: '',
      order,
      umkm,
    });
  }
});

router.get('/change-payment-status/:orderid', async (req, res) => {
  if (!req.session.umkm) {
    res.redirect('/umkm-login');
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
    res.redirect('/umkm-order-list/' + order.id);
  }
});

router.get('/delete/:id', async (req, res) => {
  if (!req.session.umkm) {
    res.redirect('/umkm-login');
  } else {
    try {
      await Order.deleteOne({ id: req.params.id });
      res.redirect('/umkm-order-list');
    } catch (err) {
      console.log(err);
    }
  }
});

module.exports = router;
