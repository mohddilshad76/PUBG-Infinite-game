var PLAY = 1;
var END = 0;
var gameState = PLAY;

var pubg, pubg_running, pubg_collided;
var ground,grassGround, groundImage;

var helicopterGroup, helicopterImage;
var aeroplaneGroup,aeroplaneImage;
var enemyGroup, enemy1, enemy2, enemy3, enemy4;
var backgroundImg
var score=0;
var jumpSound, collidedSound, helicopterSound;
var aeroplaneSound;
var gameOver, restart;


function preload(){
  aeroplaneSound = loadSound("aeroplane.mp3");
  helicopterSound = loadSound("helicopter-fly-over-03.mp3");
  jumpSound = loadSound("we_ak47s_lb_04_hpx.mp3");
  collidedSound = loadSound("assets/sounds/collided.wav");
  
  backgroundImg = loadImage("pubgB.jpg");
  
  pubg_running = loadAnimation("pubg0.png");
  pubg_collided = loadAnimation("pdrop.png");
  
  groundImage = loadImage("pubg ground.png");
  
  helicopterImage = loadImage("pubg helicopter.png");
  aeroplaneImage = loadImage("aero-removebg-preview.png")
  enemy1 = loadImage("penemy1.png");
  enemy2 = loadImage("penemy2.png");
  enemy3 = loadImage("penemy3.png");
  enemy4 = loadImage("pdrop.png");
  
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
 
  pubg = createSprite(50,height-70,20,50);
  
  
  pubg.addAnimation("running", pubg_running);
  pubg.addAnimation("collided", pubg_collided);
  pubg.setCollider('circle',0,0,350)
  pubg.scale = 0.1
  
  
  grassGround = createSprite(width/2,height-10,width,125);  
 
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
 
  // invisibleGround.visible =false

  helicopterGroup = new Group();
  aeroplaneGroup = new Group();
  enemyGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(backgroundImg);
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && pubg.y  >= height-120) {
      jumpSound.play( )
      pubg.velocityY = -15;
       touches = [];
    }
    
    pubg.velocityY = pubg.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    pubg.collide(grassGround);
    spawnEnemy();
    spawnHelicopter();
    spawnAeroplane();
  
  
    if(enemyGroup.isTouching(pubg)){
        collidedSound.play()
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
  
    ground.velocityX = 0;
    pubg.velocityY = 0;
    enemyGroup.setVelocityXEach(0);
    helicopterGroup.setVelocityXEach(0);
    
  
    pubg.changeAnimation("collided",pubg_collided);
    
   
    enemyGroup.setLifetimeEach(-1);
    helicopterGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
      jumpSound.play();
    }
  }
  
  
  drawSprites();
}


function spawnEnemy() {
  if(frameCount % 60 === 0) {
    var enemy = createSprite(600,height-95,20,30);
    enemy.setCollider('circle',0,0,45)
    // enemy.debug = true
  
    enemy.velocityX = -(6 + 3*score/100);
    
   
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: enemy.addImage(enemy1);
              break;
      case 2: enemy.addImage(enemy2);
              break;
      case 3: enemy.addImage(enemy3);
              break;
      case 4: enemy.addImage(enemy4);
              break;
      default: break;
    }
    
       
    enemy.scale = 0.3;
    enemy.lifetime = 300;
    enemy.depth = enemy.depth;
    pubg.depth +=1;
    //add each helicopter to the group
    enemyGroup.add(enemy);        
  }
}

function spawnHelicopter() {

   if (frameCount % 400 === 0) {
    helicopter = createSprite(1000,200,40,10);
    helicopter.y = Math.round(random(100,400));
    helicopter.addImage(helicopterImage);
    helicopter.scale = 0.5;
    helicopter.velocityX = -5;
    helicopterSound.play();
    helicopter.lifetime = 200 ;
    
    //adjust the depth
    helicopter.depth = helicopter.depth;
    pubg.depth = pubg.depth + 2;
    
    //adding cloud to the group
   helicopterGroup.add(helicopter);
    }
}

function spawnAeroplane() {

   if (frameCount % 200 === 0) {
    aeroplane = createSprite(10,200,40,1000);
    aeroplane.y = Math.round(random(30,390));
    aeroplane.addImage(aeroplaneImage);
    aeroplane.scale = 0.6;
    aeroplane.velocityX = 5;
    aeroplaneSound.play();
    aeroplane.lifetime = 200 ;
    
  
    aeroplane.depth = aeroplane.depth;
    pubg.depth = pubg.depth + 10;
    
    //adding cloud to the group
   aeroplaneGroup.add(aeroplane);
    }
}


function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  jumpSound.stop();
  helicopterGroup.destroyEach();
  helicopterSound.stop();
  aeroplaneGroup.destroyEach();
  aeroplaneSound.stop();
  enemyGroup.destroyEach();
  
  pubg.changeAnimation("running",pubg_running);
  
  score = 0;
  
}
