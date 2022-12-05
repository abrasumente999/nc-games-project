const app = require("./app.js");

const { PORT = 8080 } = process.env;

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`listening on port ${PORT}...`);
});
