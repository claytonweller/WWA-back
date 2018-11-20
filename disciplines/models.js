// Returns all discipline types by default
// But if a type is put in you'll get the specific type back
// The later is primarily used for searching for specific users

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

// This is currently only used for testing
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
