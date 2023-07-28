/* eslint-disable no-unused-vars */

class Game {
  checkGameEnd(player) {
    let allMonumentsDone = true;
    const monumentDone = [];
    for (let i = 0; i < 5; i++) {
      monumentDone[0] = parseInt(document.querySelector(`#${player[0]} .mon${i} .needed`).textContent);
      //monumentDone[1] = parseInt(document.querySelector(`#${player[1]} .mon${i} .needed`).textContent);
      if (monumentDone[0] !== 0 ){//&& monumentDone[2] !== 1) {
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
      break;
    }
    if (allMonumentsDone || developmentsDone === 5){
      this.gameEnd(player);
    } else {
      newTurn.startRoll();
    }
  }

  gameEnd(player) {
    popup('Game is over.', 300, 'announcement');
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
      break;
    }
    if (playerScore[0] > playerScore[1] ||
        (playerScore[0] === playerScore[1] &&
            playerGoods[0] > playerGoods[1])) {
      winner = `${player[0].name} wins!`;

    } else if (playerScore[0] < playerScore[1] ||
        (playerScore[0] === playerScore[1] &&
            playerGoods[0] < playerGoods[1])) {
      winner = `${player[1].name} wins!`;
    } else{
      winner = ('Its a tie!');
    }
    popup(winner, 500, 'okay');
    const score = `${player[0].name}: ${player[0].score} ${player[1].name}: ${player[1].score}`;
    popup(score, 700, 'announcement');
  }

  // round(player) {
  //   // Turn.turn(player[1], player[2]);
  //   // Turn.turn(player[2], player[1]);
  //   this.checkGameEnd(player);
  // }


}

const endCheck = new Game;
