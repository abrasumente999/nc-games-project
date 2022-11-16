const db = require("../db/connection.js");

exports.selectReviews = (sort_by = "created_at", order = "DESC") => {
  const validColumns = [
    "username",
    "title",
    "review_id",
    "category",
    "created_at",
    "review_img_url",
    "votes",
    "designer",
    "comment_count",
  ];
  const validOrders = /ASC|DESC/gi;

  if (!validColumns.includes(sort_by)) {
    return Promise.reject({ status: 404, msg: "Not Found" });
  }
  if (validOrders.test(order) === false) {
    return Promise.reject({ status: 404, msg: "Not Found" });
  }

  let query = `
  SELECT users.username AS owner, 
         reviews.title, 
         reviews.review_id, 
         reviews.category, 
         reviews.review_img_url, 
         reviews.created_at, 
         reviews.votes, 
         reviews.designer, 
         (
           SELECT COUNT(*) 
           FROM comments 
           WHERE reviews.review_id = comments.review_id
         ) 
         AS comment_count 
  FROM  reviews 
  LEFT JOIN comments ON reviews.review_id = comments.review_id
  JOIN users ON reviews.owner = users.username
  GROUP BY reviews.review_id, users.username 
  `;

  if (sort_by) {
    query += ` ORDER BY ${sort_by}`;
  }
  if (order) {
    query += ` ${order}`;
  }

  query += ";";

  return db.query(query).then((result) => {
    return result.rows;
  });
};
