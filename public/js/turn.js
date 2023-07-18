/* eslint-disable default-case */
const Dice = require('./dice');

class Turn {
  turn(player1, player2){
    const gamestate = fetch (player1.gamestate);
    const othergamestate = fetch (player2.gamestate);
    let dice = this.rollDice(gamestate);
    this.feedCities(gamestate, dice.food);
    this.resolveDisasters(gamestate, othergamestate, dice.skulls);
    this.useLabor(gamestate, othergamestate, dice.labor);
    this.assignGoods(gamestate.developments.quarrying.learned, dice.goods);
    this.buyDevelopment(dice.coins);
    this.cleanUp();
  }

  rollDice(gamestate) {
    let diceToRoll = document.querySelector(`.cities#${gamestate}`);
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
    let food = document.querySelector('.amount#food');
    food = food + diceFood;
    const cities = document.querySelector(`.cities#${gamestate}`);
    let disasters = document.querySelector(`.disasters#${gamestate}`);
    for (let i = 0; i < cities; i++) {
      if (food > 0) {
        food = food -1;
      } else {
        disasters = disasters + 1;
      }
    }
    //update gamestate
  }

  resolveDisasters(gamestate, othergamestate, skulls) {
    //annouce resolving disasters;
    const irrigation = document.querySelector('.learned#irrigation');
    const medicine = document.querySelector(`.learned#medicine#${othergamestate}`);
    const laborForGreatWall = document.querySelector(`.needed#great_wall#${gamestate}`);
    const religion = document.querySelector('.learned#religion');
    let disasters = document.querySelector(`.disasters#${gamestate}`);
    let otherDisasters = document.querySelector(`.disasters#${othergamestate}`);
    if (skulls === 2 && !irrigation) {
      disasters = disasters + 2;
      document.querySelector('#disasters#gamestate').innerHTML = disasters;
      //update disasters
    } else if (skulls === 3 && !medicine){
      otherDisasters = otherDisasters + 3;
      document.querySelector('#disasters#othergamestate').innerHTML = otherDisasters;
      //update otherplayers disasters
    } else if (skulls === 4 && laborForGreatWall === 0){
      disasters = disasters + 4;
      document.querySelector('#disasters#gamestate').innerHTML = disasters;
      //update disasters
    } else if (skulls <= 5 && !religion){
      //update goods.value, amount
    } else if (skulls <= 5 && religion) {
      //update otherPlayer good.value and amount
    }
  }

  useLabor(gamestate, player2, labor) {
    //announce using labor;
    let which, whichName, howMany, needed, score, points, firstOrSecond, cities;
    while (labor > 0) {
      which = addEventListener();//wait for click on building place (city or monument)
      //verify that the thing on is something that can be buile
      whichName = document.querySelector(`#${which}`);
      //box with incrementer max of needed or labor which ever is lower
      howMany = prompt(`How many to use on the ${whichName}?`);
      needed = document.querySelector(`.needed#${whichName}`);
      if (whichName === 'cities') {
        cities = document.querySelector(`.cities#${gamestate}`);
        if (howMany === needed){
          cities = cities + 1;
          needed = cities;
        } else {
          needed = needed - howMany;
        }
        labor = labor - howMany;
        //update citiesNeed and cities if changed
      } else {
        if (howMany === needed){
          score = document.querySelector(`.score#${gamestate}`);
          firstOrSecond = document.querySelector(`.needed#${which}#${player2}`);
          points = document.querySelector(`.points#${which}`);
          if (firstOrSecond === 0) {
            //parse points after /
          } else {
            //parse points before /
          }
          score = score + points;
        } else {
          needed = needed - howMany;
        }
        labor = labor - howMany;
        //update monuments built and score if changed
      }
    }
  }

  assignGoods(quarrying, goods) {
    let goodType = 'wood';
    let modifier = 0;
    for (let i = 0; i < goods; i++) {
      let goodTypeAmt = document.querySelector(`.amount#${goodType}`);
      goodTypeAmt += 1;
      if (goodTypeAmt = 'stone' && quarrying) {
        goodTypeAmt += 1;
      }

      let goodTypeVal = document.querySelector(`.value#${goodType}`);
      modifier = (i + 1) % 5;
      goodTypeVal = goodTypeVal + (modifier * goodTypeAmt);

      document.querySelector(`.amount#${goodType}`).innerHTML(goodTypeAmt);
      document.querySelector(`.value#${goodType}`).innerHTML(goodTypeVal);

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
    let woodValue = document.querySelector('.value#wood');
    let stoneValue = document.querySelector('.value#stone');
    let potteryValue = document.querySelector('.value#pottery');
    let clothValue = document.querySelector('.value#cloth');
    let spearheadValue = document.querySelector('.value#spearheads');
    const totalValue = parseInt(woodValue) + parseInt(stoneValue) + parseInt(potteryValue) +
      parseInt(clothValue) + parseInt(spearheadValue);

    //warn of potential losing goods
    prompt(`Buy a development? You have ${coins + totalValue} to spend?`);
    which = addEventListener();
    //validate which

    which = document.querySelector(`#${which}`);
    let goods = 0;
    let goodType, cost, goodValue;
    if (which !== 'No development') {
      cost = document.querySelector(`.cost#${which}`);
      while (goods < cost) {
      //prompt which goods to use
        goodType = addEventListener();
        //validate goodType
        goodValue = document.querySelector(`.value#${goodType}`);
        goods += goodValue;
        //update goodValue and amount
      }
    }
  }

  cleanup() {
    const woodAmt = document.querySelector('.amount#wood');
    const stoneAmt = document.querySelector('.amount#stone');
    const potteryAmt = document.querySelector('.amount#pottery');
    const clothAmt = document.querySelector('.amount#cloth');
    const spearheadAmt = document.querySelector('.amount#spearheads');
    const totalAmount = parseInt(woodAmt) + parseInt(stoneAmt) + parseInt(potteryAmt) +
      parseInt(clothAmt) + parseInt(spearheadAmt);
    let goodAmount, modifier;
    while (totalAmount > 6) {
      goodType = addEventListener();
      //validate goodType

      goodAmount = document.querySelector(`.amount#${goodType}`);
      goodAmount = goodAmount - 1;

      switch (goodType) {
      case 'wood':
        modifier = 1;
        break;
      case 'stone':
        modifier = 2;
        break;
      case 'pottery':
        modifier = 3;
        break;
      case 'cloth':
        modifier = 4;
        break;
      case 'spearheads':
        modifier = 5;
        break;
      }

      goodValue = goodValue - (modifier * goodAmount);

      //update amount and value
    }
  }
}

module.exports = Turn;