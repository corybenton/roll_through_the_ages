/* eslint-disable default-case */
const Dice = require('./dice');

class Turn {
  turn(player1, player2){
    const gamestate = fetch (player1.gamestate);
    const othergamestate = fetch (player2.gamestate);
    let dice = this.rollDice(gamestate);
    this.feedCities(gamestate, dice.food);
    this.resolveDisasters(gamestate, othergamestate, dice.skulls);
    this.useLabor(gamestate, othergamestate.monuments, dice.labor);
    this.assignGoods(gamestate, dice.goods);
    this.buyDevelopment(gamestate, dice.coins);
    this.cleanUp(gamestate.goods);
  }

  rollDice(gamestate) {
    let diceToRoll = gamestate.cities;
    let dice = new Dice();
    for (let j = 0; j < 3; j++) {
      if (diceToRoll > 0) {
        //announce `Die Roll: ${j};
        for (let i = 0; i < diceToRoll; i++) {
          dieResult = Math.float(Math.random() * 6);
          Dice.displayDice(dieResult, i);
        }
        //select dice for keeping
        diceToRoll = diceToRoll - dice.skulls - dice.kept;
      }
    }
    for (let k = 0; k < gamestate.cities; k++) {
      //fetch die[k].dieResult
      //choose goods or food for case 6
      let dieState = dice.applyDieResult(dieResult, dice, choice, gamestate.developments);
      return dieState;
    }
  }

  feedCities(gamestate, diceFood) {
    //announce feeding cities;
    let food = gamestate.goods.food + diceFood;
    for (let i = 0; i < gamestate.cities; i++) {
      if (food > 0) {
        food = food -1;
      } else {
        gamestate.disasters = gamestate.disasters + 1;
      }
    }
    //update gamestate
  }

  resolveDisasters(gamestate, othergamestate, skulls) {
    //annouce resolving disasters;
    if (skulls === 2 && !development.irrigation.learned) {
      gamestate.disasters = gamestate.disasters + 2;
      //update disasters
    } else if (skulls === 3 && !othergamestate.development.medicine.learned){
      othergamestate.disasters = othergamestate.disasters + 3;
      //update otherplayers disasters
    } else if (skulls === 4 && gamestate.monuments.greatWall.needed !== 0){
      gamestate.disasters = gamestate.disasters + 4;
      //update disasters
    } else if (skulls <= 5 && !gamestate.developments.religion.learned){
      gamestate.goods.value = 0;
      gamestate.goods.amount = 0;
      //update goods.value, amount
    } else if (skulls <= 5 && gamestate.developments.religion.learned) {
      othergamestate.goods.value = 0;
      othergamestate.goods.amount = 0;
      //update otherPlayer good.value and amount
    }
  }

  useLabor(gamestate, otherMonuments, labor) {
    //announce using labor;
    let choice, howMany;
    while (labor > 0) {
      choice = prompt('Cities or Monuments?');
      if (choice === 'Cities') {
        howMany = prompt('How many to use on cities?');
        if (howMany >= gamestate.citiesNeed){
          gamestate.cities = gamestate.cities + 1;
          labor = labor - gamestate.citiesNeed;
          gamestate.citiesNeed = gamestate.cities;
        } else {
          player.citiesNeed = player.citiesNeed - howMany;
          labor = labor - howMany;
        }
        //update citiesNeed
      } else {
        //which = prompt('Which monument?');
        howMany = prompt('How many to use on this monument?');
        if (howMany === gamestate.monuments.which.needed){
          gamestate.monuments.which.needed = 0;
          if (otherMonuments.which.needed = 0) {
            gamestate.score = gamestate.score + gamestate.monument.which.pointsSecond;
          } else {
            gamestate.score = gamestate.score + gamestate.monument.which.pointsFirst;
          }
        } else {
          gamestate.monuments.which.needed = gamestate.monuments.which.needed - howMany;
        }
        //update monuments built
      }
    }
  }

  assignGoods(gamestate, goods) {
    let goodType = 'wood';
    for (let i = 0; i < goods; i++) {
      goodType += 1;
      if (goodType = 'stone' && gamestate.developments.quarrying.learned) {
        goodType += 1;
      }
      updateGamestate(goodType);
      switch (goodType) {
      case 'wood':
        goodType = 'stone';
        break;
      case 'stone':
        goodType = 'pottery';
        break;
      case 'pottery':
        goodType = 'cloth';
        break;
      case 'cloth':
        goodType = 'spearheads';
        break;
      case 'spearheads':
        goodType = 'wood';
        break;
      }
    }
  }

  buyDevelopment(gamestate, coins) {
    const lowestPrice = fetch(devlopment.cost);//fetch first development not learned
    const totalValue = gamestate.goods.wood.value; //...
    if (coins + gamestate.goods.totalValue > lowestPrice) {
      const buy = prompt(`Buy a development? You have ${coins + totalValue} to spend?`);
      if (buy === 'Yes') {
        which = prompt('Which development?');
        which.learned = true;
      } else {
        //warn of potential losing goods
      }
    }
  }

  cleanup(goods) {
    let totalAmount = goods.wood.amount; //+...
    while (totalAmount > 6) {
      //check values of goods
      //discard lowest value
    }
  }
}

module.exports = Turn;