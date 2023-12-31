const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Monuments extends Model {}


Monuments.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    number:{
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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
    gamestate_id: {
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