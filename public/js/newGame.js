
document.querySelector('#newGameBtn').addEventListener('click', async () => {
  console.log('Button clicked!');
  try {
    const response = await fetch('/game', {
      method: 'POST',
      body: JSON.stringify({ player: 1}),
      headers: { 'Content-Type': 'application/json' },
    });

    console.log('Response:', response);

    if (response.ok) {
      const responseData = await response.json();
      //console.log('gamestate id newgame.js:', responseData.gameStateId);
      //window.location.href = `/game/${responseData.gameStateId}`;

      //Sending get request to game/id
      window.location.href = `/game/${responseData.newgame}`; // Can't get either of these to direct to the game.handlebars... hmmmmm
    } else {
      alert('Failed to create a new game.');
    }
  } catch (err) {
    console.error(err);
    alert('An error occurred.');
  }
});


document.querySelector('#joinBtn').addEventListener('click', async () => {
  console.log('Button clicked!');
  try {
    const response = await fetch('/join', {
      method: 'POST',
      body: JSON.stringify({ player: 2}),
      headers: { 'Content-Type': 'application/json' },
    });

    console.log('Response:', response);

    if (response.ok) {
      const responseData = await response.json();
      //console.log('gamestate id newgame.js:', responseData.gameStateId);
      //window.location.href = `/game/${responseData.gameStateId}`;

      //Sending get request to game/id
      window.location.href = `/game/${responseData.newgame}`; // Can't get either of these to direct to the game.handlebars... hmmmmm
    } else {
      alert('Failed to Join game.');
    }
  } catch (err) {
    console.error(err);
    alert('An error occurred.');
  }
});