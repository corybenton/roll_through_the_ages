const Turn = require('/turn');
const Game = require('/game');

const buyDevelopment = () => {
  document.querySelector('#done').removeEventListener('click', buyDevelopment);
  let development = document.querySelector('#developmentsDropdown').value;
  learn.removeChildren();
  document.querySelector(`.${development} .learned`).classList = true;
  const cost = document.querySelector(`.${development} .cost`).textContent;
  learn.payForDevelopment(cost);
};

const parseGoods = () => {
  const getValue = document.querySelector('#developmentsDropdown').value;
  const amountSold = parseInt(getValue.slice(-2));
  let numMod;
  if (amountSold >= 10) {
    numMod = 4;
  } else {
    numMod = 3;
  }
  const typeSold = getValue.slice(0, getValue.length - numMod);
  learn.removeGoods(amountSold, typeSold);
};

class LearnDev {
  constructor(){
    this.totalValue = Game.totalValue(),
    this.coins = 0;
    this.cost = 0;
  }

  devStarter(coins){
    popup('Buying developments...', 40, 'announcement');
    this.coins = coins;
    popup(`Money available: ${totalValue + this.coins}`, 10000, 'resource');
    //granaries();
    this.chooseDevelopment();
  }

  chooseDevelopment() {
    // popup('Would you like sell food for coins?', 1, 'choice');
    const noDev = document.createElement('option');
    const noDevName = document.createTextNode('No development');
    noDev.appendChild(noDevName);
    document.querySelector('#developmentsDropdown').appendChild(noDev);

    for (let i = 0; i < 13; i++) {
      const getDevCost = document.querySelector(`.dev${i} .cost`).innerHTML;
      let learned = document.querySelector(`.dev${i} .learned`);
      learned = learned.classList.contains('true');
      if (getDevCost < (this.totalValue + this.coins) && !learned) {
        const newDev = document.createElement('option');
        let name = document.querySelector(`.dev${i} .development`).innerHTML;
        name = document.createTextNode(name);
        newDev.appendChild(name);
        document.querySelector('#developmentsDropdown').appendChild(newDev);
      }
    }
    popup('Which development to learn?', 20000, 'dropdown');
    document.querySelector('#done').addEventListener('click', buyDevelopment);
  }

  payForDevelopment(cost) {
    if (cost > 0) {
      this.cost = cost - this.coins;
      document.querySelector('#done').addEventListener('click', parseGoods);
      for (let i = 1; i <= 5; i++) {
        let goodAmt = parseInt(document.querySelector(`#${gamestate} .good${i} .amount`).value);
        if (goodAmt > 0) {

          const newGood = document.createElement('option');

          let name = document.querySelector(`.good${i} .good`).innerHTML;
          name = `${name}: ${goodAmt}`;
          name = document.createTextNode(name);
          newGood.appendChild(name);
          document.querySelector('#developmentsDropdown').appendChild(newGood);
        }
      }
      popup('Which good to sell?', 20000, 'dropdown');
    } else {
      popup('Go away', 1, 'resource');
      popup('Go away', 1, 'dropdown');
    }
  }

  removeChildren() {
    const erase = document.querySelector('#developmentsDropdown');
    while (erase.hasChildNodes()){
      erase.removeChild(erase.firstChild);
    }
  }

  removeGoods(amountSold, typeSold) {
    this.cost = this.cost - amountSold;
    this.payForDevelopment(this.cost);
    Turn.updateItem(0, 'value', typeSold);
    Turn.updateItem(0, 'amount', typeSold);
    this.payForDevelopment(cost);
  }

  // function granaries(){
  //   const granaries = true;
  //   const food = 7;
  //   if (granaries && food > 0) {
  //     document.querySelector('.yes').innerHTML = 'Yes';
  //     document.querySelector('.yes').addEventListener('click', sellFood);
  //     document.querySelector('.no').innerHTML = 'No';
  //     document.querySelector('.no').addEventListener('click', goToChoose);
  //     this.popup('Would you like sell food for coins?', 10000, 'choice');
  //   } else {
  //     chooseDevelopment();
  //   }
  // }

  // const goToChoose = () => {
  //   chooseDevelopment();
  // };

  // const sellFood = () => {
  //   const food = 7;
  //   popup('Would you like sell food for coins?', 1, 'choice');
  //   document.querySelector('.yes').removeEventListener('click', sellFood);

  //   document.querySelector('.rangeFinder').setAttribute('max', food);
  //   document.querySelector('.bar').innerHTML = food;
  //   popup('How much food to sell?', 10000, 'range');
  //   document.querySelector('.range').addEventListener('submit', soldFood);
  // };

  // const soldFood = () => {
  //   document.querySelector('.range').removeEventListener('submit', soldFood);
  //   popup('How much food to sell?', 1, 'range');
  //   const sold = document.querySelector('.rangeFinder').value;
  //   let food = 7;
  //   let coins = 0;
  //   food = food - sold;
  //   coins += sold * 4;
  //   let totalValue = coins + 15;
  //   popup(`Money available: ${totalValue}`, 10000, 'resource');
  //   chooseDevelopment();
  // };

}

module.exports = LearnDev;