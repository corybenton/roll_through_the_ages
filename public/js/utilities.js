//Accessing usersGameStateId through <script> in game.handlebars
const UsersGameStateId = usersGameStateId;

/* eslint-disable no-unused-vars */
function popup(message, time, type) {
  const classGet = document.querySelector(`.${type}`);
  classGet.classList.remove('none');
  document.querySelector(`.${type} .message`).innerHTML = message;
  let timeLeft = time;
  const timeInterval = setInterval( () => {
    timeLeft--;
    if (timeLeft === 0) {
      clearInterval(timeInterval);
      classGet.classList.add('none');
    }
  }, time);
}

function removeChildren() {
  const erase = document.querySelector('#developmentsDropdown');
  while (erase.hasChildNodes()){
    erase.removeChild(erase.firstChild);
  }
}

function getGoodsValue(player) {
  let totalVal = 0;
  let goodVal;
  if (!player) {
    player = newTurn.currentPlayer;
  }
  for (let i = 1; i < 6; i++) {
    goodVal = parseInt(document.querySelector(`#${player} .good${i} .value`).textContent);
    totalVal += goodVal;
  }
  return totalVal;
}

async function updateItem(value, place, category, player) {
  try {
    const response = await fetch(`/gameState/${UsersGameStateId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        { value, place, category, player },
      )
    });
    console.log('Here.');
    let gamestate;
    if (!player) {
      gamestate = newTurn.currentPlayer;
    } else {
      gamestate = player;
    }
    if (value === true) {
      const addLearn = document.querySelector(`#${gamestate} .${category} .learn`);
      addLearn.classList.add('learned');
      addLearn.innerHTML = '&#9745';
    }else if (category){
    //   category = category.replace(' ', '_');
      document.querySelector(`#${gamestate} .${category} .${place}`).innerHTML = value;
    } else {
      document.querySelector(`#${gamestate} .${place}`).innerHTML = value;
    }
    await console.log(response);
  } catch(err) {
    console.log(err);
  }
}