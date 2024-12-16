require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import CORS for cross-origin requests
const TodoRoute = require("./Routes/TodoRoute");

const App = express();

// Middleware
App.use(express.json());
App.use(cors()); // Enable CORS

// Routes
App.use("/todo", TodoRoute);
// MongoDB connection and server initialization
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    App.listen(1000, () => {
      console.log("DB connected and Server started on http://localhost:1000");
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });
