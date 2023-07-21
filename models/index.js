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
  foreignKey: 'gameState_id',
});

Developments.belongsTo(GameState, {
  foreignKey: 'gameState_id',
});

GameState.hasMany(Monuments, {
  foreignKey: 'gameState_id',
});

GameState.hasMany(Goods, {
  foreignKey: 'gameState_id',
});

GameState.hasMany(Developments, {
  foreignKey: 'gameState_id',
});

GameState.belongsTo(User, {
  foreignKey: 'player',
});

User.hasOne(GameState, {
  foreignKey: 'player',
});

// Game.hasMany(GameState, {
//   foreignKey: 'game_foreign',
// });

// Game.hasOne(GameState, {
//   foreignKey: 'board1',
//   as: 'player1board'
// });

// Game.hasOne(GameState, {
//   foreignKey: 'board2',
//   as: 'player2board'
// });

// GameState.belongsTo(Game, {
//   foreignKey: 'board1',
//   as: 'player1board',
// });

// GameState.belongsTo(Game, {
//   foreignKey: 'board1',
//   as: 'player2board',
// });

Game.belongsTo(GameState, {
  foreignKey: 'board1',
  as: 'player1board',
});

Game.belongsTo(GameState, {
  foreignKey: 'board2',
  as: 'player2board',
});


module.exports = {
  Monuments,
  Developments,
  GameState,
  Goods,
  User,
  Game
};
