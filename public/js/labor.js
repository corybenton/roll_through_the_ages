/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
class Labor {
  constructor() {
    // this.takeTurn = new Turn;
    // this.monName = 0;
    this.newBuild = 0;
    this.buildNeed = 0;
    this.labor = 0;
    this.cities = parseInt(document.querySelector('.cities').textContent);
  }

  laborStart() {
    popup('Using labor...', 40, 'announcement');
    this.labor = dice.labor;
    this.chooseBuild();
  }

  chooseBuild() {
    if (this.labor > 0){
      popup(`Labor available: ${this.labor}`, 1000, 'resource');
      if (this.cities < 7) {
        const cityBuild = document.createElement('option');
        const cityBuildText = document.createTextNode('New city');
        cityBuild.appendChild(cityBuildText);
        document.querySelector('#developmentsDropdown').appendChild(cityBuild);
      }
      for (let i = 0; i < 5; i++) {
        let buildNeed = parseInt(document.querySelector(`.mon${i} .needed`).textContent);
        if (buildNeed > 0) {
          const newMon = document.createElement('option');
          let nameEl = document.querySelector(`.mon${i} .build`).innerHTML;
          nameEl = document.createTextNode(nameEl);
          newMon.appendChild(nameEl);
          newMon.setAttribute('value', `mon${i}`);
          document.querySelector('#developmentsDropdown').appendChild(newMon);
        }
      }
      popup('Which object to build?', 20000, 'dropdown');
      document.querySelector('#done').addEventListener('click', buildIt);
    } else {
      this.finish();
    }
  }

  spendLabor(newBuild) {
    removeChildren();
    this.newBuild = newBuild;
    if (this.newBuild === 'New city') {
      this.buildNeed = parseInt(document.querySelector('.citiesNeed').textContent);
    } else {
    //   this.monName = document.querySelector(`.${newBuild} > .build`).textContent;
      this.buildNeed = parseInt(document.querySelector(`.${newBuild} .needed`).textContent);
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
        let score = parseInt(document.querySelector('.score').textContent);
        const alreadyBuilt = 3;//parseInt(document.querySelector(`#player2 .${this.newBuild} .needed`));
        let points = document.querySelector(`.${this.newBuild} .points`).textContent;
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
    popup('Move to developments', 5000, 'ok');
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
  document.querySelector('.range').removeEventListener('submit', useIt);
  workIt.updateLabor(spentLabor);
};

const moveToDev = (e) => {
  e.preventDefault();
  document.querySelector('#okay').removeEventListener('click', moveToDev);
  learn.devStarter();
};

// const startUp2 = () => {
//   workIt.laborStart(4);
// };

const workIt = new Labor;

// document.querySelector('#test').addEventListener('click', startUp2);