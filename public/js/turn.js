/* eslint-disable default-case */
const Dice = require('./dice');
const Game = require('./game');

class Turn {
  turn(player1, player2){
    this.popup(`${player1}'s turn`, 150, 'announcement');
    const dice = this.rollDice(player1);
    this.feedCities(player1, dice.food);
    this.resolveDisasters(player1, player2, dice.skulls);
    this.useLabor(player1, player2, dice.labor);
    this.assignGoods(dice.goods);
    this.buyDevelopment(player1, dice.coins);
    this.cleanUp(player1);
  }

  rollDice(gamestate) {
    let cities = parseInt(document.querySelector(`.cities#${gamestate}`).textContent);
    let diceToRoll = cities;
    let recordDie = [];

    for (let l = 1; l < 9; l++) {
      if (l <= diceToRoll) {
        const dieClass = document.querySelector(`#${l}`);
        dieClass.classList.remove('kept');
        dieClass.classList.remove('none');
      } else {
        dieClass.classList.add('none');
      }
      recordDie[l] = 0;
    }

    let dice = new Dice();

    for (let j = 1; j <= 3; j++) {
      if (diceToRoll > 0) {
        const announcement = `Die Roll: ${j}`;
        this.popup(announcement, 150, 'announcement');
        let diceKept = 0;
        for (let i = 1; i <= diceToRoll; i++) {
          const kept = document.querySelector(`#${i}`);
          if (!kept.classList.contains('kept')) {
            let dieResult = Math.floor(Math.random() * 6);
            recordDie[i] = dieResult;
            dice.displayDice(dieResult, i);
            if (dieResult === 1) {
              kept.classList.add('kept');
              diceKept += 1;
            }
          }
        }
        let checkKept;
        while (checkKept !== 'Done' || diceKept !== diceToRoll){
          const doneAvailable = document.querySelector('#8');
          doneAvailable.classList.remove('none');
          document.querySelectorAll('.die').addEventListener('click', async (event) => {
            event.stopPropagation();
            checkKept = event.target;
            if (checkKept.classList.contains('die') && !checkKept.classList.contains('kept')) {
              checkKept.classList.add('kept');
              diceKept += 1;
            } else if (checkKept.classList.contains('done')){
              checkKept = 'Done';
            }
          });
        }
        diceToRoll = diceToRoll - diceKept;
      }
    }

    let leadership = document.querySelector(`.learned.leadership#${gamestate}`);
    leadership = leadership.classList.contains('true');
    let decision;
    if (leadership) {
      document.querySelector('.yes').innerHTML = 'Yes';
      document.querySelector('.no').innerHTML = 'No';
      this.popup('Would you like to reroll a die?', 1000, 'choice');
      document.querySelector('.choice').addEventListener('submit', (event) => {
        event.stopPropagation();
        decision = event.target.textContent;
      });
      if (decision === 'Yes'){
        this.popup('Choose which die to reroll?', 200, 'announcement');
        let reroll, dieValue;
        while (reroll !== 1) {
          document.querySelectorAll('.die').addEventListener('click', (event) => {
            reroll = event.target;
            reroll = reroll.getAttribute('id');
          });
          let rerollResult = Math.floor(Math.random() * 6);
          recordDie[dieValue] = rerollResult;
          dice.displayDice(rerollResult, dieValue);
        }
      }
    }

    let dieState, choice;
    for (let k = 1; k <= cities; k++) {
      if (recordDie[k] === 6) {
        document.querySelector('.yes').innerHTML = 'Food';
        document.querySelector('.no').innerHTML = 'Labor';
        this.popup('Would you like food or labor from your die?', 1000, 'announcement');
        document.querySelector('.choice').addEventListener('submit', (event) => {
          event.stopPropagation();
          choice = event.target.textContent;
          if (choice === 'Food') {
            document.querySelector(`#${k}`).innerHTML = '2&#127806;';
          } else {
            document.querySelector(`#${k}`).innerHTML = '2&#9792;';
          }
        });
      }
      this.popup('Would you like food or labor from your die?', 1, 'announcement');
      dieState = dice.applyDieResult(recordDie[k], dice, choice);
    }
    return dieState;
  }

