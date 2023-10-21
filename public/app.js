
const input = document.querySelector('#username');
const enter = document.querySelector('#username_Button');

const showScore = document.querySelector('#showScore');
const hideScore = document.querySelector('#hideScore');
const players = document.querySelector('#highScore')

hideScore.remove();
players.remove();

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

enter.addEventListener('click', ()=>{
    if (input.value.includes(' ')
    || input.value.length === 0) {
        input.value = '';
        console.log("No spaces, and don't leave it blank.")
    };

    if (input.value.length > 0) {
        const name = input.value;
        const reqBody = JSON.stringify({"name": name, "score": 0})
        console.log('input.value', input.value);

        fetch('/players', {
            method: "POST",
            body: JSON.stringify({
                "name": name,
                "score": 0
            })
        })
        .then((response)=>{
            return response.json()
        })
        .then((data)=>{
            console.log(data)
        })
    }

    // Always clears text box
    input.value = '';
});


hideScore.addEventListener('click', ()=>{
    hideScore.remove();
    removeAllChildNodes(players)
    players.remove();
    document.body.append(showScore);
})

showScore.addEventListener('click', ()=>{
    // console.log('clicked')
    showScore.remove()
    document.body.append(hideScore);
    fetch('/players')
    .then((response)=>{
        return response.json();
    })
    .then((users)=>{
        let count = 1;
        for (let player of users) {
            // ScoreBoard display for each player.
            let score = String(player.score);
            let scoreString = [count, '._', player.name];
            count++;
            // Make each score display have same amount of characters.
            scoreString[20 - score.length] = player.score;
            for (let i = player.name.length; i <scoreString.length; i++) {
                if (scoreString[i] === undefined) {
                    scoreString[i] = '_';
                }
            }
            const user = document.createElement('div');
            scoreString = scoreString.join('');
            user.textContent = scoreString;
            players.append(user);
        }
        players.prepend('HIGH SCORE')
        document.body.append(players);
    })
})
