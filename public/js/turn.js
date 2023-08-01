/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
/* eslint-disable no-use-before-define */
class Turn {
  constructor(){
    //this.players = [];
    // this.turn = 2;
    this.currentPlayer;
    this.otherPlayer;
  }

  // turn(player1, player2){
  //   popup(`${player1}'s turn`, 150, 'announcement');

  //   this.feedCities(player1, dice.food);
  //   this.resolveDisasters(player1, player2, dice.skulls);
  //   let workIt = new Labor;
  //   workIt.laborStart(dice.labor);
  //   this.assignGoods(dice.goods);
  //   let learn = new LearnDev;
  //   learn.devStarter(dice.coins);
  //   this.cleanUp(player1);
  // }

  startRoll(){
    // if (this.turn === 0) {
    //   this.turn = 1;
    //   this.otherPlayer = player[0];
    // } else {
    //   this.turn = 0;
    //   this.otherPlayer = player[1];
    // }
    // this.currentPlayer = player[this.turn];
    this.resolveCarryoverDisasters;
    dice = new Dice;
    dice.diceHandler();
    document.querySelector('#okay').addEventListener('click', moveToFeed);
  }

  async feedCities() {
    popup('Feeding cities, resolving disasters, assigning goods...', 200, 'announcement');
    let disasters = parseInt(document.querySelector(`#${this.currentPlayer} .disasters`).textContent);

    let food = parseInt(document.querySelector(`#${this.currentPlayer} .Food .amount`).textContent);
    food = food + dice.food;
    if (food > 15) {
      food = 15;
    }
    const cities = parseInt(document.querySelector(`#${this.currentPlayer} .cities`).textContent);
    for (let i = 0; i < cities; i++) {
      if (food > 0) {
        food = food - 1;
      } else {
        disasters = disasters + 1;
      }
    }
    await updateItem(food, 'amount', 'Food');
    await updateItem(food, 'value', 'Food');
    await updateItem(disasters, 'disasters');
    this.resolveDisasters();
  }

  async resolveDisasters() {
    let irrigation = document.querySelector(`#${this.currentPlayer} .Irrigation .learn`);
    irrigation = irrigation.classList.contains('learned');
    let laborForGreatWall = parseInt(document.querySelector(`#${this.currentPlayer} .mon4 .needed`).textContent);
    let religion = document.querySelector(`#${this.currentPlayer} .Religion .learn`);
    religion = religion.classList.contains('learned');
    let disasters = parseInt(document.querySelector(`#${this.currentPlayer} .disasters`).textContent);

    if (dice.skulls === 2 && !irrigation) {
      disasters = disasters + 2;
    } else if (dice.skulls === 4 && laborForGreatWall !== 0){
      disasters = disasters + 4;
    } else if (dice.skulls >= 5 && ! religion){
      for (let i = 1; i < 6; i++) {
        const goodType = document.querySelector(`#${this.currentPlayer} good${i} .good`);
        await updateItem(0, 'amount', goodType);
        await updateItem(0, 'value', goodType);
      }
      dice.skulls = 0;
    }

    await updateItem(disasters, 'disasters');
    this.assignGoods();
  }

  async resolveCarryoverDisasters() {
    let medicine = document.querySelector(`#${this.currentPlayer} .Medicine .learn`);
    medicine = medicine.classList.contains('learned');
    let disasters = parseInt(document.querySelector(`#${this.currentPlayer} .disasters`).textContent);
    let religion = document.querySelector(`#${this.currentPlayer} .Religion .learn`);
    religion = religion.classList.contains('learned');
    if (dice.skulls === 3) {
      disasters = disasters + 3;
      await updateItem(disasters, 'disasters');
    } else if (dice.skulls >= 5 && !religion) {
      for (let i = 1; i < 6; i++) {
        const goodType = document.querySelector(`#${this.currentPlayer} good${i} .good`);
        await updateItem(0, 'amount', goodType);
        await updateItem(0, 'value', goodType);
      }
    }
  }

  moveToBuild(){
    document.querySelector('#okay').removeEventListener('click', moveToFeed);
    popup('Move to building monuments', 20000, 'ok');
    document.querySelector('#okay').addEventListener('click', timeForBuild);
  }

