/* eslint-disable default-case */
const Dice = require('./dice');
const Game = require('./game');

class Turn {
  turn(player1, player2){
    const dice = this.rollDice(player1);
    this.feedCities(player1, dice.food);
    this.resolveDisasters(player1, player2, dice.skulls);
    this.useLabor(player1, player2, dice.labor);
    this.assignGoods(dice.goods);
    this.buyDevelopment(player1, dice.coins);
    this.cleanUp(player1);
  }

  rollDice(gamestate) {
    let diceToRoll = parseInt(document.querySelector(`.cities#${gamestate}`).textContent);
    let recordDie = [];

    //reset dice information
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
        //announce `Die Roll: ${j};
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
    if (leadership) {
      //prompt would you like to reroll a die
      let reroll = addEventListener();
      let rerollResult = Math.floor(Math.random() * 6);
      recordDie[reroll] = rerollResult;
      dice.displayDice(rerollResult, reroll);
    }

    let dieState, choice;
    for (let k = 1; k <= diceToRoll; k++) {
      if (recordDie[k] === 6) {
        //popup food or labor?
        choice = 1;//placeholder
      }
      dieState = dice.applyDieResult(recordDie[k], dice, choice);
    }
    return dieState;
  }

  feedCities(gamestate, diceFood) {
    //announce feeding cities;
    let food = parseInt(document.querySelector(`.amount.food#${gamestate}`).textContent);
    food = food + diceFood;
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
    //annouce resolving disasters;
    let irrigation = document.querySelector(`.learned.irrigation#${gamestate}`);
    irrigation = irrigation.classList.contains('true');
    let medicine = document.querySelector(`.learned.medicine#${othergamestate}`);
    medicine = medicine.classList.contains('true');
    let laborForGreatWall = parseInt(document.querySelector(`.needed.great_wall#${gamestate}`).textContent);
    let religion = document.querySelector(`.learned.religion${gamestate}`);
    religion = religion.classList.contains('true');
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
      } else {
        revolt = othergamestate;
      }

      for (let i = 1; i < 6; i++) {
        updateItem(0, 'amount', i, revolt);
        updateItem(0, 'value', i, revolt);
      }
    }
    updateItem(disasters, 'disasters');
  }

  useLabor(gamestate, player2, labor) {
    //announce using labor;
    let engineering = document.querySelector(`.learned.engineering#${gamestate}`);
    engineering = engineering.classList.contains('true');
    let stone = parseInt(document.querySelector(`.amount.stone#${gamestate}`).textContent);
    if (engineering && stone > 0) {
      //prompt would you like to spend stone for more labor
      labor += spent * 3;
    }
    while (labor > 0) {
      //announce you have labor to spend
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

      //box with incrementer max of needed or labor which ever is lower
      const howMany = prompt(`How many to use on the ${whichName}?`);
      if (whichName === 'cities') {
        let cities = parseInt(document.querySelector(`.cities#${gamestate}`).textContent);
        let needed = parseInt(document.querySelector(`.citiesNeed#${whichName}#${gamestate}`).textContent);
        if (howMany === needed){
          cities = cities + 1;
          needed = cities;
        } else {
          needed = needed - howMany;
        }
        labor = labor - howMany;

        updateItem(cities, 'cities');
        updateItem(needed, 'citiesNeed');
      } else {
        let needed = parseInt(document.querySelector(`.needed.${whichName}#${gamestate}`).textContent);
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
  }

  assignGoods(gamestate, goods) {
    let goodType = 1;
    let quarrying = document.querySelector(`.learned.quarrying#${gamestate}`);
    quarrying = quarrying.classList.contains('true');
    for (let i = 0; i < goods; i++) {
      let goodTypeAmt = parseInt(document.querySelector(`.amount.${goodType}#${gamestate}`).textContent);
      goodTypeAmt += 1;
      if (goodType = 2 && quarrying) {
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
    //announce buying developments
    totalValue = Game.getGoodsValue(gamestate);

    //warn of potential losing goods
    prompt(`Buy a development? You have ${coins + totalValue} to spend?`);

    let granaries = document.querySelector(`.learned.granaries#${gamestate}`);
    granaries = granaries.classList.contains('true');
    let food = parseInt(document.querySelector(`.value.food#${gamestate}`).textContent);
    if (granaries && food > 0) {
      //prompt would you like to sell food for granaries
      if (sell) {
        //prompt how much to sell
        food = food - sold;
        coins += sold * 4;
        updateItem(food, 'food', 'amount');
        updateItem(food, 'food', 'value');
      }
      //prompt you now have newvalue to spend
    }

    let whichName;
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
        //announce you don't have enough money
      } else {
        cost = cost - coins;
        while (goods < cost) {
          //prompt amount needed
          //prompt which goods to use
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
}

module.exports = Turn;