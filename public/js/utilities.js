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
  let totalVal, goodVal;
  for (let i = 1; i < 6; i++) {
    goodVal = parseInt(document.querySelector(`#${player} .good{i} .value`));
    totalVal += goodVal;
  }
  return totalVal;
}

async function updateItem(value, place, category, player) {
  try {
    const response = await fetch('/game', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        { place, value, category, player },
      )
    });
    if (category){
      category = category.replace(' ', '_');
      document.querySelector(`.${category} .${place}`).innerHTML = value;
    } else {
      document.querySelector(`.${place}`).innerHTML = value;
    }
    await console.log(response);
  } catch(err) {
    console.log(err);
  }
}