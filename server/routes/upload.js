const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const GeneratedImage = require("../models/GeneratedImage");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image");

router.post("/upload-img", upload, async (req, res) => {
  console.log("Incoming request to upload imagess");
  console.log(req);
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload failed:", error);
          return res.status(500).json({ error: "Cloudinary upload failed" });
        }
        const newImage = new GeneratedImage({
          imageUrl: result.secure_url,
          prompt: req.body.prompt,
        });

        // Save the document to MongoDB
        await newImage.save();

        res.status(200).json({
          message: "Image uploaded successfully",
          imageUrl: result.secure_url,
          prompt: req.body.prompt,
        });
      }
    );

    req.file.stream.pipe(uploadStream);
  } catch (err) {
    console.error("Error in upload route:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
