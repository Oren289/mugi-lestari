const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');

const User = require('../model/user');
const Cart = require('../model/cart');
const Umkm = require('../model/umkm');

router.use(methodOverride('_method'));

router.get('/', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    const user = await User.findOne({ _id: req.session.userid });
    const carts = await Cart.findOne({ username: user.username });
    const umkm = await Umkm.findOne({ umkm_name: carts.current_umkm });
    res.render('cart-page', {
      title: 'My Cart',
      layout: 'layouts/main-nav-layout',
      sessionUser: req.session.user,
      carts,
      umkm,
      error: '',
    });
  }
});

router.post('/', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    try {
      const user = await User.findOne({ _id: req.session.userid });
      let carts = await Cart.findOne({ username: user.username });
      const checkDifferentUmkm = await Cart.findOne({ username: user.username, 'products.umkm': req.body.umkm });
      const checkDuplicate = await Cart.findOne({ username: user.username, 'products.id': req.body.product_id });
      const umkm = await Umkm.findOne({ umkm_name: carts.current_umkm });

      if (carts.products.length !== 0 && checkDifferentUmkm === null) {
        res.render('cart-page', {
          title: 'My Cart',
          layout: 'layouts/main-nav-layout',
          sessionUser: req.session.user,
          carts,
          umkm,
          error: 'Tidak dapat menambahkan produk dari UMKM yang berbeda. Silahkan hapus terlebih dahulu produk yang sudah ditambahkan!',
        });

        return;
      }

      if (checkDuplicate) {
        const query = {
          $inc: {
            'products.$.quantity': req.body.quantity,
            grandTotal: parseInt(req.body.price) * parseInt(req.body.quantity),
          },
        };
        await Cart.updateOne({ username: user.username, 'products.id': req.body.product_id }, query);
      } else {
        const query = {
          $push: {
            products: {
              id: req.body.product_id,
              name: req.body.name,
              price: req.body.price,
              umkm: req.body.umkm,
              image: req.body.image,
              quantity: req.body.quantity,
            },
          },
        };
        await Cart.updateMany({ username: user.username }, query);
        await Cart.updateMany({ username: user.username }, { current_umkm: req.body.umkm });
        await Cart.updateMany(
          { username: user.username },
          {
            $inc: {
              grandTotal: parseInt(req.body.price) * parseInt(req.body.quantity),
            },
          }
        );
      }

      carts = await Cart.findOne({ username: user.username });
      res.render('cart-page', {
        title: 'My Cart',
        layout: 'layouts/main-nav-layout',
        sessionUser: req.session.user,
        carts,
        umkm,
        error: '',
      });
    } catch (error) {
      console.log(error);
    }
  }
});

router.post('/delete', async (req, res) => {
  const user = await User.findOne({ _id: req.session.userid });
  try {
    await Cart.updateMany({ username: user.username }, { $pull: { products: { id: req.body.product_id } } });
    await Cart.updateOne(
      { username: user.username },
      {
        $inc: {
          grandTotal: -(parseInt(req.body.price) * parseInt(req.body.quantity)),
        },
      }
    );
    console.log(user.username);
    res.redirect('/cart');
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
