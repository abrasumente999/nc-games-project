const db = require("../db/connection.js");

exports.selectUsers = () => {
  const queryStr = `
    SELECT * FROM users;
    `;
  return db.query(queryStr).then((result) => {
    return result.rows;
  });
};
