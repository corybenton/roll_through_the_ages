/* eslint-disable default-case */
const Turn = require('./turn');

const foodHandler = async () => {
  dice.chosenForSix('food');
};

const laborHandler = async () => {
  dice.chosenForSix('labor');
};

const rollDiceHandler = async () =>{
  let allKept;
  const cities = parseInt(document.querySelector(`#${gamestate} .cities`).textContent);
  for (let i = 1; i <= cities; i++) {
    allKept = document.querySelector(`#die${i}`).classList.contains('kept');
    if (!allKept) {
      break;
    }
  }
  if (dice.timesRolled === 0) {
    dice.resetDice();
  } else if (dice.timesRolled === 3 || allKept) {
    document.querySelector('#die8').classList.add('none');
    document.querySelector('#die8').removeEventListener('click', rollDiceHandler);
    for (let j = 1; j <= dice.cities; j++) {
      document.querySelector(`#die${j}`).classList.add('kept');
    }
    dice.compileDieResults();
  }
  if (dice.timesRolled <= 3 && !allKept) {
    dice.rollDice();
    dice.keepDice();
  }
};

class Dice {
  constructor (){
    this.coins = 0;
    this.labor = 0;
    this.skulls = 0;
    this.food = 0;
    this.goods = 0;
    this.timesRolled = 0;
    this.recordDie = [];
    this.sixesRolled = 0;
    this.cities = parseInt(document.querySelector(`#${gamestate} .cities`).textContent);
    this.chose;
  }

  displayDice(dieResult, dieNumber) {
    let display;
    switch (dieResult) {
    case 1:
      display = '2&#127994;&#9760;';
      break;
    case 2:
      display = '&#127994;';
      break;
    case 3:
      display = '&#128176;';
      break;
    case 4:
      display = '3&#127806;';
      break;
    case 5:
      display = '3&#9792';
      break;
    case 6:
      display = '2&#9792;/2&#127806;';
      break;
    }
    document.querySelector(`#die${dieNumber}`).innerHTML = display;
  }

  applyDieResult(dieResult, choice, player) {
    let agriculture = document.querySelector(`#${player} .agriculture .learned`);
    agriculture = agriculture.classList.contains('true');
    const masonry = document.querySelector(`#${player} .masonry .learned`);
    masonry = masonry.classList.contains('true');
    switch (dieResult) {
    case 1:
      this.skulls += 1;
      this.goods += 2;
      break;
    case 2:
      this.goods += 1;
      break;
    case 3:
      let coinage = document.querySelector(`#${player} .coinage .learned`);
      if (coinage) {
        this.coins += 12;
      } else {
        this.coins += 7;
      }
      break;
    case 4:
      this.food += 3;
      if (agriculture) {
        this.food += 1;
      }
      break;
    case 5:
      this.labor += 3;
      if (masonry) {
        this.labor += 1;
      }
      break;
    case 6:
      if (choice === 'labor') {
        this.labor += 2;
        if (masonry) {
          this.labor += 1;
        }
      } else {
        this.food += 2;
        if (agriculture) {
          this.food += 1;
        }
      }
      break;
    }
    return dice;
  }

  rollDice(){
    if (this.timesRolled < 3) {
      this.timesRolled += 1;
      const announcement = `Die Roll: ${timesRolled}`;
      Turn.popup(announcement, 40, 'announcement');
      for (let i = 1; i <= this.cities; i++) {
        const kept = document.querySelector(`#die${i}`);
        if (!kept.classList.contains('kept')) {
          const dieResult = Math.floor(Math.random() * 6) + 1;
          this.recordDie[i] = dieResult;
          dice.displayDice(dieResult, i);
          if (dieResult === 1) {
            kept.classList.add('kept');
          }
        }
      }
    }
  }

  keepDice() {
    const dieArray = document.querySelectorAll('.die');
    document.querySelector('#die8').classList.remove('none');
    for (let n = 0; n < 8; n++) {
      dieArray[n].addEventListener('click', (event) => {
        event.stopPropagation();
        const checkKept = event.target;
        if (checkKept.classList.contains('die') && !checkKept.classList.contains('kept') && !checkKept.classList.contains('done')) {
          checkKept.classList.add('kept');
        }
      });
    }
  }

  resetDice() {
    for (let l = 1; l < 9; l++) {
      const dieClass = document.querySelector(`#die${l}`).classList;
      if (l <= cities) {
        dieClass.remove('kept');
        dieClass.remove('none');
      } else {
        dieClass.add('none');
      }
      this.recordDie[l] = 0;
    }
  }

  choose() {
    document.querySelector('#yes').innerHTML = 'Food';
    document.querySelector('#no').innerHTML = 'Labor';
    document.querySelector('#yes').addEventListener('click', foodHandler);
    document.querySelector('#no').addEventListener('click', laborHandler);
    Turn.popup(`Would you like food or labor from your die? ${sixesRolled}x`, 3000, 'choice');
  }

  compileDieResults() {
    for (let k = 1; k <= cities; k++) {
      if (this.recordDie[k] === 6) {
        this.sixesRolled += 1;
        this.choose();
      } else {
        this.applyDieResult(this.recordDie[k]);
      }
    }
  }

  chosenForSix(choice){
    this.chose += 1;
    if (this.chose === this.sixesRolled) {
      popup('Would you like food or labor from your die?', 1, 'choice');
    }
    this.applyDieResult(6, choice);
  }
}

document.querySelector('#die8').addEventListener('click', rollDiceHandler);

module.exports = Dice;