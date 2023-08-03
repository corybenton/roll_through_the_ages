/* eslint-disable no-unused-vars */

//const { doc } = require('prettier');

//accessing gameId through <script> in game.handlebars
let gameid = gameId;
let userid = userId;

async function switchToNewTurn(gameid) {
  await fetch(`/game/${gameid}/turnover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
}

class Game {
  checkGameEnd(player) {
    let allMonumentsDone = true;
    const monumentDone = [];
    for (let i = 0; i < 5; i++) {
      monumentDone[0] = parseInt(document.querySelector(`#${player[0]} .mon${i} .needed`).textContent);
      monumentDone[1] = parseInt(document.querySelector(`#${player[1]} .mon${i} .needed`).textContent);
      if (monumentDone[0] !== 0 && monumentDone[1] !== 0) {
        allMonumentsDone = false;
        break;
      }
    }
    let developmentsDone = 0;
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 13; k++) {
        let developmentLearned = document.querySelector(`#${player[j]} .dev${k} .learn`);
        developmentLearned = developmentLearned.classList.contains('learned');
        if (developmentLearned) {
          developmentsDone += 1;
        }
        if (developmentsDone === 5) {
          break;
        }
      }
      if (developmentsDone === 5) {
        break;
      }
      //break;
    }
    if (allMonumentsDone || developmentsDone === 5){
      this.gameEnd(player);
    } else {
      //////turns and pages change when cleanup////////////
      //document.querySelector('#die8').removeEventListener('click', rollDiceHandler);
      switchToNewTurn(gameid);
      window.location.href = `/game/${gameid}`;
      document.querySelector('#die8').addEventListener('click', startRollHandler);
      document.querySelector('#die8').classList.remove('none');
      popup('Go away', 1, 'resource');
      popup('Cleanup', 1, 'ok');
      ///^leaving comments incase something goes wrong^/////
    }
  }

  gameEnd(player) {
    popup('Game is over.', 3000, 'announcement');
    let winner;
    const playerScore = [];
    const playerGoods = [];
    for (let i = 0; i < 2; i++) {
      playerScore[i] = parseInt(document.querySelector(`#${player[i]} .score`).textContent);
      playerGoods[i] = getGoodsValue(player[i]);
      let architecture = document.querySelector(`#${player[i]} .Architecture .learn`);
      architecture = architecture.classList.contains('learned');
      if (architecture) {
        let monuments = 0;
        for (let j = 0; j < 5; j++) {
          const finished = parseInt(document.querySelector(`#${player[i]} .mon${j} .needed`).textContent);
          if (finished === 0) {
            monuments += 1;
          }
        }
        playerScore[i] += monuments;
      }
      let empire = document.querySelector(`#${player[i]} .Empire .learn`);
      empire = empire.classList.contains('learned');
      if (empire) {
        const cities = parseInt(document.querySelector(`#${player[i]} .cities`).textContent);
        playerScore[i] += cities;
      }
    }
    if (playerScore[0] > playerScore[1] ||
        (playerScore[0] === playerScore[1] &&
            playerGoods[0] > playerGoods[1])) {
      winner = `${player[0]} wins!`;

    } else if (playerScore[0] < playerScore[1] ||
        (playerScore[0] === playerScore[1] &&
            playerGoods[0] < playerGoods[1])) {
      winner = `${player[1]} wins!`;
    } else{
      winner = ('Its a tie!');
    }
    popup(winner, 5000, 'ok');
    const score = `${player[0]}: ${playerScore[0]} ${player[1]}: ${playerScore[1]}`;
    popup(score, 7000, 'resource');
  }

  // round(player) {
  //   // Turn.turn(player[1], player[2]);
  //   // Turn.turn(player[2], player[1]);
  //   this.checkGameEnd(player);
  // }


}
const endCheck = new Game;

let player = [];
let previousTurn;
let prevPlayer2Joined;
async function checkP2Status(gameid) {
  try {
    const response = await fetch(`/json/${gameid}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const GameData = await response.json();
      // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!GameData checkP2Status', GameData);
      // console.log('player2:', GameData.gamestates[1]);
      // console.log('GameData.gamestates[0].player:', GameData.gamestates[0].player);
      // console.log('userid :', userid);

      if (GameData.gamestates[1] !== null) {
        console.log('player 2 has joined the game');
        document.querySelector('#start').classList.remove('none');

        if (prevPlayer2Joined === false) {
          window.location.href = `/game/${gameid}`;
          //sets to false here so after player 1 finsishes first turn,
          //screen refreshes to show waiting for opponent.
          previousTurn = false;
          return;
        }
      } else {
        console.log('waiting for opponent to join');
        prevPlayer2Joined = false;
        setTimeout(() => {
          checkP2Status(gameid);
        }, 8000);
      }
    } else {
      console.error('big error');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkP2Status(gameid);
//previousTurn will show up undefined at first, but then have a value
//let previousTurn; Moved this to above checkP2Status
//console.log('previous', previousTurn);
async function checkTurn(gameid) {
  try {
    const response = await fetch(`/json/${gameid}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const GameData = await response.json();

      if (GameData.isMyTurn === true) {
        console.log('its your turn');
        //Start the game
        //Do your turn

        if (previousTurn === false) {
          window.location.href = `/game/${gameid}`;
          return;
        }
        //newTurn.startRoll();
      } else {
        console.log('Waiting for opponents turn...');
        previousTurn = false;
        setTimeout(() => {
          checkTurn(gameid);
        }, 8000);
      }
    } else {
      console.error('Error fetching game data');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkTurn(gameid);
//This event listener will be modified to be attached to whatever button click
//ends the players turn. I think its a button that says done?


////added this functionality to the end of checkGameEnd(player),////////////
////it is surrounded by comments incase we need to revert.//////////////////
// document.querySelector('#nextBtn').addEventListener('click', () => {
//   switchToNewTurn(gameid);
//   window.location.href = `/game/${gameid}`;
// });


async function getTurn() {
  try{
    const response = await fetch(`/game/${gameid}/getTurn`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      const GameData = await response.json();

      allPlayer = document.querySelectorAll('.player');
      player[0] = allPlayer[0].getAttribute('id');
      player[1] = allPlayer[1].getAttribute('id');

      newTurn.currentPlayer = player[GameData - 1];
      if (GameData - 1 === 0) {
        newTurn.otherPlayer = player[1];
      } else {
        newTurn.otherPlayer = player[0];
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

