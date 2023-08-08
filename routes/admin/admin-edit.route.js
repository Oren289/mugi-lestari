const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');

router.use(methodOverride('_method'));

require('../../utils/db');
const Order = require('../../model/order');
const Admin = require('../../model/admin');

router.get('/:id', async (req, res) => {
  if (!req.session.admin) {
    res.redirect('/admin-login');
  } else {
    const order = await Order.findOne({ id: req.params.id });

    res.render('admin-edit-order-page', {
      title: 'Edit Status Order',
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

router.put('/', async (req, res) => {
  if (!req.session.admin) {
    res.redirect('/admin-login');
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
