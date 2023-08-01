//const player = [];

const startTurn = (e) => {
  e.preventDefault();
  // const allPlayers = document.querySelectorAll('.player');
  // document.querySelector('#start').classList.add('none');
  // player[0] = allPlayers[0].getAttribute('id');
  // player[1] = allPlayers[1].getAttribute('id');
  getTurn();
  document.querySelector('#die8').addEventListener('click', startRollHandler);
  dice.keepDice();
};

document.querySelector('#start').addEventListener('click', startTurn);
