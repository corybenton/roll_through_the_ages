
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
      console.log('gamestate id newgame.js:', responseData.gameStateId);
      //window.location.href = `/game/${responseData.gameStateId}`;
      window.location.href = '/game'; // Can't get either of these to direct to the game.handlebars... hmmmmm
    } else {
      alert('Failed to create a new game.');
    }
  } catch (err) {
    console.error(err);
    alert('An error occurred.');
  }
});

