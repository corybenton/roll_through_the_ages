const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Developments extends Model {}

Developments.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    number:{
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    learned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    points: {
      type: DataTypes.INTEGER,
    },
    effect: {
      type: DataTypes.STRING,
    },
    gamestate_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'gameState',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'developments',
  }
);

module.exports = Developments;