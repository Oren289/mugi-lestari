const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

require('../../utils/db');
const Umkm = require('../../model/umkm');

router.get('/', async (req, res) => {
  const umkms = await Umkm.find();
  if (!req.session.admin) {
    res.redirect('/admin-login');
  } else {
    try {
      res.render('admin-umkm-list', {
        title: 'Daftar UMKM',
        layout: 'layouts/admin-main-layout',
        sessionUser: req.session.admin,
        homeActive: '',
        orderListActive: '',
        productListActive: '',
        umkmListActive: 'active',
        umkms,
      });
    } catch (error) {
      console.log(error);
    }
  }
});

router.get('/add', async (req, res) => {
  const umkms = await Umkm.find();
  if (!req.session.admin) {
    res.redirect('/login');
  } else {
    try {
      res.render('admin-umkm-add', {
        title: 'Tambah Data Umkm',
        layout: 'layouts/admin-main-layout',
        homeActive: '',
        orderListActive: '',
        productListActive: '',
        umkmListActive: 'active',
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
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const query = {
        umkm_name: req.body.umkm_name,
        owner: req.body.owner,
        bidang: req.body.bidang,
        no_hp: req.body.no_hp,
        alamat: req.body.alamat,
        username: req.body.username,
        password: hashedPassword,
      };
      await Umkm.insertMany(query);
      res.redirect('/admin-umkm-list');
    } catch (error) {
      console.log(error);
    }
  }
});

router.get('/:id', async (req, res) => {
  const umkm = await Umkm.findOne({ _id: req.params.id });
  console.log(umkm);
  if (!req.session.admin) {
    res.redirect('/login');
  } else {
    try {
      res.render('admin-umkm-edit', {
        title: 'Ubah Data Umkm',
        layout: 'layouts/admin-main-layout',
        homeActive: '',
        orderListActive: '',
        productListActive: '',
        umkmListActive: 'active',
        umkm,
      });
    } catch (error) {
      console.log(error);
    }
  }
});

router.post('/edit', async (req, res) => {
  const umkm = await Umkm.findOne({ _id: req.body.id });
  if (!req.session.admin) {
    res.redirect('/login');
  } else {
    try {
      let hashedPassword = '';
      if (req.body.password !== '') {
        hashedPassword = await bcrypt.hash(req.body.password, 10);
      } else {
        hashedPassword = umkm.password;
      }
      await Umkm.updateMany(
        { _id: req.body.id },
        {
          $set: {
            umkm_name: req.body.umkm_name,
            owner: req.body.owner,
            bidang: req.body.bidang,
            no_hp: req.body.no_hp,
            alamat: req.body.alamat,
            password: hashedPassword,
          },
        }
      );
      res.redirect('/admin-umkm-list');
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
      await Umkm.deleteOne({ _id: req.params.id });
      res.redirect('/admin-umkm-list');
    } catch (err) {
      console.log(err);
    }
  }
});

module.exports = router;