  async assignGoods() {
    let goodNum = 1;
    let quarrying = document.querySelector(`#${this.currentPlayer} .Quarrying .learn`);
    quarrying = quarrying.classList.contains('learned');
    for (let i = 1; i <= dice.goods; i++) {
      let goodTypeAmt = parseInt(document.querySelector(`#${this.currentPlayer} .good${goodNum} .amount`).textContent);
      let goodTypeVal = parseInt(document.querySelector(`#${this.currentPlayer} .good${goodNum} .value`).textContent);
      if (goodTypeAmt < 9 - goodNum) {
        goodTypeAmt += 1;
        goodTypeVal = goodTypeVal + (goodNum * goodTypeAmt);
      }
      if (goodNum === 2 && quarrying && goodTypeAmt < 9 - goodNum) {
        goodTypeAmt += 1;
        goodTypeVal = goodTypeVal + (goodNum * goodTypeAmt);
      }

      let goodNumType;
      switch(goodNum){
      case 1:
        goodNumType = 'Wood';
        break;
      case 2:
        goodNumType = 'Stone';
        break;
      case 3:
        goodNumType = 'Pottery';
        break;
      case 4:
        goodNumType = 'Cloth';
        break;
      case 5:
        goodNumType = 'Spearheads';
        break;
      }

      await updateItem(goodTypeAmt, 'amount', goodNumType);
      await updateItem(goodTypeVal, 'value', goodNumType);

      if (goodNum === 5) {
        goodNum = 1;
      } else {
        goodNum += 1;
      }
    }
    this.moveToBuild();
  }

  cleanup() {
    let totalAmount = 0;
    let goodAmount = 0;
    let goodValue = 0;
    let caravans = document.querySelector(`#${this.currentPlayer} .Caravans .learn`);
    caravans = caravans.classList.contains('learned');
    for (let i = 1; i <= 5; i++){
      goodAmount = parseInt(document.querySelector(`#${this.currentPlayer} .good${i} .amount`).textContent);
      totalAmount += goodAmount;
    }
    if (!caravans && totalAmount > 6) {
      document.querySelector('#done').addEventListener('click', cleanupGoods);
      removeChildren();
      for (let i = 1; i <= 5; i++){
        goodAmount = parseInt(document.querySelector(`#${this.currentPlayer} .good${i} .amount`).textContent);
        goodValue = parseInt(document.querySelector(`#${this.currentPlayer} .good${i} .value`).textContent);
        if (goodAmount > 0) {
          const newGood = document.createElement('option');
          let goodName = document.querySelector(`#${this.currentPlayer} .good${i} .good`).innerHTML;
          const newValue = goodValue - (i * goodAmount);
          goodName = `${goodName} : ${goodAmount} new value=${newValue}`;
          goodName = document.createTextNode(goodName);
          newGood.appendChild(goodName);
          document.querySelector('#developmentsDropdown').appendChild(newGood);
        }
      }
      popup('What will you get rid of?', 5000, 'dropdown');
      const message = `You have ${totalAmount} resources.  You can only keep 6`;
      popup(message, 10000, 'resource');
    } else {
      document.querySelector('#done').removeEventListener('click', cleanupGoods);
      removeChildren();
      popup('Go away', 1, 'dropdown');
      endCheck.checkGameEnd(player);
    }
  }

  async doCleanup(getType) {
    let goodAmount = parseInt(document.querySelector(`#${newTurn.currentPlayer} .${getType} .amount`).textContent);

    let mod;
    for (let i = 1; i <= 5; i++) {
      const getGood = document.querySelector(`#${newTurn.currentPlayer} .good${i} .good`).textContent;
      if (getGood === getType){
        mod = i;
      }
    }

    let goodValue = parseInt(document.querySelector(`#${newTurn.currentPlayer} .${getType} .value`).textContent);
    goodValue = goodValue - (mod * goodAmount);
    goodAmount = goodAmount - 1;

    await updateItem(goodValue, 'value', getType);
    await updateItem(goodAmount, 'amount', getType);

    this.cleanup();
  }
}


// let takeTurn;

const cleanupGoods = (e) => {
  e.preventDefault();
  const getValue = document.querySelector('#developmentsDropdown').value;
  let getType = getValue.slice(0, getValue.length - 16);
  getType = getType.replace(' ', '');
  newTurn.doCleanup(getType);
};

// const startUp4 = () => {
//   takeTurn = new Turn;
//   takeTurn.cleanup();
// };

// document.querySelector('#test').addEventListener('click', startUp4);
// const takeTurn = new Turn();
// takeTurn.turn();

const moveToFeed = (e) => {
  e.preventDefault();
  document.querySelector('.yes').removeEventListener('click', foodHandler);
  document.querySelector('.no').removeEventListener('click', laborHandler);
  popup(`You gained ${dice.coins} coins, ${dice.food} food, ${dice.labor} labor, ${dice.goods} goods, and ${dice.skulls} skulls`, 1000, 'resource');
  popup('Feed', 1, 'ok');
  newTurn.feedCities();
};

const timeForBuild = (e) => {
  e.preventDefault();
  document.querySelector('#okay').removeEventListener('click', timeForBuild);
  workIt.laborStart();
};

const startRollHandler = (e) => {
  e.preventDefault();
  newTurn.startRoll();
};

const newTurn = new Turn;
