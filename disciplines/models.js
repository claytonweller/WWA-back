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

module.exports = { findDisciplineTypes, createNewDisciplineType };