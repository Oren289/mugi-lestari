const express = require('express');
const router = express.Router();

require('../utils/db');
const User = require('../model/user');
const Product = require('../model/product');
const Umkm = require('../model/umkm');

router.get('/', async (req, res) => {
  // const string = "Kue Semprit is a pastries made from maizena, egg, and sugar. it is in flower-like shape with a chocolate chip in the middle of it";
  // const query = {
  //   product_name: "Kue Semprit",
  //   description: "Kue Semprit is a pastries made from maizena, egg, and sugar. it is in flower-like shape with a chocolate chip in the middle of it",
  //   short_description: string.substring(0, 50) + "...",
  //   price: 60000,
  //   category: "kue kering",
  //   lifespan: 180,
  //   ingredients: ["egg", "maizena", "sugar"],
  //   image: "kuesemprit.jpg",
  //   product_name: "Nastar",
  //   description: "A banana cake is a cake prepared using banana as a primary ingredient and typical cake ingredients. It can be prepared in various manners, including as a layer cake, as muffins and as cupcakes.",
  //   short_description: string.substring(0, 50) + "...",
  //   price: "70.000",
  //   category: "kue kering",
  //   lifespan: 180,
  //   ingredients: ["banana", "egg", "tapioca", "sugar"],
  //   image: "bolupisang.jpg",
  // };
  // await Product.insertMany(query);

  const products = await Product.find();

  console.log(products);

  res.render('product-list-page', {
    title: 'Products',
    layout: 'layouts/main-nav-layout',
    activeProduct: 'active',
    sessionUser: req.session.user,
    products,
  });
});

router.get('/:id', async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });
  const recommendation = await Product.find({ category: product.category });
  const umkm = await Umkm.findOne({ umkm_name: product.umkm });
  if (!product) {
    res.redirect('/products');
  } else {
    res.render('product-detail-page', {
      title: 'Product Detail',
      layout: 'layouts/main-nav-layout',
      activeProduct: 'active',
      sessionUser: req.session.user,
      product,
      recommendation,
      umkm,
    });
  }
});

module.exports = router;
