module.exports = (sequelize, DataTypes) => {
  const CheckIn = sequelize.define('CheckIn', {
    username: DataTypes.STRING,
    business: DataTypes.STRING,
  }, {

  })
  
  return CheckIn
}
