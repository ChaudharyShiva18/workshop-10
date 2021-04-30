const express = require("express");
const app = express();
app.use(express.json());
require("./db/conn");
const User = require("./model/Schema");
const jwt = require("jsonwebtoken");

app.post("/users", async (req, res) => {
  const { name, password } = req.body;
  const user = new User({ name, password });
  await user.save();
  res.status(201).json({ message: "User created successfully" });
});

app.post("/api/validate", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "True",
        // message: authData,
      });
    }
  });
});

app.post("/api/login", (req, res) => {
  const user = req.body;
  jwt.sign({ user }, "secretkey", (err, token) => {
    res.json({
      token,
    });
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");

    const bearerToken = bearer[1];
    req.token = bearerToken;

    next();
  } else {
    res.sendStatus(403);
  }
}

app.listen(5000, () => console.log("Server started on port 5000"));
