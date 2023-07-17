const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Monuments extends Model {}


Monuments.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    labor: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    needed: {
      type: DataTypes.INTEGER,
    },
    points_first: {
      type: DataTypes.INTEGER,
    },
    points_second: {
      type: DataTypes.INTEGER
    },
    gameState_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'gameState',
        key: 'id',
      }
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'monuments',
  }
);

module.exports = Monuments;