/* eslint-disable default-case */
class Turn {
  turn(player1, player2){
    popup(`${player1}'s turn`, 150, 'announcement');
    let dice = new Dice();
    dice.resetDice();
    dice = dice.rollDice();
    this.feedCities(player1, dice.food);
    this.resolveDisasters(player1, player2, dice.skulls);
    let workIt = new Labor;
    workIt.laborStart(dice.labor);
    this.assignGoods(dice.goods);
    let learn = new LearnDev;
    learn.devStarter(dice.coins);
    this.cleanUp(player1);
  }

  feedCities(gamestate, diceFood) {
    popup('Feeding cities...', 200, 'announcement');
    let food = parseInt(document.querySelector(`#${gamestate} .food .amount`).textContent);
    food = food + diceFood;
    if (food > 15) {
      food = 15;
    }
    const cities = document.querySelector(`#${gamestate} .cities`).textContent;
    let disasters = parseInt(document.querySelector(`#${gamestate} .disasters`).textContent);
    for (let i = 0; i < cities; i++) {
      if (food > 0) {
        food = food - 1;
      } else {
        disasters = disasters + 1;
      }
    }
    updateItem(food, 'amount', 'food');
    updateItem(food, 'value', 'food');
    updateItem(disasters, 'disasters');
  }

  resolveDisasters(gamestate, othergamestate, skulls) {
    popup('Resolving disasters...', 200, 'announcement');
    let irrigation = document.querySelector(`#${gamestate} .irrigation .learned`);
    irrigation = irrigation.classList.contains('true');
    let medicine = document.querySelector(`#${othergamestate} .medicine .learned`);
    medicine = medicine.classList.contains('true');
    let laborForGreatWall = parseInt(document.querySelector(`#${gamestate} .Great_Wall .needed`).textContent);
    let religion = document.querySelector(`${gamestate} .religion .learned`);
    religion = religion.classList.contains('true');
    let otherReligion = document.querySelector(`${othergamestate} .religion .learned`);
    otherReligion = religion.classList.contains('true');
    let disasters = parseInt(document.querySelector(`#${gamestate} .disasters`).textContent);
    let otherDisasters = parseInt(document.querySelector(`#${othergamestate} .disasters`).textContent);
    let revolt;

    if (skulls === 2 && !irrigation) {
      disasters = disasters + 2;
    } else if (skulls === 3 && !medicine){
      otherDisasters = otherDisasters + 3;
      updateItem(otherDisasters, 'disasters', '', othergamestate);
    } else if (skulls === 4 && laborForGreatWall !== 0){
      disasters = disasters + 4;
    } else if (skulls <= 5 ){
      if (!religion) {
        revolt = gamestate;
      } else if (!otherReligion){
        revolt = othergamestate;
      }
      if (revolt) {
        for (let i = 1; i < 6; i++) {
          const goodType = document.querySelector(`good${i} .good`);
          updateItem(0, 'amount', goodType, revolt);
          updateItem(0, 'value', goodType, revolt);
        }
      }
    }
    updateItem(disasters, 'disasters');
  }

  assignGoods(gamestate, goods) {
    popup('Assigning goods...', 200, 'announcement');
    let goodType = 1;
    let quarrying = document.querySelector('.learned .quarrying');
    quarrying = quarrying.classList.contains('true');
    for (let i = 0; i < goods; i++) {
      let goodTypeAmt = parseInt(document.querySelector(`.good${goodType} .amount`).textContent);
      if (goodTypeAmt < 9 - goodType) {
        goodTypeAmt += 1;
      }
      if (goodType = 2 && quarrying && goodTypeAmt < 9 - goodType) {
        goodTypeAmt += 1;
      }

      let goodTypeVal = parseInt(document.querySelector(`.${goodType} .value`).textContent);
      goodTypeVal = goodTypeVal + (goodType * goodTypeAmt);

      updateItem(goodTypeAmt, goodType, 'amount');
      updateItem(goodTypeVal, goodType, 'value');

      if (goodType === 5) {
        goodType = 1;
      } else {
        goodType += 1;
      }
    }
  }

  cleanup() {
    let totalAmount = 0;
    let goodAmount = 0;
    let goodValue = 0;
    let caravans = false;//document.querySelector('.caravans .learned');
    //caravans = caravans.classList.contains('true');
    for (let i = 1; i <= 5; i++){
      goodAmount = parseInt(document.querySelector(`.good${i} .amount`).textContent);
      totalAmount += goodAmount;
      break;
    }
    if (!caravans && totalAmount > 6) {
      document.querySelector('.dropdown').addEventListener('click', cleanupGoods);
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
        break;
      }
      popup('What will you get rid of?', 3000, 'dropdown');
      const message = `You have ${totalAmount} resources.  You can only keep 6`;
      popup(message, 1000, 'resource');
    } else {
      document.querySelector('.dropdown').removeEventListener('click', cleanupGoods);
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
        break;
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


let takeTurn;

const cleanupGoods = () => {
  const getValue = document.querySelector('#developmentsDropdown').value;
  let getType = getValue.slice(0, getValue.length - 16);
  getType = getType.replace(' ', '');
  takeTurn.doCleanup(getType);
};

// const startUp4 = () => {
//   takeTurn = new Turn;
//   takeTurn.cleanup();
// };

// document.querySelector('#test').addEventListener('click', startUp4);
// const takeTurn = new Turn();
// takeTurn.turn();
