// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    this.xStart = x;
    this.yStart = y;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.init();
};

Enemy.prototype.init = function(){
    this.x = this.xStart; 
    this.y = this.yStart;
    this.sprite = 'images/enemy-bug.png';
    this.speed = Math.floor((Math.random() * 400) + 150);
}

Enemy.prototype.reset = function(){
    this.init();
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    if (this.x >= 1000){
        this.init();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.width = 101;
    this.winner = false;

    this.xStart = 202;
    this.yStart = 404;


    ///amount to move player on X or Y axis
    this.moveX = 0;
    this.moveY = 0;

    this.speed = 4;


    ///starting position, bottom middle
    this.x = this.xStart;
    this.y = this.yStart; ///404

}

Player.prototype.update = function(dt) {    
    ///get amount to move from the handleInput
    ///over deltaTime move the player up that amount in a smooth fashion
    if (this.moveX > 0){
        if (this.x >= 400){
            this.moveX = 0;
        } else {
            this.x += parseInt(this.speed);
            this.moveX -= parseInt(this.speed);
        }
        
    } else if (this.moveX < 0){
        if (this.x <= 2){
            this.moveX = 0;
        } else {
            this.x -= parseInt(this.speed);
            this.moveX += parseInt(this.speed);
            console.log(this.x);
        }
    }

    if (this.moveY > 0)    {
        if (this.y >= 404){
            this.moveY = 0;
        } else {
            this.y += parseInt(this.speed);
            this.moveY -= parseInt(this.speed);
        }
        
    } else if (this.moveY < 0){
        this.y -= parseInt(this.speed);
        this.moveY += parseInt(this.speed)
        }

    if (this.y < -10)
    {
        this.winner = true;
    }


    ///reduces possibility where value is +-1 and changing by more than +-1,
    ///stuck in a jittery loop of unendingness 
    if (this.moveX <= 1 && this.moveX >= -1)
    {
        this.moveX = 0;
    }

    if (this.moveY <= 1 && this.moveY >= -1)
    {
        this.moveY = 0;
    }

};

Player.prototype.reset = function(){
    ///set move to 0    
    this.moveX = 0;
    this.moveY = 0;
    ///set position to start position
    this.x = this.xStart;
    this.y = this.yStart;
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


Player.prototype.handleInput = function(input){
    //width and height of each grid block
    var blockVertical = 84;
    var blockHorizontal = 100;
    if ((this.moveX == 0) && (this.moveY == 0))
    {
        switch (input)
        {
            case "up":
                this.moveY = -blockVertical;   
                break;
            case "down":        
                this.moveY = blockVertical;
                break;
            case "left":
                this.moveX = -blockHorizontal;
                break;
            case "right":
                this.moveX = blockHorizontal;
                break;

            default: 
                console.log("invalid input don't move");
                break;

        }
    }
};




// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var player = new Player();
var allEnemies = new Array();
var startNumOfEnemies = 3;
var enemyXStart = -100;
var rowHeight = 83; 
var rowOffset = 60;

var addEnemies = function(numOfEnemies){
for (var i = 0; i < numOfEnemies; i++){
    var yStart = rowHeight * (i % 3) + rowOffset;
    enemyXStart -= 100;
    var bufferEnemy = new Enemy(enemyXStart, yStart);
    allEnemies.push(bufferEnemy);
    }
}

addEnemies(startNumOfEnemies);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
