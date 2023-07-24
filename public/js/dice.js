/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable default-case */

const foodHandler = async () => {
  dice.chosenForSix('food');
};

const laborHandler = async () => {
  dice.chosenForSix('labor');
};

const rollDiceHandler = async () =>{
  dice.diceHandler();
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
    this.cities = 0;
    this.chose = 0;
  }

  diceHandler(){
    let allKept;
    this.cities = parseInt(document.querySelector('.cities').textContent);
    for (let i = 1; i <= this.cities; i++) {
      allKept = document.querySelector(`#die${i}`).classList.contains('kept');
      if (!allKept) {
        break;
      }
    }
    if (this.timesRolled === 0) {
      this.resetDice(this.cities);
    } else if (this.timesRolled === 3 || allKept) {
      document.querySelector('#die8').classList.add('none');
      document.querySelector('#die8').removeEventListener('click', rollDiceHandler);
      for (let j = 1; j <= this.cities; j++) {
        document.querySelector(`#die${j}`).classList.add('kept');
      }
      this.compileDieResults();
      popup('Moving to feeding cities.', 500, 'ok');
    }
    if (this.timesRolled <= 3 && !allKept) {
      this.rollDice();
      this.keepDice();
    }
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

  applyDieResult(dieResult, choice) {
    const agriculture = false;//document.querySelector(`#${player} .agriculture .learned`);
    //agriculture = agriculture.classList.contains('true');
    const masonry = false;//document.querySelector(`#${player} .masonry .learned`);
    //masonry = masonry.classList.contains('true');
    switch (dieResult) {
    case 1:
      this.skulls += 1;
      this.goods += 2;
      break;
    case 2:
      this.goods += 1;
      break;
    case 3:
      let coinage = document.querySelector('.coinage .learned');
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
      const announcement = `Die Roll: ${this.timesRolled}`;
      popup(announcement, 40, 'announcement');
      for (let i = 1; i <= this.cities; i++) {
        const kept = document.querySelector(`#die${i}`);
        if (!kept.classList.contains('kept')) {
          const dieResult = Math.floor(Math.random() * 6) + 1;
          this.recordDie[i] = dieResult;
          this.displayDice(dieResult, i);
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
        // let parseDie = checkKept.getAttribute('id');
        // parseDie = parseDie.slice(-1);
        if (checkKept.classList.contains('die') && !checkKept.classList.contains('kept') && !checkKept.classList.contains('done')) {
          checkKept.classList.add('kept');
        } //else if (checkKept.classList.contains('die') && this.recordDie[parseDie] !== 1){
        //checkKept.classList.remove('kept');
        //}
      });
    }
  }

  resetDice(cities) {
    this.cities = cities;
    for (let l = 1; l < 9; l++) {
      const dieClass = document.querySelector(`#die${l}`).classList;
      if (l <= this.cities) {
        dieClass.remove('kept');
        dieClass.remove('none');
      } else {
        dieClass.add('none');
      }
      this.recordDie[l] = 0;
    }
  }

  choose() {
    document.querySelector('.yes').innerHTML = 'Food';
    document.querySelector('.no').innerHTML = 'Labor';
    document.querySelector('.yes').addEventListener('click', foodHandler);
    document.querySelector('.no').addEventListener('click', laborHandler);
    popup(`Would you like food or labor from your die? ${this.sixesRolled}x`, 3000, 'choice');
  }

  compileDieResults() {
    for (let k = 1; k <= this.cities; k++) {
      if (this.recordDie[k] === 6) {
        this.sixesRolled += 1;
        this.choose();
      } else {
        this.applyDieResult(this.recordDie[k]);
      }
    }
  }

  chosenForSix(choice) {
    this.chose += 1;
    if (this.chose === this.sixesRolled) {
      popup('Would you like food or labor from your die?', 1, 'choice');
    } else {
      popup(`Would you like food or labor from your die? ${this.sixesRolled - this.chose}x`, 3000, 'choice');
    }
    let diceCheck = 1;
    for (let i = 1; i <= this.cities; i++) {
      if (this.recordDie[i] === 6) {
        if (diceCheck === this.chose) {
          if (choice === 'food') {
            document.querySelector(`#die${i}`).innerHTML = '2&#127806;';
            this.applyDieResult(6, choice);
            break;
          } else if (choice === 'labor') {
            document.querySelector(`#die${i}`).innerHTML = '2&#9792;';
            this.applyDieResult(6, choice);
            break;
          }
        } else {
          diceCheck += 1;
        }
      }
    }
  }
}

let dice = new Dice;
document.querySelector('#die8').addEventListener('click', rollDiceHandler);
// document.querySelector('#test').addEventListener('click', rollDiceHandler);

// const dice = new Dice;