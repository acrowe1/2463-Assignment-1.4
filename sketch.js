let bugs = [];
let score = 0; 
let timeRemaining = 30; 
let gameOver = false; 
let gameFont; 
let isAlive; 
let animations = []; 
let deadBugs = 0; 



function preload() {
    animations = {
        flyRight: { row: 1, col: 0, frames: 2 }, 
        flyUp: {row: 0, col: 0, frames: 2}, 
        deadRight: { row: 1, col: 3}, 
        deadUp: { row: 0, col: 3}
    }; 

    bugs.push(new Bug(100,100,94,94,'assets/bugSprite.png',animations, random(-1, 1), random(-1, 1)));
    gameFont = loadFont('assets/PressStart2P-Regular.ttf');
    console.log("loaded"); 

}

function setup() {
    createCanvas(400,400, 'fullscreen');

    textFont(gameFont); 
    console.log("setup"); 
}

function draw() {
    console.log("drawing");
    background(225);
    
    if (gameOver) {
        gameDone(); 
    } else {
        playing(); 
    }

    for (let i = 0; i < bugs.length; i++) {
        let bug = bugs[i];
        
        if (bug.sprite.x + bug.sprite.width / 3 > width) {
            bug.flyLeft();
        } else if (bug.sprite.x - bug.sprite.width / 3 < 0) {
            bug.flyRight();
        } else if (bug.sprite.y + bug.sprite.height / 3 > height) {
            bug.flyUp();
        } else if (bug.sprite.y - bug.sprite.height / 3 < 0) {
            bug.flyDown();
        }
    }   
    console.log("reached"); 
}

function playing() { 
    textSize(10); 
    text("Score: " + score, 20, 20); 
    text("Time: " + ceil(timeRemaining), width-120, 20); 
    text("Squished bugs: " + deadBugs, width-290, 20); 
    timeRemaining -= deltaTime / 1000; 
    if (timeRemaining < 0) {
        gameOver = true; 
    }
}



function gameDone() {
    for (let i = 0; i < bugs.length; i++) {
        bugs[i].sprite.remove(); 
    }
    bugs = []; 
    text("Time's up!", 90, 100); 
    text("Score: " + score, 90, 150); 
    text("Bugs Squished: " + deadBugs, 90, 200);
    text("Press space to play again.", 90, 250);
}

function keyTyped() {
    if (gameOver && key === ' ') {
        timeRemaining = 30;
        score = 0;
        gameOver = false;
        deadBugs = 0; 
        bugs = [];

        let x = random(width);
        let y = random(height);
        let velX = 1;
        let velY = 1;
        bugs.push(new Bug(x, y, 94, 94, 'assets/bugSprite.png', animations, velX, velY));
    }
}


function mousePressed() {
    if (gameOver) {
        return; 
    }
    
    let velX = random(-1, 1); 
    let velY = random(-1, 1);
    
    let x = constrain(mouseX, 0, width - 94);
    let y = constrain(mouseY, 0, height - 94);

    for (let i = bugs.length - 1; i >= 0; i--) {
        if (bugs[i].contains(mouseX, mouseY)) {
            if (bugs[i].isAlive) { 
                bugs[i].isAlive = false; 
                deadBugs++; 
                console.log(deadBugs);
                console.log('in bug'); 
                console.log("isAlive equals: " + bugs[i].isAlive); 
                if (!bugs[i].isAlive) {
                    console.log("that bug is dead!");
                    if (bugs[i].sprite.vel.x > 0) {
                        bugs[i].stopRight(); 
                    } else if (bugs[i].sprite.vel.x < 0) {
                        bugs[i].stopLeft(); 
                    } else if (bugs[i].sprite.vel.y > 0) {
                        bugs[i].stopDown();
                    } else if (bugs[i].sprite.vel.y < 0) {
                        bugs[i].stopUp();
                    }
                    
                    score += 5; 
                    console.log("new bug time");
                } 
            }
        }
    }
    if (!bugs.some(bug => bug.isAlive)) {
        bugs.push(new Bug(x, y, 94, 94, 'assets/bugSprite.png', animations, velX, velY));
        console.log("new bug"); 
    }}

class Bug {
    constructor(x, y, width, height, spriteSheet, animations, velX, velY) {
        this.sprite = new Sprite(x,y,width,height);
        this.sprite.spriteSheet = spriteSheet;

        this.sprite.anis.frameDelay = 12; 
        this.sprite.addAnis(animations);

        this.isAlive = true; 
        this.sprite.collider = 'none';  
        
        this.sprite.vel.x = velX;
        this.sprite.vel.y = velY;

        if (velX > 0) {
            this.flyRight();
        } else if (velX < 0) {
            this.flyLeft();
        } else if (velY > 0) {
            this.flyDown();
        } else if (velY < 0) {
            this.flyUp();
        }
    }

    contains(x, y) {
        let insideX = x >= this.sprite.x && x <= this.sprite.x + this.sprite.width;
        let insideY = y >= this.sprite.y && y <= this.sprite.y + this.sprite.height;
        return insideX && insideY;
    }
    

    stopRight() {
        this.sprite.changeAni('deadRight');
        this.sprite.vel.x = 0; 
        this.sprite.vel.y = 0; 
        this.sprite.scale.x = 1; 
    }

    stopLeft() {
        this.sprite.changeAni('deadRight'); 
        this.sprite.vel.x = 0; 
        this.sprite.vel.y = 0; 
        this.sprite.scale.x = -1; 
        
    }
    
    stopUp() {
        this.sprite.changeAni('deadUp'); 
        this.sprite.vel.x = 0; 
        this.sprite.vel.y = 0; 
        this.sprite.scale.y = 1; 
        
    }

    stopDown() {
        this.sprite.changeAni('deadUp'); 
        this.sprite.vel.x = 0; 
        this.sprite.vel.y = 0; 
        this.sprite.scale.y = -1; 
    }
    
    flyRight() {
        this.sprite.changeAni('flyRight');
        this.sprite.vel.x = 1;
        this.sprite.scale.x = 1; 
        this.sprite.vel.y = 0; 
    }
    
    flyLeft() {
        this.sprite.changeAni('flyRight');
        this.sprite.vel.x = -1; 
        this.sprite.scale.x = -1; 
        this.sprite.vel.y = 0; 
    }

    flyUp() {
        this.sprite.changeAni('flyUp'); 
        this.sprite.vel.y = -1; 
        this.sprite.vel.x = 0; 
        this.sprite.scale.y = 1; 
    }

    flyDown() {
        this.sprite.changeAni('flyUp'); 
        this.sprite.vel.y = 1; 
        this.sprite.vel.x = 0; 
        this.sprite.scale.y = -1; 
    }
    
}
