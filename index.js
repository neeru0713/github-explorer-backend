const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes.js");
require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.get("/", (req,res) => {
  res.send("Backend server is running")
})
app.use("/", userRoutes);

// mongodb connection
mongoose
  .connect(
    process.env.MONGODB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

  // start backend server
app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
