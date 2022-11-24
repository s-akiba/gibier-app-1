'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      categories.hasMany(models.commodities, {
        foreignKey: "category_id"
      });
    }
  }
  categories.init({
    category_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'categories',
  });
  return categories;
};