//board
let board;
let boardWidth = 750;
let boardHeght = 250;
let context;

//dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeght - dinoHeight;
let dinoImg;

let dino = {
    x : dinoX,
    y : dinoY,
    width: dinoWidth,
    height : dinoHeight
}


//cactuse
let cactuseArray = [];

let cactuse1Width = 34;
let cactuse2Width = 69;
let cactuse3Width = 102;

let cactuseHeight = 70;
let cactuseX = 700;
let cactuseY = boardHeght - cactuseHeight;

let cactuse1Img;
let cactuse2Img;
let cactuse3Img;

//physics
let velocityX = -8; //cactus moving from left to right (-)
let velocityY = 0;
let gravity = .4;

//gameplay
let gameOver = false;
let score = 0;
let maxScore = 0;
// Get the high score from localStorage
const highScore = localStorage.getItem('highScore');


window.onload = function(){

    board = document.getElementById('board');
    board.height = boardHeght;
    board.width = boardWidth;
    


    context = board.getContext('2d'); //used for drawing on board
    //draw initial dino
    // context.fillStyle='green';
    // context.fillRect(dino.x, dino.y, dino.width, dino.height);

    dinoImg = new Image();
    dinoImg.src = './img/dino.png';

    dinoImg.onload = function(){
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height)
    }

    cactuse1Img = new Image();
    cactuse1Img.src = './img/cactus1.png';

    cactuse2Img = new Image();
    cactuse2Img.src = './img/cactus2.png';

    cactuse3Img = new Image();
    cactuse3Img.src = './img/cactus3.png';

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000); //1000ms = 1 second
    document.addEventListener('keydown', moveDino);
}

//UPDATE GAME
function update(){
    requestAnimationFrame(update);
    if (gameOver){
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    //dino
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY); //apply gravity to current dino.y, making sure it does not exceed the ground
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    //cactus
    for (let i = 0; i < cactuseArray.length; i++){
        let cactuse = cactuseArray[i];
        if (score <= 999){
            cactuse.x += velocityX;
        } else if(score >= 1000) {
            cactuse.x += -12;
        } else if(score >= 1800) {
            cactuse.x += -18;
        } else if(score >= 2600) {
            cactuse.x += -24;
        } else if(score >= 3200) {
            cactuse.x += -30;
        }
        
        context.drawImage(cactuse.img, cactuse.x, cactuse.y, cactuse.width, cactuse.height);

        if (dedectCollision(dino, cactuse)){
            gameOver = true;
            dinoImg.src = './img/dino-dead.png';
            dinoImg.onload = function(){
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            }
        }
    }

    //score
    context.fillStyle='black';
    context.font='20px courier';
    score++;
    context.fillText(score, 5, 20);
    context.fillStyle='black';
    context.font='20px courier';
    context.fillText(highScore, 700, 20);
    if (score > localStorage.getItem('highScore')) {
        localStorage.setItem('highScore', score);
      }
}

function moveDino(e){
    if (gameOver){
        return;
    }

    if ((e.code == 'Space' || e.code == 'ArrowUp') && dino.y == dinoY){
        //jump
        velocityY = -10;
    } else if(e.code == 'ArrowDown' && dino.y == dinoY) {
        

    }
}




function placeCactus(){
    if (gameOver){
        return;
    }
    //place cactuse
    let cactuse = {
        img : null,
        x : cactuseX,
        y : cactuseY,
        width : null,
        height : cactuseHeight

    }

    let placeCactusChance = Math.random(); //0 - 0.9999....
    
    if (placeCactusChance > .90){ //10% you get cactuse3
        cactuse.img = cactuse3Img;
        cactuse.width = cactuse3Width;
        cactuseArray.push(cactuse);
    }
    else if (placeCactusChance > .70){ //30% you get cactuse2
        cactuse.img = cactuse2Img;
        cactuse.width = cactuse2Width;
        cactuseArray.push(cactuse);
    }
    else if (placeCactusChance > .50){ //50% you get cactuse1
        cactuse.img = cactuse1Img;
        cactuse.width = cactuse1Width;
        cactuseArray.push(cactuse);

    }

    if (cactuseArray.length > 5){
        cactuseArray.shift(); //remove the first element from array so that the array doesn't contantly grow and wont consume resources.

    }

}


function dedectCollision(a, b){
    return a.x < b.x + b.width &&  //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&  //a's top right corner passes b's top left corner
           a.y < b.y + b.height && //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;   //a's bottom left corner passes b's top left corner
}