const { ContextRunnerImpl } = require('express-validator/src/chain');
const mongoose = require('mongoose');

const multer = require('multer');

const imageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: Buffer,
    contentType: String,
    required: true,
  },
});

const Image = new mongoose.model('image', imageSchema);

module.exports = Image;
