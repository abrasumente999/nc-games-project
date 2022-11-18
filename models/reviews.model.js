const db = require("../db/connection.js");
const { checkExists } = require("../db/seeds/utils");

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

exports.selectReviewsById = (review_id) => {
  return db
    .query(
      `
  SELECT review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at FROM reviews WHERE review_id = $1;
  `,
      [review_id]
    )
    .then((result) => {
      if (!result) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      }
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Review ID not found" });
      }
      return result.rows[0];
    });
};

exports.selectCommentsByReviewId = (id) => {
  const query = `SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at;`;

  return db.query(query, [id]).then((result) => {
    if (result.rows.length === 0) {
      return checkExists("reviews", "review_id", id);
    } else {
      return result.rows;
    }
  });
};

exports.insertComment = async (id, comment) => {
  const { review_id } = id;
  const { username, body } = comment;

  const queryStr = `INSERT INTO comments(author, body, review_id)
  SELECT $1, $2, (SELECT review_id FROM reviews WHERE review_id = $3::INT)
  FROM comments
  RETURNING*;`;

  const values = [username, body, review_id];

  const result = await db.query(queryStr, values);

  if (result.rows.length === 0) {
    const exists = await checkExists("users", "username", username);
  }

  return result.rows[0];
};
