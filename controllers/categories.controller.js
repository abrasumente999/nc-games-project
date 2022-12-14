const { selectCategories } = require("../models/categories.model.js");


exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((result) => {
      const obj = { categories: result };
      res.status(200).send(obj);
    })
    .catch((err) => {
      next(err);
    });
};
