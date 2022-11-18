const {
  selectReviews,
  selectReviewsById,
  selectCommentsByReviewId,
  insertComment,
  updateVotesById,
} = require("../models/reviews.model.js");

exports.getReviews = (req, res, next) => {
  const { sort_by, order } = req.query;

  selectReviews(sort_by, order)
    .then((result) => {
      const obj = { reviews: result };
      res.status(200).send(obj);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewsById = (req, res, next) => {
  const { review_id } = req.params;

  selectReviewsById(review_id)
    .then((review) => {
      const obj = { review };
      res.status(200).send(obj);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;

  selectCommentsByReviewId(review_id)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const commentObj = req.body;
  const review_id = req.params;

  insertComment(review_id, commentObj)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVotesById = (req, res, next) => {
  const { review_id } = req.params;
  const updateVotes = req.body;

  updateVotesById(review_id, updateVotes)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