  feedCities(gamestate, diceFood) {
    this.popup('Feeding cities...', 200, 'announcement');
    let food = parseInt(document.querySelector(`.amount.food#${gamestate}`).textContent);
    food = food + diceFood;
    if (food > 15) {
      food = 15;
    }
    const cities = document.querySelector(`.cities#${gamestate}`).textContent;
    let disasters = parseInt(document.querySelector(`.disasters#${gamestate}`).textContent);
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
    let irrigation = document.querySelector(`.learned.irrigation#${gamestate}`);
    irrigation = irrigation.classList.contains('true');
    let medicine = document.querySelector(`.learned.medicine#${othergamestate}`);
    medicine = medicine.classList.contains('true');
    let laborForGreatWall = parseInt(document.querySelector(`.needed.great_wall#${gamestate}`).textContent);
    let religion = document.querySelector(`.learned.religion${gamestate}`);
    religion = religion.classList.contains('true');
    let otherreligion = document.querySelector(`.learned.religion${othergamestate}`);
    otherreligion = religion.classList.contains('true');
    let disasters = parseInt(document.querySelector(`.disasters#${gamestate}`).textContent);
    let otherDisasters = parseInt(document.querySelector(`.disasters#${othergamestate}`).textContent);
    let revolt;
    if (skulls === 2 && !irrigation) {
      disasters = disasters + 2;
    } else if (skulls === 3 && !medicine){
      otherDisasters = otherDisasters + 3;
      updateItem(otherDisasters, 'disasters', '', othergamestate);
    } else if (skulls === 4 && laborForGreatWall === 0){
      disasters = disasters + 4;
    } else if (skulls <= 5 ){
      if (!religion) {
        revolt = gamestate;
      } else if (!otherreligion){
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
    let engineering = document.querySelector(`.learned.engineering#${gamestate}`);
    engineering = engineering.classList.contains('true');
    let stone = parseInt(document.querySelector(`.amount.stone#${gamestate}`).textContent);
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
    let quarrying = document.querySelector(`.learned.quarrying#${gamestate}`);
    quarrying = quarrying.classList.contains('true');
    for (let i = 0; i < goods; i++) {
      let goodTypeAmt = parseInt(document.querySelector(`.amount.${goodType}#${gamestate}`).textContent);
      if (goodTypeAmt < 9 - goodType) {
        goodTypeAmt += 1;
      }
      if (goodType = 2 && quarrying && goodTypeAmt < 9 - goodType) {
        goodTypeAmt += 1;
      }

      let goodTypeVal = parseInt(document.querySelector(`.value.${goodType}#${gamestate}`).textContent);
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


  buyDevelopment(gamestate, coins) {
    this.popup('Buying developments...', 200, 'announcement');
    totalValue = Game.getGoodsValue(gamestate);
    this.popup(`Money available: ${coins + totalValue}`, 1000, 'resource');

    let granaries = document.querySelector(`.learned.granaries#${gamestate}`);
    granaries = granaries.classList.contains('true');
    let food = parseInt(document.querySelector(`.value.food#${gamestate}`).textContent);
    if (granaries && food > 0) {
      let sell;
      document.querySelector('.yes').innerHTML = 'Yes';
      document.querySelector('.no').innerHTML = 'No';
      this.popup('Would you like sell food for coins?', 1000, 'choice');
      document.querySelector('.choice').addEventListener('submit', (event) => {
        event.stopPropagation();
        sell = event.target.textContent;
        this.popup('Would you like sell food for coins?', 1, 'choice');
      });
      let sold;
      if (sell === 'Yes') {
        document.querySelector('.rangeFinder').setAttribute('max', food);
        document.querySelector('.bar').innerHTML = food;
        this.popup('How much food to sell?', 1000, 'range');
        document.querySelector('.range').addEventListener('submit', (event) => {
          event.preventDefault();
          event.stopPropagation();
          sold = document.querySelector('.rangeFinder').value;
          this.popup('How much food to sell?', 1, 'range');
        });
        food = food - sold;
        coins += sold * 4;
        updateItem(food, 'food', 'amount');
        updateItem(food, 'food', 'value');
      }
    }

    this.popup(`Money available: ${coins + totalValue}`, 1000, 'resource');
    let whichName;
    document.querySelector('devButt').classList.remove('none');
    document.querySelectorAll('.development').addEventListener('click', (event) => {
      event.stopPropagation();
      which = event.target;
      if (which.classList.contains('development')) {
        whichName = document.querySelector(which).textContent;
      }
    });

    let goods = 0;
    let goodType, cost, goodValue;
    if (whichName !== 'No development') {
      cost = parseInt(document.querySelector(`.cost.${whichName}#${gamestate}`).textContent);
      if (cost > totalValue + coins) {
        this.popup('Not enough for that', 150, 'announcement');
      } else {
        cost = cost - coins;
        while (goods < cost) {
          this.popup(`${cost} still needed. Choose resource to sell.`, 1000, 'resource');

          document.querySelectorAll('.good').addEventListener('click', (event) => {
            event.stopPropagation();
            goodType = event.target;
            if (goodType.classList.contains('good')) {
              goodType = document.querySelector(goodType).textContent;
            }
          });

          goodValue = parseInt(document.querySelector(`.value.${goodType}#${gamestate}`).textContent);
          goods += goodValue;

          updateItem(0, goodType, 'amount');
          updateItem(0, goodType, 'value');
        }
        let score = parseInt(document.querySelector(`.score#${player}`).textContent);
        let points = parseInt(document.querySelector(`.points.${goodType}#${gamestate}`));
        score += points;

        updateItem(score, 'score');
        updateItem(true, which, 'learned');
      }
    }
    document.querySelector('devButt').classList.add('none');
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
    const popupGet = document.querySelector(`.message.${type}`);
    popupGet.innerHTML(message);
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