const screen = document.querySelector('#screenContainer');

const scene = document.querySelector('.scene');
scene.setAttribute('onmousemove', 'myCoor(scene.style)')
let size = 80;
scene.style.height = `${size * 9}px`
scene.style.width = `${size * 16}px`

const input = document.querySelector('#username');
const enter = document.querySelector('#username_Button');

const showScore = document.querySelector('#showScore');
const hideScore = document.querySelector('#hideScore');
hideScore.remove();
const players = document.querySelector('#highScore')
players.remove();

const box = document.createElement('div');
box.classList.add('player');

let game = true;

let movingLeft = false;
let movingRight = false;
let movingUp = false;
let movingDown = true;

let bottom = 600;
let left = 0;

let leftMove;
let RightMove;
let upMove;
let downMove;

let obstacles = []
scene.append(box);

function myCoor(e) {
    let x = e.left;
    let y = e.bottom;
    let coor = "Coordinates: (" + x + "," + y + ")";
    console.log(coor);
  }

// const ob1 = document.querySelector('#ob1');
function createObstacle(height,width,left,bottom){
    const ob1 = document.createElement('div');
    ob1.classList.add('obstacle')
    ob1.setAttribute('id', 'ob1');
    ob1.style.height = `${height}px`;
    ob1.style.width = `${width}px`;
    ob1.style.left = `${left}px`;
    ob1.style.bottom = `${bottom}px`;
    scene.append(ob1);
    obstacles.push(ob1);
}
createObstacle(50, 50, 500, 0);
createObstacle(5, 500, 0, 70);
console.log(obstacles)



// console.log('width', ob1.style)
// -----------------------------------------------------------------------------
// Functions
function downInterval() {
    downMove = setInterval(()=>{
        bottom = bottom - 1.5;
        for (let i = 0; i < obstacles.length; i++) {
            if (left > Number(obstacles[i].style.left.slice(0,-2)) - 10
            && left < Number(obstacles[i].style.left.slice(0,-2)) + Number(obstacles[i].style.width.slice(0,-2))
            && bottom < Number(obstacles[i].style.bottom.slice(0,-2)) + Number(obstacles[i].style.height.slice(0,-2))
            && bottom > Number(obstacles[i].style.bottom.slice(0,-2)) + Number(obstacles[i].style.height.slice(0,-2)) - 20) {
                bottom = Number(obstacles[i].style.bottom.slice(0,-2)) + Number(obstacles[i].style.height.slice(0,-2))
                movingUp = false;
            }
        }
        if (bottom < 0) {
            bottom = 0;
            movingUp = false;
        }
        box.style.bottom = `${bottom}px`;
    },1) 
}


function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function addMusic(sound) {
    const music = document.createElement('audio');
    music.classList.add('music');
    // music.setAttribute('controls', true);
    music.setAttribute('autoplay', true);
    music.setAttribute('loop', true);
    music.volume = 0.25;
    console.log('music volume', music.volume);
    const mp3 = document.createElement('source');
    mp3.setAttribute('src', ` sounds/${sound}`);
    mp3.setAttribute('type', 'audio/mpeg');
    music.append(mp3);
    document.body.append(music);
}

function addSFX(sound) {
    let sfx = document.createElement('audio');
    sfx.classList.add('sfx');
    sfx.setAttribute('autoplay', true);
    // music.setAttribute('controls', true);
    // music.setAttribute('loop', true);
    sfx.volume = 0.05;
    // console.log('sfx volume:', sfx.volume);
    const mp3 = document.createElement('source');
    mp3.setAttribute('src', ` sounds/${sound}`);
    mp3.setAttribute('type', 'audio/mpeg');
    sfx.append(mp3);
    document.body.append(sfx);
    // Removes sfx from HTML in 5 seconds.
    setInterval(()=>{document.body.removeChild(sfx)},5000)
}
// Functions End
// -----------------------------------------------------------------------------
// Controls
document.addEventListener("keydown", (event) => {
    const keyName = event.key;
    // console.log(keyName);
    if (keyName === 'ArrowUp') {
        if (movingUp === false) {
            clearInterval(downMove)
            upMove = setInterval(()=>{
                bottom++;
                if (bottom > 710) {
                    bottom = 710;
                }
                box.style.bottom = `${bottom}px`;
            },1)
            setTimeout(()=>{
                clearInterval(upMove);
                downInterval()
            },500)
            movingUp = true;
        }
    }
    if (keyName === 'ArrowLeft') {
        if (movingLeft === false) {
            if (movingRight === true) {
                setTimeout(()=>{
                    clearInterval(rightMove);
                },100)
                movingRight = false;
            } else {
                leftMove = setInterval(()=>{
                    left--;
                    if (left < 0) {
                        left = 0;
                    }
                    if ((left > 490 && left < 550) && bottom < 50) {
                        left = 550;
                    }
                    box.style.left = `${left}px`;
                },1)
                movingLeft = true;
            }
        }
    }
    if (keyName === 'ArrowRight') {
        if (movingRight === false) {
            if (movingLeft === true) {
                setTimeout(()=>{
                    clearInterval(leftMove);
                },100)
                movingLeft = false;
            } else {
                rightMove = setInterval(()=>{
                    left++;
                    if (left > 1270) {
                        left = 1270;
                    }
                    if ((left > 490 && left < 550) && bottom < 50) {
                        left = 490;
                    }
                    box.style.left = `${left}px`;
                },1)
                movingRight = true;
            }
        }
    }
})
// Controls End
// -----------------------------------------------------------------------------
// POST Request
enter.addEventListener('click', ()=>{
    if (input.value.includes(' ') || input.value.length === 0) {
        addSFX('sfx_badEntry.mp3')
        console.log("No spaces, and don't leave it blank.")
        input.value = '';
    };
        
    if (input.value.length > 0) {
        addSFX('sfx_goodEntry.mp3')

        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
        }

        let bodyContent = JSON.stringify({
            "name": input.value,
            "score": 0
        });
        
        fetch("/players", { 
            method: "POST",
            body: bodyContent,
            headers: headersList
        })
        .then((data)=>{
            console.log(data)
        })
    }
            
    input.value = ''; // Always clears text box
});
// -----------------------------------------------------------------------------
hideScore.addEventListener('click', ()=>{
    hideScore.remove();
    removeAllChildNodes(players)
    players.remove();
    screen.append(showScore);
})
// -----------------------------------------------------------------------------
// GET Request
showScore.addEventListener('click', ()=>{
    showScore.remove()
    screen.append(hideScore);
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
            scoreString = scoreString.join('');
            scoreString = scoreString.split('');
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
            user.classList.add('.scoreText')
            players.append(user);
        }
        players.prepend('HIGH SCORE')
        screen.append(players);
    })
})
// -----------------------------------------------------------------------------
addMusic('music.mp3');
downInterval()