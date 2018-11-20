//// USER DISCIPLINES

// This finds all the displines of a specific user.
// This us used in the disciplines modal form
const findUserDisciplines = id => {
  return `
    SELECT *
    FROM user_disciplines d
    INNER JOIN discipline_types t ON t.type_id = d.type_id  
    WHERE d.user_id = ${id}
  `;
};

// This creates a new discipline for a user.
const createUserDiscipline = uDisc => {
  return `
    INSERT INTO user_disciplines (
      experience,
      active,
      type_id,
      reward,
      user_id
    )
    VALUES (
      ${uDisc.experience},
      '${uDisc.active}',
      '${uDisc.type_id}',
      '${uDisc.reward}',
      '${uDisc.user_id}'
    )
  
  `;
};

// Used in the user discipline list
const deleteUserDiscipline = id => {
  return `
    DELETE FROM user_disciplines
    WHERE u_discipline_id = ${id}
  `;
};

module.exports = {
  findUserDisciplines,
  createUserDiscipline,
  deleteUserDiscipline
};
