let paw, grab, car, carface, sideEYE;
let boom;
 
let fish = [];
let currentFrame = 0;
 
let bubble = [];
//let catchi = true;
let Ydistence = 50;
//let Xdistence = 15;
 
let fishSize = 150;
let baseSpeed = 0.6;
let fastSpeed = 10;
let minDis = 150;
let maxDis = 450;
let hoverRange = 70;
let clickMin = 5;
let clickMax = 20;
let sideEyeT = 60;
let tankEdge = 100;
 
let fishPos;
let FishVel;
let fishFacinL = true;
let dash = false;
let dashTarget;
 
let clickCount = 0;
let clicks = 10;
let sideEyeTimer = 0;
 
async function setup() {
  createCanvas(windowWidth, windowHeight);
 
  paw = await loadImage("paw.PNG");
  grab = await loadImage("grab.PNG");
  car = await loadImage("Car.PNG");
  carface = await loadImage("CarFace.PNG");
 
  fish[0] = await loadImage("fih1.PNG");
  fish[1] = await loadImage("fih2.PNG");
  fish[2] = await loadImage("fih3.PNG");
 
  sideEYE = await loadImage("SideEye.PNG");
  boom = new Audio("BOOM.mp3"); 
 
  
  fishPos = createVector(width / 2, height / 2);
  FishVel = p5.Vector.random2D();
  FishVel.setMag(baseSpeed);
 
  pickClicks();
 
  //frameRate(4);
 
  imageMode(CENTER);
  angleMode(DEGREES);
}
 
function draw() {
  background(181, 201, 235);
 
  //cat face
  tint(255, 127);
  image(car, width / 3, height - 200, 400, 400);
  let faceX = width / 3;
  let faceY = height - 200;
  let maxShift = 15;

  let offsetX = map(mouseX, 0, width, -maxShift, maxShift);
  let offsetY = map(mouseY, 0, height, -maxShift, maxShift);

  image(carface, faceX + offsetX, faceY + offsetY, 400, 400);
 
  //bubbles
  for (let i = 0; i < bubble.length; i++) {
    bubble[i].show();
    bubble[i].update();
 
    if (bubble[i].pop == true) {
      bubble.splice(i, 1);
      i--;
    }
  }
 
  //fish
  tint(255);
  updateFish();
  drawFish();
 
  //tank glass
  stroke(255);
  strokeWeight(100);
  fill(181, 201, 235, 90);
  rect(0, 0, windowWidth, windowHeight, 80);
 
  //cat hand
  let r = map(mouseX, 0, width, 20, -20);
 
  let xdistence = map(r, 20, -20, -25, 25);
  //let ydistence = map(r,-30, 30, -20,20)
  stroke(0, 0, 0);
  strokeWeight(134);
  line(
    mouseX + xdistence,
    mouseY + Ydistence,
    windowWidth / 2,
    windowHeight + 100
  );
 
  if (mouseIsPressed) {
    push();
    translate(mouseX, mouseY);
    rotate(r);
    image(grab, 0, 0, 180, 180);
    pop();
  } else {
    push();
    translate(mouseX, mouseY);
    rotate(r);
    image(paw, 0, 0, 180, 180);
    pop();
  }
 
  stroke(255);
  strokeWeight(128);
  line(
    mouseX + xdistence,
    mouseY + Ydistence,
    windowWidth / 2,
    windowHeight + 100
  );
}
 
// ---------------- FISH ------------- 
function pickClicks() {
  clicks = int(random(clickMin, clickMax));
}
 
function updateFish() {
  if (sideEyeTimer > 0) {
    sideEyeTimer--;
    if (sideEyeTimer == 0) {
      clickCount = 0;
      pickClicks(); 
    }
  }
  checkForDash();
  if (dash) {
    dashToTarget();
  } else {
    wander();
  }
 
  fishPos.add(FishVel);
  bounceOffEdges();
 
  if (FishVel.x > 0.02) {
    fishFacinL = false;
  } else if (FishVel.x < -0.02) {
    fishFacinL = true;
  }
 
  if (frameCount % 20 == 0) {
    currentFrame++;
  }
  if (currentFrame >= fish.length) {
    currentFrame = 0;
  }
}
 

