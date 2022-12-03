const express = require("express");
const {
  getCategories,
  getReviews,
  getReviewsById,
  getCommentsByReviewId,
  postComment,
  patchVotesById,
  getUsers,
} = require("./controllers/index.js");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories.getCategories);
app.get("/api/reviews", getReviews.getReviews);
app.get("/api/reviews/:review_id", getReviewsById.getReviewsById);
app.get(
  "/api/reviews/:review_id/comments",
  getCommentsByReviewId.getCommentsByReviewId
);

app.post("/api/reviews/:review_id/comments", postComment.postComment);

app.patch("/api/reviews/:review_id", patchVotesById.patchVotesById);

app.get("/api/users", getUsers.getUsers);

//error handling

app.all("/*", (req, res, next) => {
  res.status(400).send({ msg: "Bad Request" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Value not found" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Not found" });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid - wrong data type" });
  } else {
    req.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
