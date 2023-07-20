const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Game extends Model {}

Game.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    // board1: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    //   references: {
    //     model: 'gameState',
    //     key: 'id',
    //   }
    // },
    // board2: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    //   references: {
    //     model: 'gameState',
    //     key: 'id',
    //   }
    // },
    // winner: {
    //   type: DataTypes.INTEGER,
    //   defaultValue: 3,
    //},
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'game',
  }
);

module.exports = Game;