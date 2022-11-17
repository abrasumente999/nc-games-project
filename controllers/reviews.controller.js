const {
  selectReviews,
  selectReviewsById,
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
