const screen = document.querySelector('#screenContainer');

const scene = document.querySelector('.scene');
let size = 80;
scene.style.height = `${size * 9}px`
scene.style.width = `${size * 16}px`

const input = document.querySelector('#username');
input.remove()
const enter = document.querySelector('#username_Button');
enter.remove()
const players = document.querySelector('#highScore');

const currentTime = document.querySelector('#timer');

let boxSize = 10;
const box = document.createElement('div');
box.classList.add('player');
box.style.height = `${boxSize}px`;
box.style.width = `${boxSize}px`;

let game = true;
let landed = false;
let stopped = true;
let slide = false;
let clock = 60;

let movingLeft = false;
let movingRight = false;
let movingUp = false;
let movingDown = true;

let bottom = 500;
let left = 200;
// left = 5000; // Cheat 

let leftMove;
let rightMove;
let upMove;
let downMove;

let obstacles = []
scene.append(box);

createObstacle(30, 100, 100, 100); // (height,width,left,bottom)
createObstacle(30, 100, 200, 300); // (height,width,left,bottom)
createObstacle(30, 100, 300, 200); // (height,width,left,bottom)
createObstacle(30, 200, 600, 200); // (height,width,left,bottom)
createObstacle(30, 280, 1000, 200); // (height,width,left,bottom)
createEnd(30,30,1250,230)

// Functions--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function calculateScore(clock) {
    return clock * 1000;
}

let runClock = setInterval(()=>{
    clock--;
    if (clock <= 0) {
        clock = 0;
        clearInterval(runClock);
    }
},1000)

let displayTime = setInterval(() => {
    currentTime.textContent = clock;
    console.log(clock);
}, 1000);

function setTimer() {
    runClock
    displayTime

}

// Clearing

function clearVerticalIntervals(){
    clearInterval(upMove);
    clearInterval(downMove);
}

function clearHorizontalIntervals(){
    clearInterval(leftMove);
    clearInterval(rightMove);
}

function noVertical() {
    movingDown = false;
    movingUp = false;
}

function noHorizantal() {
    movingLeft = false;
    movingRight = false;
}

// Game World

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

function createEnd(height,width,left,bottom){
    const end = document.createElement('div');
    end.innerText = 'end'
    end.classList.add('end')
    end.setAttribute('id', 'end');
    end.style.height = `${height}px`;
    end.style.width = `${width}px`;
    end.style.left = `${left}px`;
    end.style.bottom = `${bottom}px`;
    scene.append(end);
    obstacles.push(end);
}

function barrier() {

    let plaHeight = Number(box.style.height.slice(0, -2));
    let plaWidth = Number(box.style.width.slice(0, -2));

    let sceneBottom = Number(scene.style.bottom.slice(0, -2));
    let sceneHeight = Number(scene.style.height.slice(0, -2));
    let sceneLeft = Number(scene.style.left.slice(0, -2));
    let sceneWidth = Number(scene.style.width.slice(0, -2));
    
    let endBottom = Number(end.style.bottom.slice(0, -2))
    let endHeight = Number(end.style.height.slice(0, -2));
    let endLeft = Number(end.style.left.slice(0, -2));
    let endWidth = Number(end.style.width.slice(0, -2));

    let checkEnd = setInterval(()=>{
        if (((bottom < (endBottom + endHeight)) && (bottom > (endBottom - plaHeight)))
        && ((left > endLeft - plaWidth) && (left < (endLeft + endWidth)))) {
            clearInterval(runClock);
            clearInterval(displayTime);
            end.remove()
            document.querySelector('h1').remove()
            console.log(`You Win with ${clock} seconds to spare`)
            scene.append(input);
            scene.append(enter)
            currentTime.remove()
            const win = document.createElement('h1');
            win.textContent = `You Reached the End with ${clock} seconds to spare.`
            scene.append(win);

        }
    },1)
    
    checkObstacles = setInterval(()=>{
        for (let i = 0; i - obstacles.length; i++) {

            let obcBottom = Number(obstacles[i].style.bottom.slice(0, -2));
            let obcHeight = Number(obstacles[i].style.height.slice(0, -2));
            let obcLeft = Number(obstacles[i].style.left.slice(0, -2));
            let obcWidth = Number(obstacles[i].style.width.slice(0, -2));

            if(movingDown
            && ((bottom < obcBottom + obcHeight)
            && bottom > (obcBottom + plaHeight) - (plaHeight / 2))){
                if((left > obcLeft - plaWidth
                && left < obcLeft + obcWidth)) {
                    clearVerticalIntervals()
                    noVertical();
                    bottom = obcBottom + obcHeight;
                    checkMovingLand()
                }
            }
            
            if(movingUp
            && ((bottom > obcBottom - (plaHeight / 2))
            && bottom < (obcBottom + plaHeight))){
                if((left > obcLeft - plaWidth
                && left < obcLeft + obcWidth)) {
                    clearVerticalIntervals()
                    noVertical();
                    movingDown = true;
                    bottom = obcBottom - plaHeight;
                }
            }

            if(movingLeft
            && ((bottom <= obcBottom + obcHeight)
            && bottom >= (obcBottom + plaHeight) - (plaHeight / 2))){
                if((left > obcLeft - plaWidth
                && left < obcLeft)) {
                    left = obcLeft;
                    clearHorizontalIntervals()
                    noHorizantal()
                    checkMovingLand()
                }
            }

            if(movingRight
            && ((bottom <= obcBottom + obcHeight)
            && bottom >= (obcBottom + plaHeight) - (plaHeight / 2))){
                if((left > obcLeft + obcWidth - plaWidth
                && left < obcLeft + obcWidth)) {
                    console.log('right')
                    left = obcLeft + obcWidth - plaWidth;
                    clearHorizontalIntervals()
                    noHorizantal()
                    checkMovingLand()
                }
            }
                
        }
        // End of interval 
    },1)

    
    checkBarrier = setInterval(()=>{
        // Top Border Check
        if (bottom > sceneHeight) {
            clearVerticalIntervals();
            noVertical();
            movingDown = true;
            bottom = sceneHeight - plaHeight;
        }
        // Bottom Border Check
        if (bottom < sceneBottom) {
            console.log('lost')
            clearVerticalIntervals()
            noVertical()
            bottom = sceneBottom;
            checkMovingLand();
        }
        // Left Border Check
        if (left < sceneLeft) {
            clearHorizontalIntervals()
            noHorizantal()
            left = sceneLeft;
            stopped = true;
        }
        // Right Border Check
        if (left > sceneWidth - plaWidth) {
            clearHorizontalIntervals()
            noHorizantal()
            left = sceneWidth - plaWidth;
            stopped = true;
        }
        // physics()
        box.style.bottom = `${bottom}px`;
        box.style.left = `${left}px`;
    },1) 
}

