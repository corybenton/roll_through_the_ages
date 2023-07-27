/* eslint-disable no-use-before-define */
const buyDevelopment = (e) => {
  e.preventDefault();
  let development = document.querySelector('#developmentsDropdown').value;
  document.querySelector('#done').removeEventListener('click', buyDevelopment);
  removeChildren();
  // document.querySelector(`.${development} .learn`).classList = 'learned';
  if (development !== 'No development') {
    const cost = document.querySelector(`.${development} .cost`).textContent;
    learn.payForDevelopment(cost);
    learn.getRewards(development);
  } else {
    learn.goToCleanUp();
  }
};

const parseGoods = (e) => {
  e.preventDefault();
  document.querySelector('#done').removeEventListener('click', parseGoods);
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

const goToChoose = (e) => {
  e.preventDefault();
  document.querySelector('.yes').removeEventListener('click', sellFood);
  document.querySelector('.no').removeEventListener('click', goToChoose);
  learn.chooseDevelopment();
};

const sellFood = (e) => {
  e.preventDefault();
  popup('Would you like sell food for coins?', 1, 'choice');
  document.querySelector('.yes').removeEventListener('click', sellFood);
  document.querySelector('.no').removeEventListener('click', goToChoose);

  document.querySelector('.rangeFinder').setAttribute('max', learn.food);
  document.querySelector('.bar').innerHTML = learn.food;
  popup('How much food to sell?', 10000, 'range');
  document.querySelector('.range').addEventListener('submit', soldFood);
};

const soldFood = (e) => {
  e.preventDefault();
  const sold = document.querySelector('.rangeFinder').value;
  document.querySelector('.range').removeEventListener('submit', soldFood);
  popup('How much food to sell?', 1, 'range');

  learn.food = learn.food - sold;
  updateItem(learn.food, 'amount', 'Food');
  updateItem(learn.food, 'value', 'Food');
  learn.coins += sold * 4;
  let totalValue = learn.coins + learn.goodsValue;
  popup(`Money available: ${totalValue}`, 10000, 'resource');
  learn.chooseDevelopment();
};
// const startUp = () => {
//   learn.devStarter(7);
// };

// document.querySelector('#test').addEventListener('click', startUp);

class LearnDev {
  constructor(){
    this.goodsValue = 0;
    this.coins = 0;
    this.cost = 0;
    this.food = 0;
  }

  devStarter(){
    popup('Buying developments...', 40, 'announcement');
    this.goodsValue = getGoodsValue();
    this.coins = dice.coins;
    popup(`Money available: ${this.goodsValue + this.coins}`, 10000, 'resource');
    this.granaries();
    //this.chooseDevelopment();
  }

  chooseDevelopment() {
    popup('Would you like sell food for coins?', 1, 'choice');
    const noDev = document.createElement('option');
    const noDevName = document.createTextNode('No development');
    noDev.appendChild(noDevName);
    document.querySelector('#developmentsDropdown').appendChild(noDev);

    for (let i = 0; i < 13; i++) {
      const getDevCost = document.querySelector(`.dev${i} .cost`).innerHTML;
      let learned = document.querySelector(`.dev${i} .learn`);
      learned = learned.classList.contains('learned');
      if (getDevCost <= (this.goodsValue + this.coins) && !learned) {
        const newDev = document.createElement('option');
        let devName = document.querySelector(`.dev${i} .development`).innerHTML;
        devName = document.createTextNode(devName);
        newDev.appendChild(devName);
        document.querySelector('#developmentsDropdown').appendChild(newDev);
      }
    }
    popup('Which development to learn?', 20000, 'dropdown');
    document.querySelector('#done').addEventListener('click', buyDevelopment);
  }

  payForDevelopment(cost) {
    this.cost = cost - this.coins;
    if (this.cost > 0) {
      if (this.coins > 0) {
        this.coins = 0;
      } else {
        this.cost = cost;
      }
      if (this.cost > 0) {
        popup(`Cost: ${this.cost}`, 5000, 'resource');
        document.querySelector('#done').addEventListener('click', parseGoods);
        for (let i = 1; i <= 5; i++) {
          let goodVal = parseInt(document.querySelector(`.good${i} .value`).textContent);
          if (goodVal > 0) {

            const newGood = document.createElement('option');

            let goodNm = document.querySelector(`.good${i} .good`).innerHTML;
            goodNm = `${goodNm}: ${goodVal}`;
            goodNm = document.createTextNode(goodNm);
            newGood.appendChild(goodNm);
            document.querySelector('#developmentsDropdown').appendChild(newGood);
          }
        }
        popup('Which good to sell?', 20000, 'dropdown');
      }
    } else {
      popup('Go away', 1, 'resource');
      popup('Go away', 1, 'dropdown');
      this.goToCleanUp();
    }
  }

  async removeGoods(amountSold, typeSold) {
    removeChildren();
    this.cost = this.cost - amountSold;
    await updateItem(0, 'value', typeSold);
    await updateItem(0, 'amount', typeSold);
    this.payForDevelopment(this.cost);
  }

  async getRewards(development) {
    await updateItem(true, 'learned', development);
    const devScore = parseInt(document.querySelector(`.${development} .points`).textContent);
    const newScore = parseInt(document.querySelector('.score').textContent) + devScore;
    await updateItem(newScore, 'score');
  }

  goToCleanUp() {
    newTurn.cleanup();
  }

  granaries(){
    let granaries = document.querySelector('.Granaries .learn');
    granaries = granaries.classList.contains('learned');
    this.food = parseInt(document.querySelector('.Food .value').textContent);
    if (granaries && this.food > 0) {
      document.querySelector('.yes').innerHTML = 'Yes';
      document.querySelector('.yes').addEventListener('click', sellFood);
      document.querySelector('.no').innerHTML = 'No';
      document.querySelector('.no').addEventListener('click', goToChoose);
      popup('Would you like sell food for coins?', 10000, 'choice');
    } else {
      this.chooseDevelopment();
    }
  }
}

const learn = new LearnDev;
