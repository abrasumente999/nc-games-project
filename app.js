const express = require("express");
const { getCategories, getReviews } = require("./controllers/index.js");
// const { getCategories } = require("./controllers/categories.controller");
// const { getReviews } = require("./controllers/reviews.controller")
// console.log(getCategories);

const app = express();

app.get("/api/categories", getCategories.getCategories);

app.get("/api/reviews", getReviews.getReviews);

app.all("/*", (req, res, next) => {
  res.status(400).send({ msg: "Bad Request" });
});

app.use((err, req, res, next) => {
  req.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
