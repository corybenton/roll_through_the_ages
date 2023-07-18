const Turn = require('./turn');

class Game {
  checkGameEnd() {
    //fetch monuments and developments from each player
    if (allMonumentsDone || developmentsDone){
      this.gameEnd();
    } else {
      this.round();
    }
  }

  gameEnd() {
    //fetch player scores and goodsValues
    if (player1.score > player2.score ||
        (player1.score === player2.score &&
            player1.goodsValue > player2.goodsValue)) {
      console.log (`${player1.username} wins!`);
    } else if (player1.score < player2.score ||
        (player1.score === player2.score &&
            player1.goodsValue < player2.goodsValue)) {
      console.log(`${player2.username} wins!`);
    } else{
      console.log ('Its a tie!');
    }
  }

  round() {
    Turn.turn(player1, player2);
    Turn.turn(player2, player1);
    Game.checkGameEnd(player1, player2);
  }

}

module.exports = Game;