const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');

router.use(methodOverride('_method'));

require('../../utils/db');
const Order = require('../../model/order');
const Umkm = require('../../model/umkm');

router.get('/:id', async (req, res) => {
  if (!req.session.umkm) {
    res.redirect('/umkm-login');
  } else {
    const order = await Order.findOne({ id: req.params.id });
    const umkm = await Umkm.findOne({ username: req.session.umkm.trim() });
    res.render('umkm-edit-order-page', {
      title: 'Edit Status Order',
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

router.put('/', async (req, res) => {
  if (!req.session.umkm) {
    res.redirect('/umkm-login');
  } else {
    await Order.updateMany(
      { id: req.body.id },
      {
        $set: {
          orderStatus: req.body.orderStatus,
        },
      }
    );
    res.redirect('back');
  }
});

module.exports = router;
