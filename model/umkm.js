const mongoose = require('mongoose');

const umkmSchema = new mongoose.Schema({
  umkm_name: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  bidang: {
    type: String,
    required: true,
  },
  alamat: {
    type: String,
    required: true,
  },
  no_hp: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Umkm = new mongoose.model('umkm', umkmSchema);

module.exports = Umkm;
