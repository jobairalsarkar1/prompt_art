const cloudinary = require("../config/cloudinary");
const GeneratedImage = require("../models/GeneratedImage");

let io;

const setIoInstance = (socketIo) => {
  io = socketIo;
};

// Controller function to handle image upload
const uploadImage = async (req, res) => {
  try {
    console.log("Incoming request to upload image");

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!req.body.prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Upload the image to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload failed:", error);
          return res.status(500).json({ error: "Cloudinary upload failed" });
        }

        // Create a new GeneratedImage document in MongoDB
        const newImage = new GeneratedImage({
          imageUrl: result.secure_url,
          prompt: req.body.prompt,
        });

        await newImage.save();

        if (io) {
          io.emit("newPost", newImage);
        }

        res.status(200).json({
          message: "Image uploaded successfully",
          imageUrl: result.secure_url,
          prompt: req.body.prompt,
        });
      }
    );

    uploadStream.end(req.file.buffer); // Fixed
  } catch (err) {
    console.error("Error in upload route:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await GeneratedImage.find();
    console.log(posts);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Something Went wrong" });
  }
};

module.exports = { uploadImage, getPosts, setIoInstance };
