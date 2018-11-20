const { Pool } = require("pg");
const { DATABASE_URL } = require("../config");

const pool = new Pool({
  connectionString: DATABASE_URL
});

// This is the basic POSTGRESql server query
// any time there's a database query it uses this.

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
