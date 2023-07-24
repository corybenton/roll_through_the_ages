/* eslint-disable no-unused-vars */

document.querySelector('#newGameBtn').addEventListener('click', async () => {
  console.log('Button clicked!');
  try {
    const response = await fetch('/game', {
      method: 'POST',
      body: JSON.stringify({ player: 1}),
      headers: { 'Content-Type': 'application/json' },
    });

    //console.log('Response:', response);

    if (response.ok) {
      const responseData = await response.json();
      //console.log('gamestate id newgame.js:', responseData.gameStateId);

      window.location.href = `/game/${responseData.newgame}`;
    } else {
      alert('Failed to create a new game.');
    }
  } catch (err) {
    console.error(err);
    alert('An error occurred.');
  }
});

document.querySelectorAll('.playBtn').forEach((button) => {
  button.addEventListener('click', async (event) => {
    const gameId = event.target.dataset.gameId;
    //console.log('gameId #playBtn outside try', gameId);

    try {
      const response = await fetch('/api/user', {
        method: 'GET',
        body: JSON.stringify(),
        headers: { 'Content-Type': 'application/json' },
      });

      const userData = await response.json();
      //console.log('playbtn userdata: ', userData);

      const userId = userData.id;
      //console.log('gameId, userId #playBtn:', gameId, userId);

      // Fetch the game data to check if the current user is part of the game
      const gameResponse = await fetch(`/json/${gameId}`, {
        method: 'GET',
        body: JSON.stringify(),
        //headers: { 'Content-Type': 'application/json' },
      });

      //console.log('gameRespone #playBtn', gameResponse);

      const gameData = await gameResponse.json();
      //console.log('playbtn gameData: ', gameData);

      const isUserInGame = gameData.gamestates.some(gamestate => gamestate.player === userId);

      if (isUserInGame) {
        window.location.href = `/game/${gameId}`;
      } else {
        alert('You are not a member of this game.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    }
  });
});

document.querySelectorAll('.joinBtn').forEach((button) => {
  button.addEventListener('click', async () => {
    console.log('Button clicked!');
    try {
      const response = await fetch('/join', {
        method: 'POST',
        body: JSON.stringify({ player: 2}),
        headers: { 'Content-Type': 'application/json' },
      });

      //console.log('Response joinBtn find relocation gameId:', response);

      if (response.ok) {
        const responseData = await response.json();
        //console.log('gamestate id newgame.js:', responseData.gameStateId);

        window.location.href = `/game/${responseData.newgame}`;
      } else {
        alert('Failed to Join game.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    }
  });
});

//Put where current players turn ends.
async function switchToNewTurn(gameId) {
  await fetch(`/game/${gameId}/turnover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
}