export default Sequelize => ({
  street: Sequelize.STRING,
  number: Sequelize.INTEGER,
  complement: Sequelize.STRING,
  state: Sequelize.STRING,
  city: Sequelize.STRING,
  zip: Sequelize.STRING,
});
