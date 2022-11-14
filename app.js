const express = require("express");
const { getCategories } = require("./controller/seed.controller.js");
const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);

app.use((err, req, res, next) => {
  req.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
