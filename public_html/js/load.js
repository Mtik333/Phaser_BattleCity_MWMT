/* globals game, Phaser */

let loadState = {
  preload () { 
      game.load.image('battle_city', './images/battle_city.png');
      game.load.image('tankSelect', './images/tank_player1_right_c0_t1.png');
      game.load.image('level1_pic', './maps/level1.png');
      game.load.image('level2_pic', './maps/level2.png');
      game.load.image('level3_pic', './maps/level3.png');
      game.load.text('scores', './libs/scores.txt');
      //game.load.tilemap('level1_bla', './maps/level1_final_3.json', null, Phaser.Tilemap.TILED_JSON);
      game.load.tilemap('level1', './maps/level1_final_3.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level2', './maps/level2_final_3.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level3', './maps/level3_final_3.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('bulletDown', './images/bullet_down.png');
    game.load.image('bulletLeft', './images/bullet_left.png');
    game.load.image('bulletRight', './images/bullet_right.png');
    game.load.image('bulletUp', './images/bullet_up.png');
    game.load.image('base', './images/base.png');
    game.load.image('base_destroyed', './images/base_destroyed.png');
    game.load.spritesheet('playerTankStd', './images/playerTankStandard.png', 32, 32);
    game.load.spritesheet('enemyTankStd', './images/enemyTankStandard.png', 32, 32);
    game.load.spritesheet('enemyTankStdBonus', './images/enemyTankStandardBonus.png', 32, 32);
    game.load.spritesheet('enemyTankFast', './images/enemyTankFast.png', 32, 32);
    game.load.spritesheet('bulletExplosion', './images/bullet_explosion.png', 32, 32);
    game.load.spritesheet('bigExplosion', './images/big_explosion.png', 64, 64);
    game.load.spritesheet('appear', './images/appear.png', 32, 32);
    game.load.spritesheet('bonusShovel', './images/myBonusShovel.png', 32, 32);
    game.load.spritesheet('bonusTimer', './images/myBonusTimer.png', 32, 32); 
    game.load.image('brick', './images/wall_brick.png');
    game.load.image('steel', './images/wall_steel.png');
    game.load.image('grass', './images/trees.png');
    game.load.image('water', './images/water_1.png');
    game.load.image('gameTiles', './images/tiles_blocks2.png');

    game.load.audio('bullet_hit_1', './sound/bullet_hit_1.ogg');
    game.load.audio('bullet_hit_2', './sound/bullet_hit_2.ogg');
    game.load.audio('bullet_shot', './sound/bullet_shot.ogg');
    game.load.audio('explosion_1', './sound/explosion_1.ogg');
    game.load.audio('explosion_2', './sound/explosion_2.ogg');
    game.load.audio('powerup_appear', './sound/powerup_appear.ogg');
    game.load.audio('powerup_pick', './sound/powerup_pick.ogg');
    game.load.audio('stage_start', './sound/stage_start.ogg');
    game.load.audio('pause', './sound/pause.ogg');
    game.load.image('enemiesLeft', './images/enemy.png');
    game.load.image('game_over', './images/game_over.png', 188, 68);
    game.load.image('key', './images/key.png');
    
  },
  create () {
    game.state.start('menu')
  }
}
