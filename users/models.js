// Thist SQL query presumes that it's following a filterted 'f' array
const createUserObject = (additionalFields = "") => {
  return `
  SELECT 
  f.*,
  json_agg(d.*) as disciplines
  FROM filtered f
  INNER JOIN user_disciplines d USING (user_id)
  WHERE d.user_id = f.user_id
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
    f.equipment
`;
};

// These are fields that are ok to send to the client
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
  users.user_id
`;

const findUserById = id => {
  return `
  WITH filtered AS (
    SELECT
      users.email,
      ${returnableFields}
    FROM users
    WHERE users.user_id = ${id}
  )
  ${createUserObject("f.email,")}
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
  ${createUserObject("f.email,")}
  `;
};

const findUsersByDiscipline = discipline => {
  return `
    WITH filtered AS (
      WITH ids AS (
        SELECT user_id
        FROM user_disciplines
        WHERE user_disciplines.type = '${discipline}'
      )    
      SELECT 
      ${returnableFields}
      FROM users
      INNER JOIN ids ON users.user_id = ids.user_id
    )
    ${createUserObject()}
  `;
};

module.exports = {
  findUserById,
  findUserByEmail,
  findUsersByDiscipline
};

////// OLD MONGODB STUFF ///////////

// 'use strict';
// const bcrypt = require('bcryptjs');
// const mongoose = require('mongoose');

// mongoose.Promise = global.Promise;

// const UserSchema = mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   firstName: {type: String, default: ''},
//   lastName: {type: String, default: ''}
// });

// UserSchema.methods.serialize = function() {
//   return {
//     username: this.username || '',
//     firstName: this.firstName || '',
//     lastName: this.lastName || ''
//   };
// };

// UserSchema.methods.validatePassword = function(password) {
//   return bcrypt.compare(password, this.password);
// };

// UserSchema.statics.hashPassword = function(password) {
//   return bcrypt.hash(password, 10);
// };

// const User = mongoose.model('User', UserSchema);

// module.exports = {User};
