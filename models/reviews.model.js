const db = require("../db/connection.js");

exports.selectReviews = () => {
  const query = `
  SELECT reviews.owner, 
         reviews.title, 
         reviews.review_id, 
         reviews.category, 
         reviews.review_img_url, 
         reviews.created_at, 
         reviews.votes, 
         reviews.designer, 
        (SELECT COUNT(*) 
            FROM comments 
              WHERE reviews.review_id = comments.review_id) 
              AS comment_count 
  FROM reviews 
  LEFT JOIN comments ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC;`;

  return db.query(query).then((result) => {
    console.log(result.rows);
    return result.rows;
  });
};
