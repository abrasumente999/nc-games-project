const { selectReviews } = require("../models/reviews.model.js");

exports.getReviews = (req, res, next) => {
  console.log(req.params);
  console.log("hi");
  selectReviews()
    .then((result) => {
      const obj = { reviews: result };
      res.status(200).send(obj);
    })
    .catch((err) => {
      next(err);
    });
};
