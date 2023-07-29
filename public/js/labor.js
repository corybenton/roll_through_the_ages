/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
class Labor {
  constructor() {
    // this.takeTurn = new Turn;
    // this.monName = 0;
    this.newBuild = 0;
    this.buildNeed = 0;
    this.labor = 0;
    this.cities = 0;
    this.stone = 0;
  }

  laborStart() {
    popup('Using labor...', 40, 'announcement');
    this.cities = parseInt(document.querySelector(`#${newTurn.currentPlayer} .cities`).textContent);
    this.labor = dice.labor;
    this.engineering();
  }

  chooseBuild() {
    popup('Would you like use stone for labor?', 1, 'choice');
    if (this.labor > 0){
      popup('Build', 1, 'ok');
      let anyToBuild = false;
      popup(`Labor available: ${this.labor}`, 20000, 'resource');
      if (this.cities < 7) {
        anyToBuild = true;
        const cityBuild = document.createElement('option');
        const cityBuildText = document.createTextNode('New city');
        cityBuild.appendChild(cityBuildText);
        document.querySelector('#developmentsDropdown').appendChild(cityBuild);
      }
      for (let i = 0; i < 5; i++) {
        let buildNeed = parseInt(document.querySelector(`#${newTurn.currentPlayer} .mon${i} .needed`).textContent);
        if (buildNeed > 0) {
          anyToBuild = true;
          const newMon = document.createElement('option');
          let nameEl = document.querySelector(`#${newTurn.currentPlayer} .mon${i} .build`).innerHTML;
          nameEl = document.createTextNode(nameEl);
          newMon.appendChild(nameEl);
          newMon.setAttribute('value', `mon${i}`);
          document.querySelector('#developmentsDropdown').appendChild(newMon);
        }
      }
      if (!anyToBuild) {
        this.finish();
      } else {
        popup('Which object to build?', 20000, 'dropdown');
        document.querySelector('#done').addEventListener('click', buildIt);
      }
    } else {
      this.finish();
    }
  }

  spendLabor(newBuild) {
    removeChildren();
    this.newBuild = newBuild;
    if (this.newBuild === 'New city') {
      this.buildNeed = parseInt(document.querySelector(`#${newTurn.currentPlayer} .citiesNeed`).textContent);
    } else {
    //   this.monName = document.querySelector(`.${newBuild} > .build`).textContent;
      this.buildNeed = parseInt(document.querySelector(`#${newTurn.currentPlayer} .${newBuild} .needed`).textContent);
    }
    let maxUsage;
    if (this.buildNeed < this.labor) {
      maxUsage = this.buildNeed;
    } else {
      maxUsage = this.labor;
    }
    document.querySelector('.rangeFinder').setAttribute('max', maxUsage);
    document.querySelector('.rangeFinder').setAttribute('value', maxUsage);
    document.querySelector('.bar').innerHTML = maxUsage;
    document.querySelector('.range').addEventListener('submit', useIt);
    popup('How much labor to use?', 20000, 'range');
  }

  async updateLabor(spentLabor) {
    removeChildren();
    this.buildNeed = this.buildNeed - spentLabor;
    if (this.buildNeed === 0) {
      if (this.newBuild === 'New city') {
        this.cities += 1;
      } else {
        let score = parseInt(document.querySelector(`#${newTurn.currentPlayer} .score`).textContent);
        const alreadyBuilt = parseInt(document.querySelector(`#${newTurn.otherPlayer} .${this.newBuild} .needed`));
        let points = document.querySelector(`#${newTurn.currentPlayer} .${this.newBuild} .points`).textContent;
        if (alreadyBuilt === 0) {
          points = parseInt(points.slice(-1));
        } else {
          points = parseInt(points.slice(0, points.length - 2));
        }
        score = score + points;
        await updateItem(score, 'score');
        this.buildNeed = 0;
      }
    }
    if (this.newBuild === 'New city') {
      if (this.buildNeed === 0 && this.cities < 7) {
        this.buildNeed = this.cities;
      }
      await updateItem(this.cities, 'cities');
      await updateItem(this.buildNeed, 'citiesNeed');
    } else {
      await updateItem(this.buildNeed, 'needed', this.newBuild);
    }
    this.labor = this.labor - spentLabor;
    this.chooseBuild();
  }

  finish() {
    popup('Finish', 1, 'dropdown');
    popup('Finish', 1, 'range');
    popup('Finish', 1, 'resource');
    document.querySelector('#okay').removeEventListener('click', timeForBuild);
    document.querySelector('#okay').addEventListener('click', moveToDev);
    document.querySelector('.range').removeEventListener('submit', useIt);
    popup('Move to developments', 20000, 'ok');
  }

  engineering(){
    let engineering = document.querySelector(`#${newTurn.currentPlayer} .Engineering .learn`);
    engineering = engineering.classList.contains('learned');
    this.stone = parseInt(document.querySelector(`#${newTurn.currentPlayer} .Stone .amount`).textContent);
    if (engineering && this.stone > 0) {
      document.querySelector('.yes').innerHTML = 'Yes';
      document.querySelector('.yes').addEventListener('click', sellStone);
      document.querySelector('.no').innerHTML = 'No';
      document.querySelector('.no').addEventListener('click', goToBuild);
      popup('Would you like use stone for labor?', 10000, 'choice');
    } else {
      this.chooseBuild();
    }
  }
}
const buildIt = (e) => {
  e.preventDefault();
  const newBuild = document.querySelector('#developmentsDropdown').value;
  document.querySelector('#done').removeEventListener('click', buildIt);
  workIt.spendLabor(newBuild);
};

const useIt = (e) => {
  e.preventDefault();
  const spentLabor = document.querySelector('.rangeFinder').value;
  workIt.updateLabor(spentLabor);
};

const moveToDev = (e) => {
  e.preventDefault();
  document.querySelector('#okay').removeEventListener('click', moveToDev);
  popup('Dev', 1, 'ok');
  learn.devStarter();
};

const goToBuild = (e) => {
  e.preventDefault();
  document.querySelector('.yes').removeEventListener('click', sellStone);
  document.querySelector('.no').removeEventListener('click', goToBuild);
  workIt.chooseBuild();
};

const sellStone = (e) => {
  e.preventDefault();
  popup('Would you like use stone for labor?', 1, 'choice');
  document.querySelector('.yes').removeEventListener('click', sellStone);
  document.querySelector('.no').removeEventListener('click', goToBuild);

  document.querySelector('.rangeFinder').setAttribute('max', workIt.stone);
  document.querySelector('.bar').innerHTML = workIt.stone;
  popup('How much stone to use?', 10000, 'range');
  document.querySelector('.range').addEventListener('submit', usedStone);
};

const usedStone = (e) => {
  e.preventDefault();
  const sold = document.querySelector('.rangeFinder').value;
  document.querySelector('.range').removeEventListener('submit', usedStone);
  popup('How much stone to use?', 1, 'range');

  workIt.stone = workIt.stone - sold;
  updateItem(workIt.stone, 'amount', 'Stone');
  let stoneValue = 0;
  for (let s = 1; s <= workIt.stone; s++){
    stoneValue += s * 2;
  }
  updateItem(stoneValue, 'value', 'Stone');
  workIt.labor += sold * 3;
  // popup(`Labor available: ${workIt.labor}`, 1000, 'resource');
  workIt.chooseBuild();
};
// const startUp2 = () => {
//   workIt.laborStart(4);
// };

const workIt = new Labor;

// document.querySelector('#test').addEventListener('click', startUp2);