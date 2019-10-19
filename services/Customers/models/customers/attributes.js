const Sequelize = require('sequelize')

module.exports = {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    validate: {
      isUUID: 4
    }
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
}
