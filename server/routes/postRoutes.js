const express = require("express");
const multer = require("multer");
const { uploadImage, getPosts } = require("../controllers/postController");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image");

// Route to upload an image
router.post("/upload-img", upload, uploadImage);
router.get("/get-posts", getPosts);

module.exports = router;
