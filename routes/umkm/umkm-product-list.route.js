const express = require('express');
const router = express.Router();

require('../../utils/db');
const Product = require('../../model/product');
const Umkm = require('../../model/umkm');

router.get('/', async (req, res) => {
  const umkm = await Umkm.findOne({ username: req.session.umkm });
  const products = await Product.find({ umkm: umkm.umkm_name });
  if (!req.session.umkm) {
    res.redirect('/umkm-login');
  } else {
    res.render('umkm-product-list', {
      title: 'List Produk',
      layout: 'layouts/umkm-main-layout',
      sessionUser: req.session.umkm,
      homeActive: '',
      orderListActive: '',
      productListActive: 'active',
      umkmListActive: '',
      products,
      umkm,
    });
  }
});

router.get('/add', async (req, res) => {
  const umkm = await Umkm.findOne({ username: req.session.umkm });
  if (!req.session.umkm) {
    res.redirect('/umkm-login');
  } else {
    try {
      res.render('umkm-product-add', {
        title: 'Tambah Data Produk',
        layout: 'layouts/umkm-main-layout',
        homeActive: '',
        orderListActive: '',
        productListActive: 'active',
        umkmListActive: '',
        umkm,
      });
    } catch (error) {
      console.log(error);
    }
  }
});

router.post('/add', async (req, res) => {
  const umkm = await Umkm.findOne({ username: req.session.umkm });
  if (!req.session.umkm) {
    res.redirect('/umkm-login');
  } else {
    try {
      const query = {
        product_name: req.body.product_name,
        description: req.body.description,
        price: req.body.price,
        umkm: umkm.umkm_name,
        category: req.body.category,
      };
      await Product.insertMany(query);
      res.redirect('/umkm-product-list');
    } catch (error) {
      console.log(error);
    }
  }
});

router.get('/:id', async (req, res) => {
  const umkms = await Umkm.find();
  const umkm = await Umkm.findOne({ username: req.session.umkm });
  const product = await Product.findOne({ _id: req.params.id });
  if (!req.session.umkm) {
    res.redirect('/umkm-login');
  } else {
    try {
      res.render('umkm-product-edit', {
        title: 'Ubah Data Produk',
        layout: 'layouts/umkm-main-layout',
        homeActive: '',
        orderListActive: '',
        productListActive: 'active',
        umkmListActive: '',
        umkms,
        umkm,
        product,
      });
    } catch (error) {
      console.log(error);
    }
  }
});

router.post('/edit', async (req, res) => {
  if (!req.session.umkm) {
    res.redirect('/umkm-login');
  } else {
    try {
      await Product.updateMany(
        { _id: req.body.id },
        {
          $set: {
            product_name: req.body.product_name,
            description: req.body.description,
            price: req.body.price,
            umkm: req.body.umkm,
            category: req.body.category,
          },
        }
      );
      res.redirect('/umkm-product-list');
    } catch (error) {
      console.log(error);
    }
  }
});

router.get('/delete/:id', async (req, res) => {
  if (!req.session.umkm) {
    res.redirect('/umkm-login');
  } else {
    try {
      await Product.deleteOne({ _id: req.params.id });
      res.redirect('/umkm-product-list');
    } catch (err) {
      console.log(err);
    }
  }
});

module.exports = router;
