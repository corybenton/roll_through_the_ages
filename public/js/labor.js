/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
class Labor {
  constructor() {
    // this.takeTurn = new Turn;
    this.newBuild = 0;
    this.buildNeed = 0;
    this.labor = 0;
    this.cities = 3;//parseInt(document.querySelector('.cities').textContent);
  }

  laborStart(labor) {
    popup('Using labor...', 40, 'announcement');
    popup(`Labor available: ${labor}`, 1000, 'resource');
    this.labor = labor;
    this.chooseBuild();
  }

  chooseBuild() {
    if (this.cities < 7) {
      const cityBuild = document.createElement('option');
      const cityBuildText = document.createTextNode('New city');
      cityBuild.appendChild(cityBuildText);
      document.querySelector('#developmentsDropdown').appendChild(cityBuild);
    }
    for (let i = 0; i < 5; i++) {
      const buildNeed = parseInt(document.querySelector(`.mon${i} .needed`).textContent);
      if (buildNeed > 0) {
        const newMon = document.createElement('option');
        let monName = document.querySelector(`.mon${i} .build`).innerHTML;
        monName = document.createTextNode(monName);
        newMon.appendChild(monName);
        document.querySelector('#developmentsDropdown').appendChild(newMon);
      }
      break;
    }
    popup('Which object to build?', 20000, 'dropdown');
    document.querySelector('#done').addEventListener('click', buildIt);
  }

  spendLabor(newBuild) {
    removeChildren();
    this.newBuild = newBuild;
    if (this.newBuild === 'New city') {
      this.buildNeed = 3;//parseInt(document.querySelector('.citiesNeed').textContent);
    } else {
      const buildUnderscore = this.newBuild.replace(' ', '_');
      this.buildNeed = parseInt(document.querySelector(`.${buildUnderscore} .needed`).textContent);
    }
    let maxUsage;
    if (this.buildNeed < this.labor) {
      maxUsage = this.buildNeed;
    } else {
      maxUsage = this.labor;
    }
    document.querySelector('.rangeFinder').setAttribute('max', maxUsage);
    document.querySelector('.bar').innerHTML = maxUsage;
    document.querySelector('.range').addEventListener('submit', useIt);
    popup('How much labor to use?', 20000, 'range');
  }

  updateLabor(spentLabor) {
    removeChildren();
    this.buildNeed = this.buildNeed - spentLabor;
    if (this.buildNeed === 0) {
      if (this.newBuild === 'New city') {
        this.cities += 1;
        updateItem(this.cities, 'cities');
        updateItem(this.cities, 'citiesNeed');
      } else {
        const score = 0;//parseInt(document.querySelector('.score').textContent);
        const alreadyBuilt = 0;//parseInt(document.querySelector(`#player2 .${this.newBuild} .needed`));
        let points = document.querySelector(`.${this.newBuild} .points`).textContent;
        if (alreadyBuilt === 0) {
          points = parseInt(points.slice(-1));
        } else {
          points = parseInt(points.slice(0, points.length - 2));
        }
        score = score + points;
        console.log(score);
        updateItem(this.buildNeed, 'needed', this.newBuild);
      }
    }
    this.labor = this.labor - spentLabor;
    this.secondBuild();
  }
}
const buildIt = () => {
  const newBuild = document.querySelector('#developmentsDropdown').value;
  document.querySelector('#done').removeEventListener('submit', buildIt);
  workIt.spendLabor(newBuild);
};

const useIt = () => {
  const spentLabor = document.querySelector('.rangeFinder').value;
  document.querySelector('.range').removeEventListener('submit', useIt);
  workIt.updateLabor(spentLabor);
};

// const startUp2 = () => {
//   workIt.laborStart(4);
// };

// const workIt = new Labor;

// document.querySelector('#test').addEventListener('click', startUp2);