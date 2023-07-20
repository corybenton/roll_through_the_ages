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
    for (let l = 1; l < 8; l++) {
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
        for (let i = 1; i <= diceToRoll; i++) {
          const kept = document.querySelector(`#${i}`);
          if (!kept.classList.contains('kept')) {
            let dieResult = Math.floor(Math.random() * 6);
            recordDie[i] = dieResult;
            dice.displayDice(dieResult, i);
            if (dieResult === 1) {
              kept.classList.add('kept');
            }
          }
        }
        while (checkKept !== 'Done' || dieKept !== diceToRoll){
          let checkKept = addEventListener();
          //validate
          checkKept = document.querySelector(`#${checkKept}`);
          if (!checkKept.classList.contains('kept')) {
            checkKept.classList.add('kept');
          }
        }
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
    //update gamestate
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
    } else if (skulls === 4 && laborForGreatWall === 0){
      disasters = disasters + 4;
    } else if (skulls <= 5 ){
      if (!religion) {
        revolt = gamestate;
      } else {
        revolt = othergamestate;
      }
    }
    for (let i = 1; i < 6; i++) {
      document.querySelector(`.amount.${i}#${revolt}`).innerHTML = 0;
      document.querySelector(`.value.${i}#${revolt}`).innerHTML = 0;
    }
    document.querySelector(`.disasters#${othergamestate}`).innerHTML = otherDisasters;
    document.querySelector(`.disasters#${gamestate}`).innerHTML = disasters;
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
      const which = addEventListener();//wait for click on building place (city or monument)
      //verify that the thing on is something that can be built
      const whichName = document.querySelector(`.${which}#${gamestate}`.textContent);
      //box with incrementer max of needed or labor which ever is lower
      const howMany = prompt(`How many to use on the ${whichName}?`);
      let needed = parseInt(document.querySelector(`.needed#${whichName}#${gamestate}`).textContent);
      if (whichName === 'cities') {
        let cities = parseInt(document.querySelector(`.cities#${gamestate}`).textContent);
        if (howMany === needed){
          cities = cities + 1;
          needed = cities;
        } else {
          needed = needed - howMany;
        }
        labor = labor - howMany;
        //update citiesNeed and cities if changed
      } else {
        if (howMany === needed){
          let score = parseInt(document.querySelector(`.score#${gamestate}`).textContent);
          let alreadyBuilt = document.querySelector(`.needed.${whichName}#${player2}`).textContent;
          let points = document.querySelector(`.points#${which}`).textContent;
          if (alreadyBuilt === '0') {
            points = parseInt(points.slice(-1));
          } else {
            points = parseInt(points.slice(1, points.length - 2));
          }
          score = score + points;
        } else {
          needed = needed - howMany;
        }
        labor = labor - howMany;
        //update monuments built and score if changed
      }
    }
  }

  assignGoods(gamestate, goods) {
    let goodType = 1;
    let modifier = 0;
    let quarrying = document.querySelector(`.learned.quarrying#${gamestate}`);
    quarrying = quarrying.classList.contains('true');
    for (let i = 0; i < goods; i++) {
      let goodTypeAmt = parseInt(document.querySelector(`.amount.${goodType}#${gamestate}`).textContent);
      goodTypeAmt += 1;
      if (goodTypeAmt = 2 && quarrying) {
        goodTypeAmt += 1;
      }

      let goodTypeVal = parseInt(document.querySelector(`.value.${goodType}#${gamestate}`).textContent);
      modifier = (i + 1) % 5;
      goodTypeVal = goodTypeVal + (modifier * goodTypeAmt);

      document.querySelector(`.amount.${goodType}#${gamestate}`).innerHTML = goodTypeAmt;
      document.querySelector(`.value.${goodType}#${gamestate}`).innerHTML = goodTypeVal;

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
      }
      coins += sold * 4;
      //prompt you now have newvalue to spend
    }

    let which = addEventListener();
    //validate which

    which = document.querySelector(`.${which}#${gamestate}`);
    let goods = 0;
    let goodType, cost, goodValue;
    if (which !== 'No development') {
      cost = parseInt(document.querySelector(`.cost.${which}#${gamestate}`).textContent);
      if (cost > totalValue + coins) {
        //announce you don't have enough money
      } else {
        cost = cost - coins;
        while (goods < cost) {
          //prompt amount needed
          //prompt which goods to use
          goodType = addEventListener();
          //validate goodType
          goodValue = parseInt(document.querySelector(`.value.${goodType}#${gamestate}`).textContent);
          goods += goodValue;

          document.querySelector(`.amount.${goodType}#${gamestate}`).innerHTML = 0;
          document.querySelector(`.value.${goodType}#${gamestate}`).innerHTML = 0;
        }
        document.querySelector(`.learned.${which}#${player}`).className = 'true';
        let score = parseInt(document.querySelector(`.score#${player}`).textContent);
        let points = parseInt(document.querySelector(`.points.${which}#${gamestate}`));
        score += points;
        document.querySelector(`.score#${player}`).innerHTML = score;
      }
    }
  }

  cleanup(player) {
    let totalAmount, goodAmount;
    let caravans = document.querySelector(`.learned.caravans#${player}`);
    caravans = caravans.classList.contains('true');

    if (!caravans) {
      for (let i = 1; i < 6; i++){
        for (let i = 1; i < 6; i++) {
          goodAmount = parseInt(document.querySelector(`.value.${i}#${player}`));
          totalAmount += goodAmount;
        }
      }

      while (totalAmount > 6) {
        goodType = addEventListener();
        //validate goodType

        goodAmount = parseInt(document.querySelector(`.amount.${goodType}#${player}`).textContent);
        goodAmount = goodAmount - 1;

        let goodValue = parseInt(document.querySelector(`.value.${goodType}#${player}`).textContent);
        goodValue = goodValue - (goodType * goodAmount);

        document.querySelector(`.value.${goodType}#${player}`).innerHTML = goodValue;
        document.querySelector(`.amount.${goodType}#${player}`).innerHTML = goodAmount;
      }
    }
    //update amount and value
  }

  async updateItem(value, place, category) {
    try {
      const response = await fetch('/game', {
        method: 'PUT',
        headers: {
          'Content-type': 'application.json; charset=UTF-8'
        },
        body: JSON.stringify({
          place: place,
          value: value,
          category: category
        })
      });
      console.log(response);
    } catch(err) {
      console.log(err);
    }
  }
}

module.exports = Turn;