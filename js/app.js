// Enemies our player must avoid
var Enemy = function(x, y) {
    ///set the x and y to the passed in numbers
    this.xStart = x;
    this.yStart = y;    

    this.sprite = 'images/enemy-bug.png';    
    this.speed = 0;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.init();
};

Enemy.prototype.init = function(){
	this.x = this.xStart; 
	this.y = this.yStart;
    ///set the speed to a random number between 150 and 550 (pretty slow and pretty fast)
    this.speed = Math.floor((Math.random() * 400) + 150);
}

Enemy.prototype.reset = function(){
    ///reset location and speed
    this.init();
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    ///once it reachs a certain position off screen, reset it 
    ///I believe the 1000 position gives it enough time off screen
    ///for enjoyable gameplay
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
	this.points = 0;
	this.level = 0;
	this.sprite = 'images/char-boy.png';
	this.width = 101;
	this.winner = false;

    ///start at the bottom middle. these could be set to variables for randomized
    ///starts and/or variably sized grids
    this.xStart = 202;
    this.yStart = 404;

    ///amount to move player on X or Y axis
    this.targetX = 0;
    this.targetY = 0;

    ///speed at which to move the player
    this.speed = 300;

    ///starting position, bottom middle
    this.x = this.xStart;
    this.y = this.yStart;


    this.maxHeight = 400;
    this.maxWidth = 404; 

}

Player.prototype.update = function(dt) {    
    ///get amount to move from the handleInput
    ///over deltaTime move the player that amount in a smooth fashion
    var moveSpeed = parseInt(this.speed * dt);

    if (this.targetX > this.x){
    	if (this.x >= this.maxWidth){
            ///don't move if at last tile
            this.targetX = 0;
        } else {
        	this.x += moveSpeed;
        }        
    } else if (this.targetX < this.x){
    	if (this.x <= 2){
            ///don't move if at last tile
            this.targetX = 0;
        } else {
        	this.x -= moveSpeed;
        }
    }

    if (this.targetY > this.y)    {
    	if (this.y >= this.maxHeight){
            ///don't move if at last tile
            this.targetY = 0;
        } else {
        	this.y += moveSpeed;
        }        
    } else if (this.targetY < this.y){
        ///don't need a last tile check as the game will default to win state
        this.y -= moveSpeed;
    }

    if (this.y < -10)
    {
        ///at the top, set win condition to true
        this.winner = true;
    }

    
    ///if moving the player again would cause it to overshoot the target, simply set 
    ///it to the target position   
    if ((this.x + moveSpeed) > this.targetX && (this.x - moveSpeed) < this.targetX)
    {
    	this.x = this.targetX;
    }

    if ((this.y + moveSpeed) > this.targetY && (this.y - moveSpeed) < this.targetY)
    {

    	this.y = this.targetY;
    }


};

Player.prototype.reset = function(){
    ///set position to start position
    this.x = this.xStart;
    this.y = this.yStart;

    ///set move to current positon  
    this.targetX = this.x;
    this.targetY = this.y;
}

Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.updateMap = function(rows, cols){
	this.maxWidth = cols * 101;
	this.maxHeight = rows * 101;
}

Player.prototype.handleInput = function(input){
    //width and height of each grid block
    var blockVertical = 83;
    var blockHorizontal = 101;
    ///if a valid input is entered and user is not alread moving, target the next block
    if (this.targetX == this.x && this.targetY == this.y)
    {
    	switch (input)
    	{
    		case "up":
    		this.targetY -= blockVertical;   
    		break;
    		case "down":     
    		this.targetY += blockVertical;
    		break;
    		case "left":
    		this.targetX -= blockHorizontal;
    		break;
    		case "right":
    		this.targetX += blockHorizontal;
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
    ///one for each "road" row
    var yStart = rowHeight * (i % 3) + rowOffset;
    ///start each one a little further off the road to stagger their appearance 
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
