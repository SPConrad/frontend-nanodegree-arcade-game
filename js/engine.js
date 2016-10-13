/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the this.canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

 var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the this.canvas element, grab the 2D context for that this.canvas
     * set the this.canvas elements height/width and add it to the DOM.
     */
     this.doc = global.document;
     this.win = global.window;
     this.level = 0;
     this.levelText;
     this.canvas = this.doc.createElement('canvas');
     this.ctx = this.canvas.getContext('2d');
     this.lastTime;
     this.winner = false;
     this.winTimer = 0;
     this.winScreenTimeOut = 0.1;

     this.levelSize;
     this.numRows = 6;
     this.numCols = 5;

     this.canvas.width = 505;
     this.canvas.height = 606;
     this.doc.body.appendChild(this.canvas);
     this.blocks = {
        'w' : 'images/water-block.png',
        's' : 'images/stone-block.png',
        'g' : 'images/grass-block.png'
    };

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
     function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
         var now = Date.now(),
         dt = (now - this.lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
         update(dt);
         render();

        /* Set our this.lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
         this.lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
         win.requestAnimationFrame(main);
     }

    /* This function does some initial setup that should only occur once,
     * particularly setting the this.lastTime variable that is required for the
     * game loop.
     */
     function init() {
        reset();
        this.lastTime = Date.now();
        player.updateMap(this.numRows, this.numCols);
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
     function update(dt) {
        ///this.winner is set in the player object, check it on every loop
        this.winner = player.winner;
        if (!this.winner)
        {
            ///continue as normal if user has not won
            updateEntities(dt);
            checkCollisions();
        } else if (this.winner) {
            if ((this.winScreenTimeOut -= dt) > 0){
                ///win timer is 3 seconds, count up and then reset

                ctx.font = "36pt Impact";
                ctx.textAlign = "center";

                ctx.fillStyle = "white";

                ctx.fillText("this.winner!", this.canvas.width / 2, 40);

                
                ctx.strokeStyle = "black";
                ctx.lineWidth = 3;
                ctx.strokeText("this.winner!", this.canvas.width / 2, 40);

            } else {
                ///after 3 seconds, reset the game
                this.winTimer = 0;
                player.winner = false;
                this.winner = false;
                ///clear the this.winner message
                ctx.clearRect(0, 0, 500, 500);
                ///add another 3 enemies to increase difficulty
                loadNextLevel();
                //addEnemies(3);
                //init();
            }
            
        }
    }

    function loadNextLevel(){
        this.level++;
        loadFile(function(response){
            this.levelSize = response.slice(0,3);
            this.numCols = this.levelSize.slice(0,1);
            this.numRows = this.levelSize.slice(2,3);
            this.levelText = response.slice(3);
            this.levelText = this.levelText.split("\n");
            this.canvas.width = this.numCols * 101;
            this.canvas.height = this.numRows * 101;
            init();
        });
        if (this.level % 5 === 0){
            addEnemies(3);
        };         
    }

    var level0 = [addFive("w"), addFive("s"), addFive("s"), addFive("s"), addFive("g"), addFive("g")];

    this.levelText = level0;

    function addFive(string){
        var newString = "";

        newString = string.repeat(5);

        return newString;
    }
    //console.log(level2);

    var loadFile= function(callback) {   
        ///get JSON file with readable weather codes
        var xobj = new XMLHttpRequest();
        xobj.open('GET', "levels/level" + this.level + ".txt"); 
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                callback(xobj.responseText);
            }
        };
        xobj.send(null);  
    };

    /* This function checks for collisions. If the player and an enemy 
     * occupy the same square, the game resets
     */
     function checkCollisions() {
        allEnemies.forEach(function(enemy) {
            ///check for collision with the player near each enemy
            if (enemy.x > player.x - 60
                && enemy.x < player.x + 60
                && enemy.y > player.y - 60
                && enemy.y < player.y + 60){
                    //reset the game   
                reset();
            }

        })
    }


    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
     function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update(dt);
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */

     function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
         var 
         numRows = 6,
         numCols = 5, 
         row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
         var block = "";
         for (row = 0; row < this.numRows; row++) {
            for (col = 0; col < this.numCols; col++) {
                /* The drawImage function of the this.canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                 ctx.drawImage(Resources.get(this.blocks[this.levelText[row][col]]), col * 101, row * 83);
             }
         }

         renderEntities();
     }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
     function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
         allEnemies.forEach(function(enemy) {
            enemy.render();
        });
         player.render();
     }

     /* Reset function to return game to starting position when player is hit
     * or when player reaches the end and wins
     */ 
     function reset(){
        ///run through reset functions for each entity         
        allEnemies.forEach(function(enemy) {
            enemy.reset();
        })
        player.reset();
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
     Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png'
        ]);
     Resources.onReady(init);

    /* Assign the this.canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
     global.ctx = ctx;
 })(this);
