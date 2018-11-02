//// USER DISCIPLINES
const findUserDisciplines = id => {
  return `
    SELECT *
    FROM user_disciplines d
    WHERE d.user_id = ${id}
  `;
};

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
