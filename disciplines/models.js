const findDisciplineTypes = type => {
  let typeFinder = "";
  if (type) {
    typeFinder = `WHERE type='${type}'`;
  }
  return `
    SELECT *
    FROM discipline_types
    ${typeFinder}
  `;
};

const createNewDisciplineType = type => {
  return `
    INSERT INTO discipline_types (
      type
    )
    VALUES ('${type}')
  `;
};

const deleteDiscplineType = type_id => {
  return `
    DELETE FROM discipline_types
    WHERE type_id = ${type_id}
  `;
};

module.exports = {
  findDisciplineTypes,
  createNewDisciplineType,
  deleteDiscplineType
};