function wander() {
  if (random(1) < 0.04) {
    let a = random(-0.4, 0.4); 
    let vx = FishVel.x * Math.cos(a) - FishVel.y * Math.sin(a);
    let vy = FishVel.x * Math.sin(a) + FishVel.y * Math.cos(a);
    FishVel.set(vx, vy);
  }
  FishVel.setMag(baseSpeed);
}
 
function checkForDash() {
  let d = dist(mouseX, mouseY, fishPos.x, fishPos.y);
  if (!dash && d < hoverRange && mouseIsPressed) {
    dash = true;
    for (let tries = 0; tries < 30; tries++) {
      let a = random(TWO_PI);
      let howFar = random(minDis, maxDis);
      let tx = fishPos.x + Math.cos(a) * howFar;
      let ty = fishPos.y + Math.sin(a) * howFar;
 
      dashTarget = createVector(tx, ty);
 
      if (
        tx > tankEdge &&
        tx < width - tankEdge &&
        ty > tankEdge &&
        ty < height - tankEdge
      ) {
        break;
      }
    }
    dashTarget.x = constrain(dashTarget.x, tankEdge, width - tankEdge);
    dashTarget.y = constrain(dashTarget.y, tankEdge, height - tankEdge);
  }
}
function dashToTarget() {
  let toTarget = p5.Vector.sub(dashTarget, fishPos);
 
  if (toTarget.mag() < fastSpeed) {
    dash = false;
    FishVel = p5.Vector.random2D();
    FishVel.setMag(baseSpeed);
  } else {
    toTarget.setMag(fastSpeed);
    FishVel = toTarget;
  }
}
 
function bounceOffEdges() {
  if (fishPos.x < tankEdge) {
    fishPos.x = tankEdge;
    FishVel.x *= -1;
  }
  if (fishPos.x > width - tankEdge) {
    fishPos.x = width - tankEdge;
    FishVel.x *= -1;
  }
  if (fishPos.y < tankEdge) {
    fishPos.y = tankEdge;
    FishVel.y *= -1;
  }
  if (fishPos.y > height - tankEdge) {
    fishPos.y = height - tankEdge;
    FishVel.y *= -1;
  }
}
 
function drawFish() {
  push();
  if (sideEyeTimer > 0) {
    translate(fishPos.x + random(-2, 2), fishPos.y + random(-2, 2));
    if (!fishFacinL) {
      scale(-1, 1);
    }
    image(sideEYE, 0, 0, fishSize * 2, fishSize * 2);
  } else {
    translate(fishPos.x, fishPos.y);
    if (!fishFacinL) {
      scale(-1, 1);
    }
    image(fish[currentFrame], 0, 0, fishSize, fishSize);
  }
  pop();
}
 
function mousePressed() {
  // bubbles (your original code)
  let randomOooo = int(random(3, 10));
  for (let i = 0; i < randomOooo; i++) {
    bubble.push(new oooo(mouseX, mouseY));
  }
 
  if (sideEyeTimer == 0 && dist(mouseX, mouseY, fishPos.x, fishPos.y) < hoverRange) {
    clickCount++;
    if (clickCount >= clicks) {
      sideEyeTimer = sideEyeT;
      dash = false;
      if (boom) {
        boom.currentTime = 0;
        boom.play();
      }
    }
  }
}
 
class oooo {
  constructor(xpos, ypos) {
    //position
    this.x = xpos;
    this.y = ypos;
    //velocity
    this.velX = random(-2, 2);
    this.velY = random(-2, 2);
 
    this.size = random(3, 15);
 
    this.age = random(300, 800);
 
    this.pop = false;
  }
  update() {
    this.x += this.velX;
    this.y += this.velY;
 
    if (this.x > width - this.size / 2) {
      this.velX = -this.velX;
    }
    if (this.x < this.size / 2) {
      this.velX = -this.velX;
    }
    if (this.y > height - this.size / 2) {
      this.velY = -this.velY;
    }
    if (this.y < this.size / 2) {
      this.velY = -this.velY;
    }
    if (this.age > 0) {
      this.age -= 2;
    } else {
      this.pop = true;
    }
  }
 
  show() {
    //noStroke();
    stroke(0, 80);
    strokeWeight(0.5);
    fill(255, 90);
    ellipse(this.x, this.y, this.size);
  }
}