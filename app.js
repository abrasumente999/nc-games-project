const express = require("express");
const { getCategories } = require("./controllers/categories.controller.js");
const app = express();

app.get("/api/categories", getCategories);

app.all("/*", (req, res, next) => {
  res.status(400).send({ msg: "Bad Request" });
});

app.use((err, req, res, next) => {
  req.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
