let pet;
let foods = [];
let petAnimations = {};
let foodDeathImages = {};
let gameState = "playing";
let deathTimer = 0;
let deathCause = "";
let cuteFont;

function preload() {
  // Load pet animations
  petAnimations.baby = loadImage('https://mimi1190.github.io/tamagotchi/baby.gif');
  petAnimations.teen = loadImage('https://mimi1190.github.io/tamagotchi/teen.gif');
  petAnimations.adult = loadImage('https://mimi1190.github.io/tamagotchi/adult.gif');
  petAnimations.dead = loadImage('https://mimi1190.github.io/tamagotchi/dead.gif');
  
  // Load custom death images
  foodDeathImages.milk = loadImage('https://mimi1190.github.io/tamagotchi/death_milk.gif');
  foodDeathImages.mash = loadImage('https://mimi1190.github.io/tamagotchi/death_mash.gif');
  foodDeathImages.burger = loadImage('https://mimi1190.github.io/tamagotchi/death_burger.gif');
  foodDeathImages.salad = loadImage('https://mimi1190.github.io/tamagotchi/death_salad.gif');
  foodDeathImages.cake = loadImage('https://mimi1190.github.io/tamagotchi/death_cake.gif');
  
  // Load cute font (replace with your font file)
  // cuteFont = loadFont('assets/cute-font.ttf');
}

function setup() {
  createCanvas(600, 600);
  textAlign(CENTER, CENTER);
  
  // Set cute font if loaded
  // if (cuteFont) textFont(cuteFont);
  
  initializePet();
  
  // Food configuration with death messages
  foods = [
    {name: "Milk", suitableStage: "baby", x: 100, y: 500, 
     deathMsg: "Lactose overload! Too much milk!"},
    {name: "Mash", suitableStage: "baby", x: 200, y: 500,
     deathMsg: "Mash explosion! Baby can't handle!"},
    {name: "Burger", suitableStage: "teen", x: 300, y: 500,
     deathMsg: "Burger choke! Oh no!"},
    {name: "Salad", suitableStage: "adult", x: 400, y: 500,
     deathMsg: "Too healthy?! Salad overdose!"},
    {name: "Cake", suitableStage: "adult", x: 500, y: 500,
     deathMsg: "Sugar rush! Ate too much cake!"}
  ];
}

function initializePet() {
  pet = {
    stage: "baby",
    health: 100,
    hunger: 50,
    age: 0,
    fedFoods: [],
    lastFood: null
  };
  gameState = "playing";
  deathTimer = 0;
  deathCause = "";
}

function draw() {
  // Soft pink background
  background(255, 240, 245);
  
  if (gameState === "playing") {
    updateGame();
    displayGame();
  } else {
    displayDeathScreen();
  }
}

function updateGame() {
  // Increase hunger and age every 60 frames
  if (frameCount % 60 === 0) {
    pet.hunger = min(pet.hunger + 1, 100);
    pet.age += 0.1;
  }

  checkGrowthStage();
  
  // Check health
  if (pet.health <= 0 && gameState !== "dead") {
    gameState = "dead";
    deathTimer = 0;
  }
}

function displayGame() {
  drawPet();
  drawStatusBars();
  drawFoodButtons();
  
  // Cute instruction text
  fill(150, 100, 120);
  textSize(18);
  text("Click food to feed your pet!", width/2, 450);
}

function drawPet() {
  push();
  translate(width/2, height/2 - 50);
  
  let img = petAnimations[pet.stage];
  imageMode(CENTER);
  image(img, 0, 0, 200, 200);
  
  // Hungry message
  if (pet.hunger > 80) {
    drawSpeechBubble("I'm so hungry...");
  }
  pop();
}

function drawStatusBars() {
  // Pastel health bar (soft red)
  fill(255, 150, 150);
  rect(50, 50, map(pet.health, 0, 100, 0, 200), 20, 10);
  
  // Pastel hunger bar (soft green)
  fill(150, 220, 150);
  rect(50, 80, map(pet.hunger, 0, 100, 0, 200), 20, 10);
  
  // Cute status labels
  fill(120, 80, 100); // Soft purple text
  textSize(14);
  text(`Health: ${pet.health}`, 150, 65);
  text(`Hunger: ${pet.hunger}`, 150, 95);
  text(`Age: ${pet.age.toFixed(1)}`, 150, 125);
  text(`Stage: ${pet.stage}`, 150, 155);
}

function drawFoodButtons() {
  for (let food of foods) {
    // Pink food buttons
    fill(255, 180, 200); // Light pink
    stroke(220, 120, 150); // Pink border
    strokeWeight(2);
    rect(food.x-40, food.y-20, 80, 40, 15); // Rounded corners
    
    // Button text
    fill(120, 60, 80); // Dark pink text
    noStroke();
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
      return;
    }
  }
}

function feedPet(food) {
  pet.lastFood = food.name.toLowerCase();
  
  if (food.suitableStage !== pet.stage) {
    pet.health -= 30;
    deathCause = food.deathMsg;
    
    // Check if this wrong food caused death
    if (pet.health <= 0) {
      gameState = "dead";
    }
  } else {
    pet.hunger = max(0, pet.hunger - 20);
    pet.health = min(100, pet.health + 10);
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

function displayDeathScreen() {
  // Soft pink background
  background(255, 230, 240);
  
  // Display appropriate death image
  if (foodDeathImages[pet.lastFood]) {
    imageMode(CENTER);
    image(foodDeathImages[pet.lastFood], width/2, height/2 - 50, 300, 300);
  } else {
    image(petAnimations.dead, width/2, height/2 - 50, 200, 200);
  }
  
  // Death message
  fill(220, 80, 100); // Soft red
  textSize(24);
  text(deathCause || "Oh no! Your pet died!", width/2, height/2 + 120);
  
  // Restart prompt
  if (deathTimer > 180) { // After 3 seconds
    fill(150, 100, 120);
    textSize(18);
    text("Click anywhere to restart", width/2, height/2 + 170);
  }
  
  deathTimer++;
}

function drawSpeechBubble(text) {
  push();
  fill(255);
  stroke(200);
  strokeWeight(1);
  let bubbleWidth = textWidth(text) + 30;
  rect(-bubbleWidth/2, -150, bubbleWidth, 40, 20);
  triangle(0, -110, -10, -120, 10, -120);
  fill(120, 80, 100);
  noStroke();
  text(text, 0, -130);
  pop();
}

function mouseClicked() {
  if (gameState !== "playing" && deathTimer > 180) {
    initializePet();
  }
}
