/* eslint-disable default-case */
const LearnDev = require('./development');
const Dice = require('./dice');

class Turn {
  turn(player1, player2){
    this.popup(`${player1}'s turn`, 150, 'announcement');
    let dice = new Dice();
    dice.resetDice();
    dice = dice.rollDice();
    this.feedCities(player1, dice.food);
    this.resolveDisasters(player1, player2, dice.skulls);
    this.useLabor(player1, player2, dice.labor);
    this.assignGoods(dice.goods);
    let learn = new LearnDev;
    learn.devStarter(dice.coins);
    this.buyDevelopment(player1, dice.coins);
    this.cleanUp(player1);
  }

  feedCities(gamestate, diceFood) {
    this.popup('Feeding cities...', 200, 'announcement');
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
    this.popup('Resolving disasters...', 200, 'announcement');
    let irrigation = document.querySelector(`#${gamestate} .irrigation .learned`);
    irrigation = irrigation.classList.contains('true');
    let medicine = document.querySelector(`#${othergamestate} .medicine .learned`);
    medicine = medicine.classList.contains('true');
    let laborForGreatWall = parseInt(document.querySelector(`#${gamestate} .great_wall .needed`).textContent);
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
          updateItem(0, 'amount', i, revolt);
          updateItem(0, 'value', i, revolt);
        }
      }
    }
    updateItem(disasters, 'disasters');
  }

  useLabor(gamestate, player2, labor) {
    this.popup('Using labor...', 200, 'announcement');
    this.popup(`Labor available: ${labor}`, 1000, 'resource');
    let engineering = document.querySelector(`#${gamestate} .engineering .learned`);
    engineering = engineering.classList.contains('true');
    let stone = parseInt(document.querySelector(`#${gamestate} .amount .stone`).textContent);
    let decision;
    if (engineering && stone > 0) {

      document.querySelector('.yes').innerHTML = 'Yes';
      document.querySelector('.no').innerHTML = 'No';
      this.popup('Would you like spend stone for labor?', 1000, 'choice');
      document.querySelector('.choice').addEventListener('submit', (event) => {
        event.stopPropagation();
        decision = event.target.textContent;
      });
      if (decision === 'Yes') {
        document.querySelector('.rangeFinder').setAttribute('max', stone);
        document.querySelector('.bar').innerHTML = stone;
        this.popup('How much stone to spend?', 1000, 'range');
        document.querySelector('.range').addEventListener('submit', (event) => {
          event.preventDefault();
          event.stopPropagation();
          let spent = parseInt(document.querySelector('.rangeFinder').value);
          this.popup(`How many laborers to use on the ${whichName}?`, 1, 'range');
          labor += spent * 3;
        });
      }
    }
    while (labor > 0) {
      this.popup(`Labor available: ${labor}`, 1000, 'resource');
      let whichName;
      document.querySelectorAll('.build').addEventListener('click', (event) => {
        event.stopPropagation();
        which = event.target;
        if (which.classList.contains('build')) {
          whichName = document.querySelector(which).textContent;
          if (whichName.slice(0, 6) === 'Cities') {
            whichName = 'cities';
          }
        }
      });

      let needed;
      if (whichName === 'cities') {
        needed = parseInt(document.querySelector(`.citiesNeed.${whichName}#${gamestate}`).textContent);
      } else {
        needed = parseInt(document.querySelector(`.needed.${whichName}#${gamestate}`).textContent);
      }
      let max;
      if (needed > labor) {
        max = labor;
      } else {
        max = needed;
      }
      document.querySelector('.rangeFinder').setAttribute('max', max);
      document.querySelector('.bar').innerHTML = max;
      this.popup(`How many laborers to use on the ${whichName}?`, 1000, 'range');
      let howMany;
      document.querySelector('.range').addEventListener('submit', (event) => {
        event.preventDefault();
        event.stopPropagation();
        howMany = document.querySelector('.rangeFinder').value;
        this.popup(`How many laborers to use on the ${whichName}?`, 1, 'range');
      });

      if (whichName === 'cities') {
        let cities = parseInt(document.querySelector(`.cities#${gamestate}`).textContent);
        if (howMany === needed){
          if (cities < 7) {
            cities = cities + 1;
            needed = cities;
          } else {
            needed = 0;
          }
        } else {
          needed = needed - howMany;
        }
        labor = labor - howMany;

        updateItem(cities, 'cities');
        updateItem(needed, 'citiesNeed');
      } else {
        if (howMany === needed) {
          let score = parseInt(document.querySelector(`.score#${gamestate}`).textContent);
          let alreadyBuilt = document.querySelector(`.needed.${whichName}#${player2}`).textContent;
          let points = document.querySelector(`.points#${gamestate}`).textContent;
          if (alreadyBuilt === '0') {
            points = parseInt(points.slice(-1));
          } else {
            points = parseInt(points.slice(0, points.length - 2));
          }
          score = score + points;
        }
        needed = needed - howMany;

        labor = labor - howMany;

        updateItem(score, 'score');
        updateItem(needed, 'needed', whichName);
      }
    }
    this.popup(`Labor available: ${labor}`, 1, 'resource');
  }

  assignGoods(gamestate, goods) {
    this.popup('Assigning goods...', 200, 'announcement');
    let goodType = 1;
    let quarrying = document.querySelector(`#${gamestate} .learned .quarrying`);
    quarrying = quarrying.classList.contains('true');
    for (let i = 0; i < goods; i++) {
      let goodTypeAmt = parseInt(document.querySelector(`#${gamestate} .${goodType} .amount`).textContent);
      if (goodTypeAmt < 9 - goodType) {
        goodTypeAmt += 1;
      }
      if (goodType = 2 && quarrying && goodTypeAmt < 9 - goodType) {
        goodTypeAmt += 1;
      }

      let goodTypeVal = parseInt(document.querySelector(`#${gamestate} .${goodType} .value`).textContent);
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

  cleanup(player) {
    let totalAmount, goodAmount;
    let caravans = document.querySelector(`.learned.caravans#${player}`);
    caravans = caravans.classList.contains('true');

    if (!caravans) {
      for (let i = 1; i < 6; i++){
        goodAmount = parseInt(document.querySelector(`.value.${i}#${player}`));
        totalAmount += goodAmount;
      }

      while (totalAmount > 6) {
        const message = `You have ${totalAmount} resources.  You can only keep 6`;
        this.popup(message, 1000, 'resource');
        document.querySelectorAll('.good').addEventListener('click', (event) => {
          event.stopPropagation();
          let goodType = event.target;
          if (goodType.classList.contains('good')) {
            goodType = document.querySelector(goodType).classList;
            goodType = parseInt(goodType[1]);
          }
        });

        goodAmount = parseInt(document.querySelector(`.amount.${goodType}#${player}`).textContent);
        goodAmount = goodAmount - 1;
        totalAmount = totalAmount - 1;

        let goodValue = parseInt(document.querySelector(`.value.${goodType}#${player}`).textContent);
        goodValue = goodValue - (goodType * goodAmount);

        updateItem(goodValue, 'value', goodType);
        updateItem(goodAmount, 'amount', goodType);
      }
    }
  }

  async updateItem(value, place, category, player) {
    try {
      const response = await fetch('/game', {
        method: 'PUT',
        headers: {
          'Content-type': 'application.json; charset=UTF-8'
        },
        body: JSON.stringify({
          place: place,
          value: value,
          category: category,
          player: player
        })
      });
      console.log(response);
    } catch(err) {
      console.log(err);
    }
  }

  popup(message, time, type) {
    const classGet = document.querySelector(`.${type}`);
    classGet.classList.remove('none');
    document.querySelector(`.${type} .message.`).innerHTML = message;
    let timeLeft = time;
    const timeInterval = setInterval( () => {
      timeLeft--;
      if (timeLeft === 0) {
        clearInterval(timeInterval);
        classGet.classList.add('none');
      }
    }, time);
  }
}

module.exports = Turn;