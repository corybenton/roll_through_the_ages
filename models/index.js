const Monuments = require('./monuments');
const Developments = require('./developments');
const GameState = require('./gameState');
const Goods = require('./goods');
const User = require('./users');
const Game = require('./game');

Monuments.belongsTo(GameState, {
  foreignKey: 'gamestate_id',
});

Goods.belongsTo(GameState, {
  foreignKey: 'gamestate_id',
});

Developments.belongsTo(GameState, {
  foreignKey: 'gamestate_id',
});

GameState.hasMany(Monuments, {
  foreignKey: 'gamestate_id',
});

GameState.hasMany(Goods, {
  foreignKey: 'gamestate_id',
});

GameState.hasMany(Developments, {
  foreignKey: 'gamestate_id',
});

GameState.belongsTo(User, {
  foreignKey: 'player',
});

User.hasOne(GameState, {
  foreignKey: 'player',
});

Game.belongsTo(GameState, {
  foreignKey: 'board1',
  as: 'player1board',
  //onDelete: 'CASCADE',
});

Game.belongsTo(GameState, {
  foreignKey: 'board2',
  as: 'player2board',
  //onDelete: 'CASCADE',
});


module.exports = {
  Monuments,
  Developments,
  GameState,
  Goods,
  User,
  Game
};
