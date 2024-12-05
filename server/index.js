const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const postRoutes = require("./routes/postRoutes");
const http = require("http");
const { Server } = require("socket.io");
const { setIoInstance } = require("./controllers/postController");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://prompt-art-psi.vercel.app",
    methods: ["GET", "POST"],
  },
});

setIoInstance(io);
app.use(express.json());
app.use(bodyParser.json());
app.use(cors({ origin: "https://prompt-art-psi.vercel.app" }));

app.use(bodyParser.json());
app.use("/api/v1/post", postRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected."))
  .catch(() => console.log("Connection Failed"));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on Port: ${PORT}`);
});
