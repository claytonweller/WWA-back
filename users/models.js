const bcrypt = require("bcryptjs");

////// Useful functions ///////////

// Got this bad boy off of stack overflow.
String.prototype.replaceAll = function(str1, str2, ignore) {
  return this.replace(
    new RegExp(
      str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"),
      ignore ? "gi" : "g"
    ),
    typeof str2 == "string" ? str2.replace(/\$/g, "$$$$") : str2
  );
};

// Single quotes ruin SQL queries so all text inputs must have this function
const fixSingleQuotesForSQL = string => {
  if (string) {
    return string.replaceAll("'", "''");
  }
  return "";
};

const validatePassword = function(pass, dbPass) {
  return bcrypt.compare(pass, dbPass);
};

const hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

/////// USERS - Database queries //////////

// These are all the various filters that can be used to find artists/users

const findAllUsers = () => {
  return `
  WITH filtered AS (
    SELECT ${returnableFields}
    FROM users
  )
  ${userTemplate(true)}
  `;
};

const findUserById = id => {
  return `
  WITH filtered AS (
    SELECT
      users.email,
      ${returnableFields}
    FROM users
    WHERE users.user_id = ${id}
  )
  ${userTemplate(true, "f.email,")}
  `;
};

const findUnfinishedUserById = id => {
  return `
  WITH filtered AS (
    SELECT
      users.email,
      ${returnableFields}
    FROM users
    WHERE users.user_id = ${id}
  )
  ${userTemplate(false, "f.email,")}
  `;
};

const findUserByEmail = email => {
  return `
  WITH filtered AS (
    SELECT
      users.email,
      ${returnableFields}
    FROM users
    WHERE users.email = '${email}'
  )
  ${userTemplate(false, "f.email,")}
  `;
};

const findUserForAuth = email => {
  return `
  WITH filtered AS (
    SELECT
      users.email,
      users.password,
      ${returnableFields}
    FROM users
    WHERE users.email = '${email}'
  )
  ${userTemplate(false, "f.email, f.password,")}
  `;
};

const findUsersByDiscipline = discipline => {
  return `
    WITH filtered AS (
      WITH ids AS (
        SELECT user_id
        FROM ${completeUserDiscipline} complete
        WHERE complete.type = '${discipline}'
      )    
      SELECT 
      ${returnableFields}
      FROM users
      INNER JOIN ids ON users.user_id = ids.user_id
    )
    ${userTemplate(true)}
  `;
};

// This SQL query presumes that it's following a filterted 'f' array
const userTemplate = (complex = false, additionalFields = "") => {
  // The complex constructor returns json object for a user with
  // all of their associated disciplines. The simple one does not

  let constructor = "FROM filtered f";
  if (complex) {
    constructor = `,
      json_agg(d.*) as disciplines
      FROM filtered f
      INNER JOIN ${completeUserDiscipline} d USING (user_id)
      WHERE d.user_id = f.user_id
    `;
  }

  // 'additionalFields' is used to send back sensitive information
  // like emails. It will only accesible by the user themselves
  return `
    SELECT 
    f.*
    ${constructor}
    GROUP BY ${additionalFields}
      f.user_id,
      f.first_name,
      f.last_name,
      f.date_joined,
      f.desired_projects,
      f.bio,
      f.dob,
      f.city,
      f.state,
      f.equipment,
      f.img_url
  `;
};

// These are fields that are always ok to send to the client
const returnableFields = `
  users.first_name,
  users.last_name,
  users.date_joined,
  users.desired_projects,
  users.bio,
  users.dob,
  users.city,
  users.state,
  users.equipment,
  users.user_id,
  users.img_url
`;

// This adds the specific type to the user discipline
const completeUserDiscipline = `
  (
    SELECT 
      u.*,
      k.type
    FROM user_disciplines u
    INNER JOIN discipline_types k ON u.type_id=k.type_id
  )
`;

const createUser = user => {
  return `
    INSERT INTO users (  
      first_name,
      last_name,
      date_joined,
      dob,
      city,
      state,
      email,
      password
    )
    VALUES (
      '${fixSingleQuotesForSQL(user.first_name)}',
      '${fixSingleQuotesForSQL(user.last_name)}',
      ${user.date_joined},
      ${user.dob},
      '${fixSingleQuotesForSQL(user.city)}',
      '${user.state}',
      '${user.email}',
      '${user.password}'
    )
  `;
};

const deleteUser = id => {
  return `
    DELETE FROM users
    WHERE user_id = ${id}
  `;
};

module.exports = {
  findAllUsers,
  findUserById,
  findUnfinishedUserById,
  findUserByEmail,
  findUsersByDiscipline,
  findUserForAuth,
  createUser,
  validatePassword,
  hashPassword,
  deleteUser,
  fixSingleQuotesForSQL
};
