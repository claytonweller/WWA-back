const { Pool } = require("pg");
const { DATABASE_URL, ENVIRONMENT, TEST_DATABASE_URL } = require("../config");

let url = DATABASE_URL;
if (ENVIRONMENT === "test") {
  url = TEST_DATABASE_URL;
}

const pool = new Pool({
  connectionString: url
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
