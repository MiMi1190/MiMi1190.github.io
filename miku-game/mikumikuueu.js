let nege, virus, miku;
let negiX = 300, negiY = 300;
let negiSize = 60; // 大葱保持固定大小
let score = 0;
let gameState = "L1";
let viruses = [];
let speed = 1.5; // 初始速度降低

function preload() {
  nege = loadImage('https://mimi1190.github.io/Nege.png');
  virus = loadImage('https://mimi1190.github.io/snow%20rabbit.png');
  miku = loadImage('https://mimi1190.github.io/Miku%20Ha.png');
}

function setup() {
  createCanvas(600, 600);
  textAlign(CENTER);
  textSize(20);
  angleMode(DEGREES);
  imageMode(CENTER);
  frameRate(60);
}

function draw() {
  background(160, 224, 224);
  image(miku, width/2, height/2, 200, 200);
  
  switch(gameState) {
    case "L1": levelOne(); break;
    case "L2": levelTwo(); break;
    case "L3": levelThree(); break;
  }
  
  fill(255);
  text("Collecting negi for Miku!: " + score, width/2, 40);
  textSize(14);
  text("Be careful! The snow rabbit will catch you! If they catch you, you will lost all the negi!", width/2, height-30);
}

// ===== 修改点1：关卡难度调整 =====
function levelOne() {
  handleNegi();
  if (score >= 3) { // 降低升级需求
    gameState = "L2";
  }
}

function levelTwo() {
  handleViruses();
  handleNegi();
  if (score >= 6) { // 降低升级需求
    gameState = "L3";
  }
}

function levelThree() {
  handleMovingNegi();
  handleViruses();
}

// ===== 修改点2：移除大葱缩小逻辑 =====
function handleMovingNegi() {
  negiX += random(-2, 2); // 移动幅度减小
  negiY += random(-2, 2);
  negiX = constrain(negiX, 50, width-50);
  negiY = constrain(negiY, 50, height-50);
  handleNegi();
  // 移除 negiSize 变化逻辑
}

// ===== 修改点3：病毒生成频率降低 =====
function spawnViruses() {
  let spawnRate = gameState === "L3" ? 90 : 120; // 生成间隔延长
  if (frameCount % spawnRate === 0) {
    viruses.push({
      x: random(width),
      y: random(height),
      size: gameState === "L3" ? 40 : 30 // 病毒尺寸减小
    });
  }
}

// ===== 修改点4：病毒速度调整 =====
function updateViruses() {
  for (let i = viruses.length-1; i >= 0; i--) {
    let v = viruses[i];
    let angle = atan2(mouseY - v.y, mouseX - v.x);
    v.x += cos(angle) * speed;
    v.y += sin(angle) * speed;
    
    if (dist(v.x, v.y, mouseX, mouseY) < 40) { // 碰撞判定范围增大
      score = max(0, score-1);
      viruses.splice(i, 1);
    }
    
    image(virus, v.x, v.y, v.size, v.size);
  }
  speed = gameState === "L3" ? 2 : 1.5; // 最终速度降低
}

// ===== 以下保持不变 =====
function handleNegi() {
  if (checkNegiCollision()) {
    resetNegi();
    score++;
  }
  drawNegi();
}

function handleViruses() {
  spawnViruses();
  updateViruses();
}

function resetNegi() {
  negiX = random(100, width-100);
  negiY = random(100, height-100);
}

function checkNegiCollision() {
  return dist(negiX, negiY, mouseX, mouseY) < negiSize/2;
}

function drawNegi() {
  push();
  translate(negiX, negiY);
  rotate(frameCount % 360 * (gameState === "L3" ? 2 : 1.5)); // 旋转速度降低
  image(nege, 0, 0, negiSize, negiSize);
  pop();
}
