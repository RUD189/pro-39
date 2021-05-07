var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;

var score;
var thin;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound
var g,gI;
var back;
var sun,so;
function preload(){
  trex_running = loadAnimation("trex1.png","trex2.png","trex3.png","trex4.png","trex5.png","trex6.png","trex7.png","trex8.png","trex9.png");
  trex_collided = loadAnimation("trexd.png");
  back = loadImage("backgroundImg.png");
  groundImage = loadImage("ground2.png");
  sun = loadImage("sun.png");
  cloudImage = loadImage("cloud.png");
  gI = loadImage("grounds.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4s.png");
  thin = loadFont("Lato-Thin.ttf");
  
   restartImg = loadImage("re.png")
  gameOverImg = loadImage("over.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(displayWidth, displayHeight - 150);
  
  trex = createSprite(displayWidth/4,displayHeight/2 + 200,20,50);
  
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 1.2; 
  

  ground = createSprite(displayWidth + 300,displayHeight/2+330,width,2);
  ground.addImage("ground",gI);
  ground.scale = 0.9;
 
  so = createSprite(displayWidth/2 + 500,displayHeight/2 - 300);
  so.addImage(sun);    
  so.scale = 0.3;
  
   gameOver = createSprite(width/2,height/2-80);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2 +120);
  restart.addImage(restartImg);
  
  gameOver.scale = 1.2;
  restart.scale = 0.17;
  
  invisibleGround = createSprite(displayWidth/2,displayHeight/2 + 250,width,40);
  invisibleGround.visible = false;
 
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  trex.setCollider("circle",10,0,30);
  trex.debug = false;
  
  score = 0;
  
}

function draw() {
  
  background(back);
  //displaying score   
 
  
  
  trex.depth = ground.depth;
  trex.depth = ground.depth + 1;
 
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //move the ground
    
   ground.velocityX = -(6 + 3*score/100);
    //scoring
score = score + Math.round(getFrameRate()/60);
    
    if(score > 0 && score % 200 === 0){
      checkPointSound.play();
    }
     
    if (ground.x < displayWidth/6 - 620){ 
      ground.x = displayWidth;
    }
    
    //jump when the space key is pressed
    if(touches.length > 0 || keyDown("space") && trex.y >= displayHeight/2 + 183) {
        trex.velocityY = -14;
      jumpSound.play();
      touches = [];
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
      dieSound.play();
        gameState = END;
    }

}

   else if (gameState === END) {

      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0;
     
      //change the trex animation
      trex.changeAnimation("collided", trex_collided);
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     
     if(mousePressedOver(restart)||touches.length > 0){
       reset();
       touches = [];
     }
     
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  drawSprites();

  textFont(thin);
  strokeWeight(2);
  stroke(1);
textSize(20);
text("'USE SPACE BAR TO JUMP'", displayWidth/2 - 700,displayHeight/2 -250);
textSize(25);
textFont(thin);
strokeWeight(2);
stroke(1);
text("Score : "+ score, displayWidth/2 - 700,displayHeight/2 - 280);
}

function reset(){
  
  gameState = PLAY;
  gameOver.visible = false;
     restart.visible = false;
  score = 0;
  obstaclesGroup.destroyEach();
   cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  
}

function spawnObstacles(){
 if (frameCount % 100 === 0){
   var obstacle = createSprite(camera.x+width/2 + 100, displayHeight/2 + 50,20,30);
   obstacle.velocityX = -(6 + 3*score/100); 
   obstacle.y = invisibleGround.y - 55 ;

    //generate random obstacles
    var rand = Math.round(random(1,5));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break; 
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle1);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.55;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
    
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 80 === 0) {
     cloud = createSprite(camera.x+width/2 + 100,displayHeight,40,10);
    cloud.y = Math.round(random(displayHeight/2,displayHeight/6));
    cloud.addImage(cloudImage);
    cloud.scale = 0.55;
    cloud.velocityX = ground.velocityX;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

