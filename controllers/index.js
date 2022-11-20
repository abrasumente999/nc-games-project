module.exports = {
  getCategories: require("./categories.controller.js"),
  getReviews: require("./reviews.controller.js"),
  getReviewsById: require("./reviews.controller.js"),
  getCommentsByReviewId: require("./reviews.controller.js"),
  postComment: require("./reviews.controller.js"),
  patchVotesById: require("./reviews.controller.js"),
};
