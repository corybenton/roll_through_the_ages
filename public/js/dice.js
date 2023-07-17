/* eslint-disable default-case */
class Dice {
  constructor (){
    this.coins = 0;
    this.labor = 0;
    this.skulls = 0;
    this.food = 0;
    this.goods = 0;
  }

  displayDice(dieResult, dieNumber) {
    switch (dieResult) {
    case 1:
      display = '2 goods, 1 skull';
      dieNumber.kept = true;
      break;
    case 2:
      display = '1 good';
      break;
    case 3:
      display = '1 coin';
      break;
    case 4:
      display = '3 food';
      break;
    case 5:
      display = '3 labor';
      break;
    case 6:
      display = '2 food or 2 labor';
      break;
    }
    dieNumber.value = display;
  }

  applyDieResult(dieResult, dice, choice, developments) {
    switch (dieResult) {
    case 1:
      dice.skulls += 1;
      dice.goods += 2;
      break;
    case 2:
      dice.goods += 1;
      break;
    case 3:
      if (developments.coinage.learned) {
        dice.coins += 12;
      } else {
        dice.coins += 7;
      }
      break;
    case 4:
      dice.food += 3;
      if (developments.aggriculture.learned) {
        dice.food += 1;
      }
      break;
    case 5:
      dice.labor += 3;
      if (developments.masonry.learned) {
        dice.labor += 1;
      }
      break;
    case 6:
      if (choice === 'labor') {
        dice.labor += 2;
        if (developments.masonry.learned) {
          dice.labor += 1;
        }
      } else {
        dice.food += 2;
        if (developments.aggriculture.learned) {
          dice.food += 1;
        }
      }
      break;
    }
    return dice;
  }
}

module.exports = Dice;