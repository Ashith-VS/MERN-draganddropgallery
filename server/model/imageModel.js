const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  filename: {
    type: "string",
    required: true,
  },
  path: {
    type: "string",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Imgcollection = mongoose.model("ImageCollection", ImageSchema);
module.exports = Imgcollection;

