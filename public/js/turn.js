/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
/* eslint-disable no-use-before-define */
class Turn {
  // constructor(){
  //   this.dice = 0;
  // }

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
    dice.diceHandler();
    document.querySelector('#okay').addEventListener('click', moveToFeed);
  }

  async feedCities() {
    popup('Feeding cities, resolving disasters, assigning goods...', 200, 'announcement');
    let disasters = parseInt(document.querySelector('.disasters').textContent);

    let food = parseInt(document.querySelector('.Food .amount').textContent);
    food = food + dice.food;
    if (food > 15) {
      food = 15;
    }
    const cities = parseInt(document.querySelector('.cities').textContent);
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
    let irrigation = document.querySelector('.Irrigation .learn');
    irrigation = irrigation.classList.contains('learned');
    let medicine = document.querySelector('.Medicine .learn');
    medicine = medicine.classList.contains('learned');
    let laborForGreatWall = parseInt(document.querySelector('.mon4 .needed').textContent);
    let religion = document.querySelector('.Religion .learn');
    religion = religion.classList.contains('learned');
    // let otherReligion = document.querySelector(`${othergamestate} .religion .learn`);
    // otherReligion = religion.classList.contains('learned');
    let disasters = parseInt(document.querySelector('.disasters').textContent);
    // let otherDisasters = parseInt(document.querySelector(`#${othergamestate} .disasters`).textContent);
    let revolt;

    if (dice.skulls === 2 && !irrigation) {
      disasters = disasters + 2;
    } else if (dice.skulls === 3 && !medicine){
      // otherDisasters = otherDisasters + 3;
      // updateItem(otherDisasters, 'disasters', '', othergamestate);
    } else if (dice.skulls === 4 && laborForGreatWall !== 0){
      disasters = disasters + 4;
    } else if (dice.skulls >= 5 ){
      if (!religion) {
      //   revolt = gamestate;
      // // } else if (!otherReligion){
      // //   revolt = othergamestate;
      // }
      // if (revolt) {
        for (let i = 1; i < 6; i++) {
          const goodType = document.querySelector(`good${i} .good`);
          updateItem(0, 'amount', goodType, revolt);
          updateItem(0, 'value', goodType, revolt);
        }
      }
    }
    await updateItem(disasters, 'disasters');
    this.assignGoods();
  }

  moveToBuild(){
    document.querySelector('#okay').removeEventListener('click', moveToFeed);
    popup('Move to building monuments', 500, 'ok');
    document.querySelector('#okay').addEventListener('click', timeForBuild);
  }

  async assignGoods() {
    let goodNum = 1;
    let quarrying = document.querySelector('.Quarrying .learn');
    quarrying = quarrying.classList.contains('learned');
    for (let i = 1; i <= dice.goods; i++) {
      let goodTypeAmt = parseInt(document.querySelector(`.good${goodNum} .amount`).textContent);
      let goodTypeVal = parseInt(document.querySelector(`.good${goodNum} .value`).textContent);
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
    let caravans = document.querySelector('.Caravans .learn');
    caravans = caravans.classList.contains('learned');
    for (let i = 1; i <= 5; i++){
      goodAmount = parseInt(document.querySelector(`.good${i} .amount`).textContent);
      totalAmount += goodAmount;
    }
    if (!caravans && totalAmount > 6) {
      document.querySelector('#done').addEventListener('click', cleanupGoods);
      removeChildren();
      for (let i = 1; i <= 5; i++){
        goodAmount = parseInt(document.querySelector(`.good${i} .amount`).textContent);
        goodValue = parseInt(document.querySelector(`.good${i} .value`).textContent);
        if (goodAmount > 0) {
          const newGood = document.createElement('option');
          let goodName = document.querySelector(`.good${i} .good`).innerHTML;
          const newValue = goodValue - (i * goodAmount);
          goodName = `${goodName} : ${goodAmount} new value=${newValue}`;
          goodName = document.createTextNode(goodName);
          newGood.appendChild(goodName);
          document.querySelector('#developmentsDropdown').appendChild(newGood);
        }
      }
      popup('What will you get rid of?', 3000, 'dropdown');
      const message = `You have ${totalAmount} resources.  You can only keep 6`;
      popup(message, 1000, 'resource');
    } else {
      document.querySelector('#done').removeEventListener('click', cleanupGoods);
      removeChildren();
      popup('Go away', 1, 'resource');
      popup('Go away', 1, 'dropdown');
    }
  }

  async doCleanup(getType) {
    let goodAmount = parseInt(document.querySelector(`.${getType} .amount`).textContent);

    let mod;
    for (let i = 1; i <= 5; i++) {
      const getGood = document.querySelector(`.good${i} .good`).textContent;
      if (getGood === getType){
        mod = i;
      }
    }

    let goodValue = parseInt(document.querySelector(`.${getType} .value`).textContent);
    goodValue = goodValue - (mod * goodAmount);
    goodAmount = goodAmount - 1;

    await updateItem(goodValue, 'value', getType);
    await updateItem(goodAmount, 'amount', getType);

    this.cleanup();
  }
}


// let takeTurn;

const cleanupGoods = () => {
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

const moveToFeed = () => {
  newTurn.feedCities();
};

const timeForBuild = () => {
  workIt.laborStart();
};

const newTurn = new Turn;