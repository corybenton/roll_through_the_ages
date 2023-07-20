const Game = require('./game');

const player = [];

player[1] = document.querySelector('.name#player1').textContent;
player[2] = document.querySelector('.name#player2').textContent;

Game.round(player);
