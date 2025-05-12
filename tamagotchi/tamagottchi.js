let pet;
let foods = [];
let petAnimations = {};
let gameState = "playing";
let deathTimer = 0; // 死亡状态计时器

function preload() {
  // 加载你的GIF动画
  petAnimations.baby = loadImage('MiMi1190.github.io/tamagotchi/baby.gif');
  petAnimations.teen = loadImage('https://mimi1190.github.io/tamagotchi/teen.gif');
  petAnimations.adult = loadImage('https://mimi1190.github.io/tamagotchi/adult.gif');
  petAnimations.dead = loadImage('https://mimi1190.github.io/tamagotchi/dead.gif');
}

function setup() {
  createCanvas(600, 600);
  textAlign(CENTER, CENTER);
  
  initializePet();
  
  // 食物配置
  foods = [
    {name: "Milk", suitableStage: "baby", x: 100, y: 500},
    {name: "Mash", suitableStage: "baby", x: 200, y: 500},
    {name: "Burger", suitableStage: "teen", x: 300, y: 500},
    {name: "Salad", suitableStage: "adult", x: 400, y: 500},
    {name: "Cake", suitableStage: "adult", x: 500, y: 500}
  ];
}

function initializePet() {
  pet = {
    stage: "baby",
    health: 100,
    hunger: 50,
    age: 0,
    fedFoods: []
  };
  gameState = "playing";
  deathTimer = 0;
}

function draw() {
  background(255);
  
  if (gameState === "playing") {
    updateGame();
    displayGame();
  } else {
    // 死亡状态至少保持3秒
    if (gameState === "dead") {
      deathTimer++;
      if (deathTimer > 180) { // 3秒后允许重启
        displayResult(true);
      } else {
        displayResult(false);
      }
    } else {
      displayResult(true);
    }
  }
}

function updateGame() {
  // 每60帧增加饥饿和年龄
  if (frameCount % 60 === 0) {
    pet.hunger = min(pet.hunger + 1, 100);
    pet.age += 0.1;
  }

  checkGrowthStage();
  
  // 检查健康状态
  if (pet.health <= 0 && gameState !== "dead") {
    gameState = "dead";
    deathTimer = 0;
  }
}

function displayGame() {
  drawPet();
  drawStatusBars();
  drawFoodButtons();
  
  // 显示简单提示
  fill(0);
  textSize(16);
  text("Click food to feed", width/2, 450);
  text("Match food to growth stage", width/2, 480);
}

function drawPet() {
  push();
  translate(width/2, height/2 - 50);
  
  let img = petAnimations[pet.stage];
  if (gameState === "dead") img = petAnimations.dead;
  
  imageMode(CENTER);
  // 调整GIF显示大小
  image(img, 0, 0, 200, 200);
  pop();
}

function drawStatusBars() {
  // 健康条
  fill(255, 100, 100);
  rect(50, 50, map(pet.health, 0, 100, 0, 200), 20);
  
  // 饥饿条
  fill(100, 200, 100);
  rect(50, 80, map(pet.hunger, 0, 100, 0, 200), 20);
  
  // 标签
  fill(0);
  textSize(14);
  text(`Health: ${pet.health}`, 150, 65);
  text(`Hunger: ${pet.hunger}`, 150, 95);
  text(`Age: ${pet.age.toFixed(1)}`, 150, 125);
  text(`Stage: ${pet.stage}`, 150, 155);
}

function drawFoodButtons() {
  for (let food of foods) {
    // 绘制食物按钮
    fill(220);
    rect(food.x-40, food.y-20, 80, 40, 5);
    fill(0);
    textSize(14);
    text(food.name, food.x, food.y);
  }
}

function mousePressed() {
  if (gameState !== "playing") return;

  for (let food of foods) {
    if (mouseX > food.x-40 && mouseX < food.x+40 && 
        mouseY > food.y-20 && mouseY < food.y+20) {
      feedPet(food);
      return; // 只处理一个食物点击
    }
  }
}

function feedPet(food) {
  if (food.suitableStage !== pet.stage) {
    pet.health -= 30; // 喂错食物扣30健康值
  } else {
    pet.hunger = max(0, pet.hunger - 20); // 正确喂食减20饥饿值
    pet.health = min(100, pet.health + 10); // 加10健康值
  }
}

function checkGrowthStage() {
  if (pet.age > 5 && pet.stage === "baby") {
    pet.stage = "teen";
  } else if (pet.age > 10 && pet.stage === "teen") {
    pet.stage = "adult";
  } else if (pet.age > 15) {
    gameState = "completed";
  }
}

function displayResult(canRestart) {
  background(255);
  
  // 显示宠物GIF
  imageMode(CENTER);
  let resultImg = gameState === "dead" ? petAnimations.dead : petAnimations.adult;
  image(resultImg, width/2, height/2 - 50, 200, 200);
  
  // 显示结果文本
  textSize(32);
  fill(255, 0, 0);
  text(gameState === "dead" ? "GAME OVER!" : "CONGRATULATIONS!", width/2, height/2 + 100);
  
  // 只在允许时显示重启提示
  if (canRestart) {
    textSize(16);
    fill(0);
    text("Click to restart", width/2, height/2 + 150);
  }
}

function mouseClicked() {
  // 只有死亡状态超过3秒或游戏完成才能重启
  if (gameState !== "playing" && (gameState !== "dead" || deathTimer > 180)) {
    initializePet();
  }
}
