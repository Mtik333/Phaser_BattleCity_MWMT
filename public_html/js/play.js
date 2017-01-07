/* globals game, Phaser */
var WIDTH=448;
var HEIGHT=416;
var enemiesTotal = 21;
var enemiesAlive = 0;
var enemy; 
var enemies=[];
var enemyBullets;
var bulletExists;
var bullet;
var spaceKey;
var enterKey;
var escKey;
var base;
var explosion;
var direction;
var bricks;
var steels;
var grasses;
var layer;
var player;
var playerX;
var playerY;
var loaders=[];
var enemyPlace;
var fireRate=100;
var gameLoaded=false;
var bonus=0;
var music;
var gameOver=false;
var win=false;
var marker;
var enemyMarker;
var timer=false;
var paused=false;
var gameOverSprite;
var chosenLevel;
var canReturnToMenu=false;
var score=0;
var bonusEvent=0;
var scoreText;
var blocked=false;
var finishText;
var key=0;

let playState = {
    init: function(selection){
        chosenLevel='level'+selection;
        console.log(chosenLevel);
        WIDTH=448;
HEIGHT=416;
enemiesTotal = 20;
enemiesAlive = 0;
      enemies=[];
        fireRate=100;
gameLoaded=false;
bonus=0;
gameOver=false;
win=false;
timer=false;
paused=false;
canReturnToMenu=false;
score=0;
bonusEvent=0;
blocked=false;
key=0;
    },
  create () {
      
    var text="SELECT LEVEL\nPRESS ENTER TO START";
    var style = { font: "bold 13px Press Start", fill: "#00FFFF", align: "center"};
    var miniStyle = { font: "11px Press Start", fill: "#000000", align: "center"};
    scoreText = game.add.text(WIDTH, HEIGHT+80, text, style);
    scoreText.anchor.setTo(0, 0);
    finishText = game.add.text(WIDTH, HEIGHT/2+60, "STOP AT\nTHE KEY\nTO FINISH\nLEVEL", miniStyle);
    finishText.width=96;
    finishText.anchor.setTo(0, 0);
    game.world.setBounds(0, 0, 2000, 2000);
    bulletExists=false;
    gameOverSprite = game.add.sprite(WIDTH/2, HEIGHT, 'game_over');
    gameOverSprite.anchor.setTo(0.5, 0);
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = "#000000";
    music = game.add.audio('stage_start');
    music.play();
    player = game.add.sprite(9*16, game.world.height-32, 'playerTankStd');
    player.frame=6;
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.animations.add('playerDown', [0, 1], 25, true);
    player.animations.add('playerLeft', [2, 3], 25, true);
    player.animations.add('playerRight', [4, 5], 25, true);
    player.animations.add('playerUp', [6, 7], 25, true);
    player.scale.setTo(26/32, 26/32);
    base = game.add.sprite(12*16, HEIGHT-32, 'base');
    base.enableBody = false;
    base.physicsBodyType = Phaser.Physics.ARCADE;
    game.physics.arcade.enable(base);   
    cursors = game.input.keyboard.createCursorKeys();
    spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    escKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
    map = game.add.tilemap(chosenLevel);
    map.addTilesetImage('blocks2', 'gameTiles');
    map.addTilesetImage('grass', 'grass');
    map.addTilesetImage('water', 'water');
    layer = map.createLayer('tilesBasic');
    layer.resizeWorld();
    bricks = game.add.group();
    steels = game.add.group();
    waters = game.add.group();
    grasses = game.add.group();
    empties = game.add.group();
    map.createFromTiles(1, 3, 'brick', layer.index, bricks);
    map.createFromTiles(2, 3, 'steel', layer.index, steels);
    map.createFromTiles(5, null, 'water', layer.index, waters);
    map.createFromTiles(6, null, 'grass', layer.index, grasses);
    map.createFromTiles(3, null, null, layer.index, empties);
    game.physics.enable(bricks);
    bricks.setAll('body.moves', false);
    game.physics.enable(steels);
    steels.setAll('body.moves', false);
    game.physics.enable(waters);
    waters.setAll('body.moves', false);
    game.physics.enable(grasses);
    game.world.bringToTop(grasses);
    enemyBullets = game.add.group();
    for (var i=0; i<3; i++){
        enemyPlace=i;
        game.time.events.add(1000*(1+i), this.createAppear, this, i);
        game.time.events.start(1000*(1+i));
    }
    marker = game.add.graphics(Math.abs(448), 0);
    marker.beginFill(0x808080);
    marker.drawRect(0, 0, 96, HEIGHT);
    marker.endFill();
    marker.fixedToCamera = true;
    
	enemyMarker = game.add.group();
	for (var i=0; i<enemiesTotal; i++){
		test123=game.add.image(480+(i%2)*16, 64+(Math.floor(i/2))*16, 'enemiesLeft');
		enemyMarker.add(test123);
	}
  },
  update () {
    direction = Math.floor(player.animations.currentAnim.frame/2);
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    game.physics.arcade.collide(player, bricks, this.properBricksCollide, null, this);
    game.physics.arcade.collide(player, steels, this.properBricksCollide, null, this);
    game.physics.arcade.collide(player, waters, this.properBricksCollide, null, this);
    game.physics.arcade.collide(bullet, base, this.destroyBase);
    game.physics.arcade.collide(bullet, bricks, this.killBrick, null, this);
    game.physics.arcade.collide(bullet, steels, this.killSteels, null, this);
    game.physics.arcade.collide(enemies, bricks);
    game.physics.arcade.collide(enemies, steels);
    game.physics.arcade.collide(enemies, enemies);
    if(game.physics.arcade.collide(player, enemies)){
        switch(direction){
        case 0:
            player.body.y=player.body.y-8;
            break;
        case 1:
            player.body.x=player.body.x+8;
            break;
        case 2:
            player.body.x=player.body.x-8;
            break;
        case 3:
            player.body.y=player.body.y+8;
            break;
        }
        blocked=true;
    }
    else blocked=false;
    if (bonus!==0)
        game.physics.arcade.collide(player, bonus, this.pickBonusType, null, this);
    if (spaceKey.isDown && spaceKey.downDuration(10) && !bulletExists){	
	bulletExists = true;
        game.time.events.add(fireRate, this.createBullet, this);
    }
    if (cursors.left.isDown && !gameOver && !win)
    {
        player.body.velocity.x = -96;
        player.animations.play('playerLeft');
    }
    else if (cursors.right.isDown && !gameOver && !win)
    {
        player.body.velocity.x = 96;
        player.animations.play('playerRight');
    }
    else if (cursors.up.isDown && !gameOver && !win)
    {
        player.body.velocity.y = -96;
        player.animations.play('playerUp');
    }
    else if (cursors.down.isDown && !gameOver && !win)
    {
        player.body.velocity.y = 96;
        player.animations.play('playerDown');
    }
    else if (gameOver){
        scoreText.x=WIDTH/2;
        scoreText.anchor.setTo(0.5, 0);
        scoreText.text="YOUR SCORE: "+score+"\n\n\n\n\nPRESS ENTER\nTO RETURN TO MENU";
        bulletExists=true;
        gameOverSprite.bringToTop();
        scoreText.bringToTop();
        if (gameOverSprite.y > (HEIGHT-gameOverSprite.height)/2){
            gameOverSprite.y--;
            scoreText.y--;
        }
        else canReturnToMenu=true;
        if (canReturnToMenu)
        {
            var bestScore=sessionStorage.getItem("Level"+selection+"_score");
                if (bestScore!=null){
                    if (bestScore<score)
                        sessionStorage.setItem("Level"+selection+"_score", score);
                }
                else sessionStorage.setItem("Level"+selection+"_score", score);
            enterKey.onDown.addOnce(this.menuReturn, this)   
        }
    }
    else if (enemiesAlive==0 && enemiesTotal<=0){
        player.animations.stop();
        finishText.bringToTop();
        finishText.fixedToCamera=true;
        bulletExists=true;
        if (win==false)
        {   
            if (key==0)
                key = game.add.sprite(9*16, game.world.height-32, 'key');
            game.physics.arcade.enable(key);
            if (game.physics.arcade.collide(player, key)){
                var removedSteels=[];
            for (var i=0; i<steels.length; i++){
                newBrick=steels.getAt(i);
                if ((newBrick.x==416 || newBrick.x==432) && (newBrick.y==176 || newBrick.y==192)){
                    removedSteels.push(newBrick);
                    }
                }
                for (var i=0; i<removedSteels.length; i++){
                    steels.remove(removedSteels[i]);
                }
                game.physics.enable(bricks);
                bricks.setAll('body.moves', false);
                key.kill();
                game.camera.follow(player);
                finishText.text="EXIT\n LEVEL";
            }
        }
        if (player.x>700){
            scoreText.fill="#003300";
            bulletExists=true;
            win=true;
            scoreText.text="CONGRATULATIONS!\nYOUR SCORE: "+score+"\nPRESS ENTER\nTO RETURN TO MENU";
            scoreText.bringToTop();
            
            if (scoreText.y > (HEIGHT-scoreText.height)/2+80){
                scoreText.y--;
            }
            else canReturnToMenu=true;
            if (canReturnToMenu)
            {
                var bestScore=sessionStorage.getItem("Level"+selection+"_score");
                if (bestScore!=null){
                    if (bestScore<score)
                        sessionStorage.setItem("Level"+selection+"_score", score);
                }
                else sessionStorage.setItem("Level"+selection+"_score", score);
                 //console.log(sessionStorage.getItem("Level"+selection+"_score"));
                enterKey.onDown.addOnce(this.menuReturn, this)   
            }
            player.animations.stop();
        }
        
    }
    else {
        player.animations.stop();
    }
    
  },
  
  
  createAppear(i){
    loader = game.add.sprite((12*i)*16, 0, 'appear');
    loader.animations.add('appear', [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3], 25, true);
    loader.animations.play('appear');
    loaders.push(loader);
    game.time.events.add(1000, playState.createEnemy, this, i, loader);
    game.time.events.start(1000);
    },
    
    createEnemy(i, loader){
    var theEnemy = game.rnd.integerInRange(0,1);
    enemyMarker.remove(enemyMarker.getAt(enemyMarker.length-1));
    switch(enemiesTotal%8){
        case 4:
            enemy = new Enemy(game, (12*i)*16, 0, 'stdBonus');
            break;
        default:
            if (theEnemy==0)
                enemy = new Enemy(game, (12*i)*16, 0, 'std');
            else enemy = new Enemy(game, (12*i)*16, 0, 'fast');
            break;
    }
    game.add.existing(enemy);
    enemies.push(enemy);
    loader.kill();
    game.world.sendToBack(enemy);
    console.log(enemiesTotal);
    },
  
  createBullet: function() {
    bulletExists=true;
    music = game.add.audio('bullet_shot');
    music.play();
    direction = Math.floor(player.animations.currentAnim.frame/2);
    switch(direction){
        case 0:
            bullet = game.add.sprite(player.body.x+9, player.body.y+26, 'bulletDown');
            break;
        case 1:
            bullet = game.add.sprite(player.body.x, player.body.y+9, 'bulletLeft');
            break;
        case 2:
            bullet = game.add.sprite(player.body.x+26, player.body.y+9, 'bulletRight');
            break;
        case 3:
            bullet = game.add.sprite(player.body.x+9, player.body.y, 'bulletUp');
            break;
    }
    game.physics.enable(bullet);
    bullet.body.collideWorldBounds = true;
    bullet.enableBody = true;
    bullet.physicsBodyType = Phaser.Physics.ARCADE;
    bullet.body.velocity.x = 0;
    bullet.body.velocity.y = 0;
    bullet.body.onWorldBounds = new Phaser.Signal();
    bullet.body.onWorldBounds.add(this.resetBullet, this);
    switch(direction){
        case 0:
            bullet.body.velocity.y = 192;
            break;
        case 1:
            bullet.body.velocity.x = -192;
            break;
        case 2:
            bullet.body.velocity.x = 192;
            break;
        case 3:
            bullet.body.velocity.y = -192;
            break;
    }
  },
  resetBullet (myBullet) {
    if (base!=undefined)
        this.createSmallExplosion(myBullet);
    myBullet.kill();
    bulletExists = false;
    },
  createSmallExplosion (myBullet) {
    if (myBullet==undefined)
        myBullet=bullet;
    switch(direction){
        case 0:
            explosion = game.add.sprite(myBullet.x-12, myBullet.y-8, 'bulletExplosion');
            break;
        case 1:
            explosion = game.add.sprite(myBullet.x-16, myBullet.y-8, 'bulletExplosion');
            break;
        case 2:
            explosion = game.add.sprite(myBullet.x-8, myBullet.y-8, 'bulletExplosion');
            break;
        case 3:
            explosion = game.add.sprite(myBullet.x-12, myBullet.y-8, 'bulletExplosion');
            break;
    }
    explosion.animations.add('explode', [0, 1, 2], 20, false);
    explosion.animations.play('explode', 20, false, true);
  },
  createBigExplosion(myBullet){
    switch(direction){
        case 0:
            explosion = game.add.sprite(myBullet.x-32, myBullet.y-8, 'bigExplosion');
            break;
        case 1:
            explosion = game.add.sprite(myBullet.x-40, myBullet.y-32, 'bigExplosion');
            break;
        case 2:
            explosion = game.add.sprite(myBullet.x-8, myBullet.y-32, 'bigExplosion');
            break;
        case 3:
            explosion = game.add.sprite(myBullet.x-32, myBullet.y-40, 'bigExplosion');
            break;
    }
    explosion.animations.add('explode', [2, 3, 4, 4, 4, 4, 4, 3, 2], 20, false);
    explosion.animations.play('explode', 20, false, true);
    },
    destroyBase(myBullet){
    base.kill();
    playState.resetBullet(myBullet);
    playState.createBigExplosion(myBullet);
    music = game.add.audio('explosion_2');
    music.play();
    base = game.add.sprite(12*16, game.world.height-32, 'base_destroyed');
    gameOver=true;
},
killBrick: function(myBullet, brick) {
    playState.createSmallExplosion(myBullet);
    playState.resetBullet(myBullet);
    music = game.add.audio('bullet_hit_2');
    music.play();
    brick.kill();
  },
killSteels(myBullet){
    playState.createSmallExplosion(myBullet);
    music = game.add.audio('bullet_hit_1');
    music.play();
    playState.resetBullet(myBullet);
},
killPlayer(myBullet){
    playState.createBigExplosion(myBullet);
    music = game.add.audio('explosion_2');
    music.play();
    playState.resetBullet(myBullet);
    player.kill();
    gameOver=true;
},
bulletHitEnemy2: function(bullet, enemy){
    playState.createBigExplosion(bullet);
    music = game.add.audio('explosion_1');
    music.play();
    if (enemy.tankType.indexOf("stdBonus")>=0){
        score+=500;
        playState.createBonus2();
    }
    else if (enemy.tankType.indexOf("std")>=0){
        score+=100;
    }
    else if (enemy.tankType.indexOf("fast")>=0){
        score+=200;
    }
    playState.resetBullet(bullet);
    enemyPlace=(enemy.startX+3)/192;
	if (enemy.enemyBullet!=undefined)
		enemy.enemyBullet.destroy();
    enemy.destroy();
    enemiesAlive--;
    
},

properBricksCollide(mPlayer, mBrick){
        
        var pDirection=direction;
        if (mPlayer.x-mBrick.x>8){
            mPlayer.x++;
        }
        if (mPlayer.x-mBrick.x<-20){
            mPlayer.x--;
        }
        if (mPlayer.y-mBrick.y>8){
            mPlayer.y++;
        }
        if (mPlayer.y-mBrick.y<-20){
            mPlayer.y--;
        }
},
resetEnemyBullet: function(enemy1){
    if (base!=undefined)
        playState.createSmallExplosion(enemy1);
    enemy1.kill();
},

    createEnemyBullet: function(enemy1){
    music = game.add.audio('bullet_shot');
    music.play();
    enemy1.myDirection=Math.floor(enemy1.animations.currentAnim.frame/2);
    switch(enemy1.myDirection){
        case 0:
            enemy1.enemyBullet = game.add.sprite(enemy1.body.x+9, enemy1.body.y+26, 'bulletDown');
            break;
        case 1:
            enemy1.enemyBullet = game.add.sprite(enemy1.body.x, enemy1.body.y+9, 'bulletLeft');
            break;
        case 2:
            enemy1.enemyBullet = game.add.sprite(enemy1.body.x+26, enemy1.body.y+9, 'bulletRight');
            break;
        case 3:
            enemy1.enemyBullet = game.add.sprite(enemy1.body.x+9, enemy1.body.y, 'bulletUp');
            break;
    }
    game.physics.enable(enemy1.enemyBullet);
    enemy1.enemyBullets.add(enemy1.enemyBullet);
    enemy1.enemyBullet.body.collideWorldBounds = true;
    enemy1.enemyBullet.enableBody = true;
    enemy1.enemyBullet.physicsBodyType = Phaser.Physics.ARCADE;
    enemy1.enemyBullet.body.velocity.x = 0;
    enemy1.enemyBullet.body.velocity.y = 0;
    enemy1.enemyBullet.body.onWorldBounds = new Phaser.Signal();
    enemy1.enemyBullet.body.onWorldBounds.add(playState.resetEnemyBullet, this);
    switch(enemy1.myDirection){
        case 0:
            enemy1.enemyBullet.body.velocity.y = 192;
            break;
        case 1:
            enemy1.enemyBullet.body.velocity.x = -192;
            break;
        case 2:
            enemy1.enemyBullet.body.velocity.x = 192;
            break;
        case 3:
            enemy1.enemyBullet.body.velocity.y = -192;
            break;
        }
    },

changeDirection(enemy1){
    enemyDirection = game.rnd.integerInRange(0,3);
    enemy1.body.velocity.x=0;
    enemy1.body.velocity.y=0;
    enemy1.myDirection = enemyDirection;
    game.physics.arcade.collide(bricks, enemy1);
    game.physics.arcade.collide(steels, enemy1);
    switch(enemy1.myDirection){
        case 0:
            enemy1.body.velocity.y = 64*enemy1.speed;
            enemy1.animations.play('enemyDown');
            break;
        case 1:
            enemy1.body.velocity.x = -64*enemy1.speed;
            enemy1.animations.play('enemyLeft');
            break;
        case 2:
            enemy1.body.velocity.x = 64*enemy1.speed;
            enemy1.animations.play('enemyRight');
            break;
        case 3:
            enemy1.body.velocity.y = -64*enemy1.speed;
            enemy1.animations.play('enemyUp');
            break;
    }
},
createBonus2(){
    if (bonus!==0){
        bonus.kill();
    }
    bonusNumber = game.rnd.integerInRange(0,1);
    switch(bonusNumber){
        case 0:
            bonus = game.add.sprite(game.rnd.integerInRange(0,WIDTH-32), game.rnd.integerInRange(0,WIDTH-32), 'bonusShovel');
            break;
        case 1:
            bonus = game.add.sprite(game.rnd.integerInRange(0,WIDTH-32), game.rnd.integerInRange(0,WIDTH-32), 'bonusTimer');
            break;
    }
    game.physics.arcade.enable(bonus);
    bonus.animations.add('bonusPlay', [0, 0, 0, 1, 1, 1], 25, true);
    bonus.animations.play('bonusPlay');
    music = game.add.audio('powerup_appear');
    music.play();
    game.time.events.add(10000*(1), playState.destroyBonus, this, bonus);
    game.time.events.start(1000*(1));
},
destroyBonus(bonus){
    bonus.kill();
},
pickBonusType(){
    switch(bonus.key){
        case "bonusShovel":
            playState.pickShovelBonus();
            break;
        case "bonusTimer":
            playState.pickTimerBonus();
            break;
    }
},
pickShovelBonus(){
    var removedBricks=[];
    for (var i=0; i<bricks.length; i++){
        newSteel=bricks.getAt(i);
        if (newSteel.x-base.x>=-16 && newSteel.x-base.x<=32 && newSteel.y-base.y>=-16 && newSteel.y-base.y<=16){
            removedBricks.push(newSteel);
            newSteel = game.add.sprite(bricks.getAt(i).x, bricks.getAt(i).y, 'steel');
            steels.add(newSteel);
        }
    }
    for (var i=0; i<removedBricks.length; i++){
        bricks.remove(removedBricks[i]);
    }
    steelsLength=steels.length;
    game.physics.enable(steels);
    steels.setAll('body.moves', false);
    bonus.kill();
    music = game.add.audio('powerup_pick');
    music.play();
    game.time.events.add(10000, playState.detachShovel, this);
    game.time.events.start(1000);
},
detachShovel(){
    var removedSteels=[];
    for (var i=0; i<steels.length; i++){
        newBrick=steels.getAt(i);
        if (newBrick.x-base.x>=-16 && newBrick.x-base.x<=32 && newBrick.y-base.y>=-16 && newBrick.y-base.y<=16){
            removedSteels.push(newBrick);
            newBrick = game.add.sprite(steels.getAt(i).x, steels.getAt(i).y, 'brick');
            bricks.add(newBrick);
        }
    }
    for (var i=0; i<removedSteels.length; i++){
        steels.remove(removedSteels[i]);
    }
    game.physics.enable(bricks);
    bricks.setAll('body.moves', false);
},
pickTimerBonus(){
    bonus.kill();
    timer=true;
    music = game.add.audio('powerup_pick');
    music.play();
    game.time.events.add(10000, playState.stopTimer, this);
    game.time.events.start(1000);
},
stopTimer(){
    timer=false;
},
menuReturn () {
    this.game.world.removeAll();
    this.game.state.clearCurrentState();
    //this.game.state.remove(this.game.state.current);
    game.state.start('boot', true, true);
  }
}
Enemy = function (game, x, y, typeEnemy){
    this.tankType=typeEnemy;
    switch(this.tankType){
        case "std":
            Phaser.Sprite.call(this, game, x+3, y+3, 'enemyTankStd');
            this.speed=1;
            break;
        case "stdBonus":
            Phaser.Sprite.call(this, game, x+3, y+3, 'enemyTankStdBonus');
            this.speed=1;
            break;
        case "fast":
            Phaser.Sprite.call(this, game, x+3, y+3, 'enemyTankFast');
            this.speed=3;
            break;
    }
    this.myDirection=3;
    this.enemyBullet;
    this.enemyBullets=game.add.group();
    this.bulletExists=false;
    this.directionChange=game.rnd.integerInRange(300,700);
    this.startX=x-3;
    this.enableBody=true;
    this.scale.setTo(26/32, 26/32);
    game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.animations.add('enemyDown', [0, 1], 25, true);
    this.animations.add('enemyLeft', [2, 3], 25, true);
    this.animations.add('enemyRight', [4, 5], 25, true);
    this.animations.add('enemyUp', [6, 7], 25, true);
    if (!gameLoaded)
        enemiesAlive++;
    enemiesTotal--;
    this.movement=game.time.create(true);
    this.movement.loop(this.directionChange, playState.changeDirection, this, this);
    this.bulletMovement=game.time.create(true);
    this.bulletMovement.loop(this.directionChange*7, playState.createEnemyBullet, this, this);
};
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function () {
    if (enemiesAlive==3)
        gameLoaded=true;
    if (enemiesAlive<3 && gameLoaded && enemiesTotal>0){
        game.time.events.add(1000*(1), playState.createAppear, this, enemyPlace);
        game.time.events.start(1000*(1));
        enemiesAlive++;
    }
    game.physics.arcade.collide(bricks, this, playState.properBricksCollide, null, this);
    game.physics.arcade.collide(steels, this, playState.properBricksCollide, null, this);
    game.physics.arcade.collide(waters, this, playState.properBricksCollide, null, this);
    game.physics.arcade.collide(bullet, this, playState.bulletHitEnemy2);
    
    if (timer){
        if (this.body!=null){
            this.body.velocity.y=0;
            this.body.velocity.x=0;
        }
        this.animations.stop();
        this.movement.pause();
        this.bulletMovement.pause();
    }
    else {
        this.movement.resume();
        this.bulletMovement.resume();
    }
    if (this.body!=null){
        this.movement.start();
        this.bulletMovement.start();
    }
    else {
        this.movement.stop();
        this.bulletMovement.stop();
        this.destroy();
    }
    if (this.enemyBullet==undefined){
    }    
    else if (this.enemyBullet!=undefined)
    {
        game.physics.arcade.collide(this.enemyBullet, bricks, playState.killBrick, null, this);
        game.physics.arcade.collide(this.enemyBullet, steels, playState.killSteels, null, this);
        game.physics.arcade.collide(this.enemyBullet, player, playState.killPlayer, null, this);
        game.physics.arcade.collide(this.enemyBullet, base, playState.destroyBase, null, this);
    }
    };