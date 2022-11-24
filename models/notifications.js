'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class notifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      notifications.belongsTo(models.users, {
        foreignKey: "user_id",
        targetKey: "id"
      });
    }
  }
  notifications.init({
    user_id: DataTypes.INTEGER,
    message: DataTypes.STRING,
    link: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'notifications',
  });
  return notifications;
};