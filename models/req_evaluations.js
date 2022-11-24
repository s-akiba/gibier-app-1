'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class req_evaluations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      req_evaluations.belongsTo(models.users, {
        foreignKey: "user_1_id",
        targetKey: "id"
      });
      req_evaluations.belongsTo(models.users, {
        foreignKey: "user_2_id",
        targetKey: "id"
      });
      req_evaluations.belongsTo(models.req_from_facility, {
        foreignKey: "req_from_facility_id",
        targetKey: "id"
      });
    }
  }
  req_evaluations.init({
    req_from_facility_id: DataTypes.INTEGER,
    user_1_id: DataTypes.INTEGER,
    user_2_id: DataTypes.INTEGER,
    condition: DataTypes.INTEGER,
    support: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'req_evaluations',
  });
  return req_evaluations;
};