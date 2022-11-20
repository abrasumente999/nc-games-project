const db = require("../db/connection.js");

exports.selectUsers = () => {
  console.log("model");
  const validColumns = [];
  const validOrders = /ASC|DESC/gi;

  const queryStr = `
    SELECT * FROM users;
    `;
  return db.query(queryStr).then((result) => {
    return result.rows;
  });
};
