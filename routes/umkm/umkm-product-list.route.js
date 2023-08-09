const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

require('../../utils/db');
const Product = require('../../model/product');
const Umkm = require('../../model/umkm');
const imgSchema = require('../../model/image');

const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg');
  },
});

const upload = multer({ storage: storage });

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

router.post('/add', upload.single('image'), async (req, res) => {
  const umkm = await Umkm.findOne({ username: req.session.umkm });
  if (!req.session.umkm) {
    res.redirect('/umkm-login');
  } else {
    try {
      const newId = uuidv4();

      const obj = {
        name: req.file.filename,
        product_id: newId,
        img: {
          data: fs.readFileSync(path.join(__dirname, '..', '..', 'public', 'uploads', req.file.filename)),
          contentType: 'image/png',
        },
      };

      imgSchema.create(obj);

      const query = {
        id: newId,
        product_name: req.body.product_name,
        image_name: req.file.filename,
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
