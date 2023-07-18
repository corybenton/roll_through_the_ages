const Turn = require('./turn');

class Game {
  checkGameEnd() {
    //fetch totalMonument + developments/player
    //const player1Monuments = fetch ()
    if (totalMonuments = 5 || player1.numberDevelopments <= 5
        || player2.numberDevelopments <= 5){
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