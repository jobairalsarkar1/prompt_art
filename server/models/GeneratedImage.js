const mongoose = require("mongoose");

const GeneratedImageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  prompt: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("GeneratedImage", GeneratedImageSchema);
