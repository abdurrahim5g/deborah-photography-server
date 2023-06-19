const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

// Middleware
app.use(cors());
app.use(express.json());

// Base get API
app.get("/", (req, res) => {
  res.send("The server is running");
});

app.listen(port, () => {
  console.log(`Server running on Port:${port}`);
});
