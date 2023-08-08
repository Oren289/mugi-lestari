const express = require('express');
const router = express.Router();

require('../../utils/db');
const Product = require('../../model/product');
const Umkm = require('../../model/umkm');

router.get('/', async (req, res) => {
  const products = await Product.find();
  console.log(products);
  if (!req.session.admin) {
    res.redirect('/admin-login');
  } else {
    res.render('admin-product-list', {
      title: 'List Produk',
      layout: 'layouts/admin-main-layout',
      sessionUser: req.session.admin,
      homeActive: '',
      orderListActive: '',
      productListActive: 'active',
      umkmListActive: '',
      products,
    });
  }
});

router.get('/add', async (req, res) => {
  const umkms = await Umkm.find();
  if (!req.session.admin) {
    res.redirect('/login');
  } else {
    try {
      res.render('admin-product-add', {
        title: 'Tambah Data Produk',
        layout: 'layouts/admin-main-layout',
        homeActive: '',
        orderListActive: '',
        productListActive: 'active',
        umkmListActive: '',
        umkms,
      });
    } catch (error) {
      console.log(error);
    }
  }
});

router.post('/add', async (req, res) => {
  if (!req.session.admin) {
    res.redirect('/login');
  } else {
    try {
      const query = {
        product_name: req.body.product_name,
        description: req.body.description,
        price: req.body.price,
        umkm: req.body.umkm,
        category: req.body.category,
      };
      await Product.insertMany(query);
      res.redirect('/admin-product-list');
    } catch (error) {
      console.log(error);
    }
  }
});

router.get('/:id', async (req, res) => {
  const umkms = await Umkm.find();
  const product = await Product.findOne({ _id: req.params.id });
  if (!req.session.admin) {
    res.redirect('/login');
  } else {
    try {
      res.render('admin-product-edit', {
        title: 'Ubah Data Produk',
        layout: 'layouts/admin-main-layout',
        homeActive: '',
        orderListActive: '',
        productListActive: 'active',
        umkmListActive: '',
        umkms,
        product,
      });
    } catch (error) {
      console.log(error);
    }
  }
});

router.post('/edit', async (req, res) => {
  if (!req.session.admin) {
    res.redirect('/login');
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
      res.redirect('/admin-product-list');
    } catch (error) {
      console.log(error);
    }
  }
});

router.get('/delete/:id', async (req, res) => {
  if (!req.session.admin) {
    res.redirect('/login');
  } else {
    try {
      await Product.deleteOne({ _id: req.params.id });
      res.redirect('/admin-product-list');
    } catch (err) {
      console.log(err);
    }
  }
});

module.exports = router;
