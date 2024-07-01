require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/router");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT||5000;
const MONGO_URL = process.env.MONGO_URL;

// Define allowed origins
const allowedOrigins = ['http://localhost:3000','http://localhost:3005'];

// Configure CORS
app.use(cors({
  origin: allowedOrigins
}));

app.use(express.json());
// app.use(cors());
app.use(express.static("upload"))
app.use("/",router)

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("DB connection established");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.error(err));