function physics(){
    if (movingDown){
        downInterval();
    }

    if (movingUp) {
        upInterval();
    }

    if (movingLeft) {
        leftInterval();
    }

    if (movingRight) {
        rightInterval();
    }

    barrier();
}

// Intervals

function downInterval() {
    downMove = setInterval(()=>{
        bottom = bottom - 3;
    },1) 
}

function upInterval() {
    upMove = setInterval(()=>{
        bottom = bottom + 1;
    },1) 
}

function leftInterval() {
    leftMove = setInterval(()=>{
        left = left - 1;
    },1) 
}

function rightInterval() {
    rightMove = setInterval(()=>{
        left = left + 1;
    },1) 
}

function checkMovingLand() {
    if (stopped === false){
        clearHorizontalIntervals()
        noHorizantal()
        let landCheck = setTimeout(()=>{
            stopped = true;
            landed = true;
        }, 100)
    } else {
        landed = true;
    }
}

// DOM Functions

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// Sound Functions

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

// End of Functions-------------------------------------------------------------------------------------------------------------------------------------------

// Controls

document.addEventListener("keydown", (event) => {
    const keyName = event.key;
    // console.log(keyName);
    if (keyName === 'ArrowUp') {
        if (landed) {
            if (!stopped) {
                noHorizantal();
            }
            clearVerticalIntervals();
            movingUp = true;
            landed = false;
            physics();
            if (!stopped) {
                setTimeout(()=>{
                    clearVerticalIntervals();
                    movingUp = false;
                    movingDown = true;
                    physics();
                }, 750)
            } else {
                setTimeout(()=>{
                    clearVerticalIntervals();
                    movingUp = false;
                    movingDown = true;
                    physics();
                }, 250)
            }
        }
    }

    if (keyName === 'ArrowLeft') {
        if (stopped && landed) {
            clearHorizontalIntervals();
            movingLeft = true;
            stopped = false;
            physics();
        } else {
            if (movingRight) {
                clearHorizontalIntervals();
                noHorizantal();
                stopped = true;
                physics();
            }
        }
    }

    console.log('stopped:', stopped, 'landed:', landed)
    if (keyName === 'ArrowRight') {
        if (stopped && landed) {
            clearHorizontalIntervals();
            movingRight = true;
            stopped = false;
            physics();
        } else {
            if (movingLeft) {
                clearHorizontalIntervals();
                noHorizantal();
                stopped = true;
                physics();
            }
        }
    }
})
// Controls End
// -----------------------------------------------------------------------------
// POST Request

const populateScore = ()=>{
    removeAllChildNodes(players);
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
            scoreString[20 - String(score.length)] = player.score;
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
    })
}

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
            "score": calculateScore(clock)
        });
        
        fetch("/players", { 
            method: "POST",
            body: bodyContent,
            headers: headersList
        })
        .then((data)=>{
            return data.json()
        })
        .then(newScore =>{
            populateScore();
        })
        input.remove()
        enter.remove()
        location.reload()
    }
            
    input.value = ''; // Always clears text box
});
// -----------------------------------------------------------------------------

addMusic('music.ogg');
physics();
populateScore();
setTimer();