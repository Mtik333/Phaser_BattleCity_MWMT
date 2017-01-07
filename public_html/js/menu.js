/* globals game, Phaser */
var startSprite;
var selectLevel;
var firstLevel;
var secondLevel;
var thirdLevel;
var scoreShow;
var loadedStart = false;
var selectTank;
var levelImage;
var cursors;
var selection=1; 
var enterKey;
var menuWIDTH=512;
var menuHEIGHT=416;
var line=[]; 

let menuState = {
  create () {
    // display game name
    selection=1;
    startSprite = game.add.image(menuWIDTH/2, HEIGHT, 'battle_city');
    startSprite.scale.setTo(0.5, 0.5);
    startSprite.anchor.setTo(0.5, 0);
    var text="SELECT LEVEL\nPRESS ENTER TO START";
    var style = { font: "bold 13px Press Start", fill: "#ffffff", align: "center"};
    selectLevel = game.add.text(menuWIDTH/2, HEIGHT+80, text, style);
    selectLevel.anchor.setTo(0.5, 0);
    firstLevel = game.add.text(32+(menuWIDTH/4), HEIGHT+180, "LEVEL 1", style);
    firstLevel.anchor.setTo(1, 0);
    secondLevel = game.add.text(32+(menuWIDTH/4), HEIGHT+280, "LEVEL 2", style);
    secondLevel.anchor.setTo(1, 0);
    thirdLevel = game.add.text(32+(menuWIDTH/4), HEIGHT+380, "LEVEL 3", style);
    thirdLevel.anchor.setTo(1, 0);
    selectTank = game.add.image(firstLevel.x-48-firstLevel.width, firstLevel.y-10, 'tankSelect');
    selectTank.anchor.setTo(0, 0);
    scoreShow = game.add.text(menuWIDTH/2, HEIGHT+150, "HI-SCORE: ", style);
    scoreShow.anchor.setTo(0, 0);
    selectTank.visible=false;
    scoreShow.visible=false;
    console.log(game.cache.getText('scores'));
    // explain how to start the game
//    let startGame = game.add.text(
//      game.world.centerX, 250, 'press enter to start',
//      { font: '20px Arial', fill: '#ffffff' }
//    )
//    startGame.anchor.setTo(0.5, 0.5)
    cursors = game.input.keyboard.createCursorKeys();
    // create Phaser keyboard hotkey
    enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    // start game on press enter
    //enterKey.onDown.addOnce(this.startGame, this)
  },
  getScore(){
      //sessionStorage.setItem("Level1_score", line[0]);
      //sessionStorage.setItem("Level2_score", line[1]);
      //sessionStorage.setItem("Level3_score", line[2]);
      line=game.cache.getText('scores').split('\n');
      console.log(game.cache.getText('scores'));
      //scoreShow.text=line[selection-1];
      var testDivide=line[selection-1].split(':');
      if (sessionStorage.getItem("Level"+selection+"_score")!=null){
         //var testDivide=sessionStorage.getItem("Level"+selection+"_score").split(':');
         scoreShow.text="HI-SCORE:"+sessionStorage.getItem("Level"+selection+"_score");
      }
      else scoreShow.text="HI-SCORE:"+testDivide[1];
      console.log(scoreShow.text);
      
//line[2]="blabla";
      //game.cache.addText('scores', './libs/scores.txt', line);
      //console.log(game.cache.getText('scores'));
  },
  update(){
    if (startSprite.y>(HEIGHT-startSprite.height)/8-32){
        startSprite.y--;
        startSprite.y--;
        selectLevel.y--;
        selectLevel.y--;
        firstLevel.y--;
        firstLevel.y--;
        secondLevel.y--;
        secondLevel.y--;
        thirdLevel.y--;
        thirdLevel.y--;
        scoreShow.y--;
        scoreShow.y--;
    }
    else {
        
        loadedStart=true;
        //console.log(firstLevel.height);
        if (!selectTank.visible)
            this.makeTankVisible();
    }
    if (loadedStart){
        enterKey.onDown.addOnce(this.startGame, this)
        if (cursors.down.isDown && cursors.down.downDuration(10) && selection < 3)
        {
            selectTank.y+=100;
            selection++;
            this.getScore();
            levelImage.loadTexture('level'+selection+'_pic');
//            levelImage = game.add.image(firstLevel.x+80, firstLevel.y-8, 'level'+selection+'_pic');
//            levelImage.scale.setTo(180/416, 180/416);
        }
        if (cursors.up.isDown && cursors.up.downDuration(10) && selection > 1)
        {
            selectTank.y-=100;
            selection--;
            this.getScore();
            levelImage.loadTexture('level'+selection+'_pic');
//            levelImage = game.add.image(firstLevel.x+80, firstLevel.y-8, 'level'+selection+'_pic');
//            levelImage.scale.setTo(180/416, 180/416);
        }
        //cursors.down.onDown.addOnce(this.moveTankSelectDown, this)
    }
    
  },
  makeTankVisible(){
      selectTank = game.add.image(firstLevel.x-48-firstLevel.width, firstLevel.y-10, 'tankSelect');
      selectTank.visible=true;
      levelImage = game.add.image(firstLevel.x+64, firstLevel.y, 'level1_pic');
      levelImage.scale.setTo(220/416, 220/416);
      this.getScore();
      scoreShow.visible=true;
  },
  moveTankSelectDown(){
      selectTank.y+=60;
  },
  startGame () {
    game.state.remove(playState);
    game.state.add('play', playState);
    //game.state.clearCurrentState();
    game.state.start('play', true, false, selection);
  }
}
