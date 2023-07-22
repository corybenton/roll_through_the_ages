const Game = require('./game');

const allPlayers = document.querySelectorAll('.player');
const player = [];

player[1] = allPlayers[0].getAttribute('id');
player[2] = allPlayers[1].getAttribute('id');

Game.round(player);
