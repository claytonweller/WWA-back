const { Pool } = require("pg");
const { DATABASE_URL } = require("../config");

const pool = new Pool({
  connectionString: DATABASE_URL
});

const query = (text, params) => {
  return new Promise((resolve, reject) => {
    pool
      .query(text, params)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

module.exports = {
  query
};
