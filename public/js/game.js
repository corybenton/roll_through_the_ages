const Turn = require('./turn');

class Game {
  checkGameEnd(player) {
    let allMonumentsDone = true;
    for (let i = 0; i < 5; i++) {
      monumentDone[1] = parseInt(document.querySelector(`.needed.${i}#${player[1]}`).textContent);
      monumentDone[2] = parseInt(document.querySelector(`.needed.${i}#${player[2]}`).textContent);
      if (monumentDone[1] !== 0 || monumentDone[2] !== 0) {
        allMonumentsDone = false;
        break;
      }
    }
    for (let j = 1; j <= 2; j++) {
      let developmentsDone = 0;
      for (let k = 0; k < 13; k++) {
        let developmentLearned = document.querySelector(`.learned.#${k}#${player[j]}`);
        developmentLearned = developmentLearned.classList.contains('true');
        if (developmentLearned) {
          developmentsDone += developmentsDone;
        }
        if (developmentsDone === 5) {
          break;
        }
      }
      if (developmentsDone === 5) {
        break;
      }
    }
    if (allMonumentsDone || developmentsDone === 5){
      this.gameEnd(player);
    } else {
      this.round(player);
    }
  }

  gameEnd(player) {
    //announce game end
    const playerScore = [];
    const playerGoods = [];
    for (let i = 1; i <= 2; i++) {
      playerScore[i] = parseInt(document.querySelector(`.score#${player[i]}`).textContent);
      playerGoods[i] = this.getGoodsValue(player[i]);
      let architecture = document.querySelector(`.learned.architecture#${player[i]}`);
      architecture = architecture.classList.contains('true');
      if (architecture) {
        let monuments = 0;
        for (let j = 0; j < 5; j++) {
          const finished = document.querySelector(`.needed.${j}#${player[i]}`.textContent);
          if (finished === '0') {
            monuments += 1;
          }
        }
        playerScore[i] += monuments;
      }
      let empire = document.querySelector(`.learned.empire#${player[i]}`);
      empire = empire.classList.contains('true');
      if (empire) {
        const cities = parseInt(document.querySelector(`.cities${player[i]}`).textContent);
        playerScore[i] += cities;
      }
    }
    if (playerScore[1] > playerScore2 ||
        (playerScore[1] === playerScore[2] &&
            playerGoods[1] > playerGoods[2])) {
      //announce (`${player[1].name} wins!`);
    } else if (playerScore1 < playerScore2 ||
        (playerScore1 === playerScore2 &&
            playerGoods1 < playerGoods2)) {
      //announce (`${player[1].name} wins!`);
    } else{
      //announce ('Its a tie!');
    }
  }

  round(player) {
    Turn.turn(player[1], player[2]);
    Turn.turn(player[2], player[1]);
    Game.checkGameEnd(player);
  }

  getGoodsValue(player) {
    let totalVal, goodVal;
    for (let i = 1; i < 6; i++) {
      goodVal = parseInt(document.querySelector(`.value.${i}#${player}`));
      totalVal += goodVal;
    }
    return totalVal;
  }

}

module.exports = Game;