function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES); // 切换角度制更直观
}

function draw() {
  // 1. background
  drawBackground();
  
  noStroke();
  
  // 2. body
  fill(230, 210, 255); // purple
  rect(200, 450, 200, 100, 20, 20, 0, 0); // body shape
  
  // 3. ponytail
  fill(255, 200, 220); 
  ellipse(150, 380, 120, 200); 
  ellipse(450, 380, 120, 200);
  
  // 4. head
  fill(255, 228, 181);
  ellipse(300, 310, 300, 300);
  
  // 5. front hair
  fill(255, 190, 210); 
  arc(300, 230, 270, 150, 180, 0, CHORD);
  
  // 6. 二次元眼睛系统 ---------------------------------------------------
  // 眼白
  fill(255);
  ellipse(250, 280, 60, 50); // 
  ellipse(350, 280, 60, 50);
  
  // 上眼线（黑色带弧度的厚眼皮）
  fill(0);
  beginShape();
  vertex(220, 265); // 左眼起点
  bezierVertex(230, 250, 270, 250, 280, 265); // 贝塞尔曲线画弧度
  vertex(280, 270);
  bezierVertex(270, 255, 230, 255, 220, 270);
  endShape(CLOSE);
  
  // 右眼对称复制
  beginShape();
  vertex(380, 265);
  bezierVertex(370, 250, 330, 250, 320, 265);
  vertex(320, 270);
  bezierVertex(330, 255, 370, 255, 380, 270);
  endShape(CLOSE);
  
  // 眼珠（带高光）
  fill(80); // 深灰眼珠
  ellipse(250, 285, 35, 35); 
  ellipse(350, 285, 35, 35);
  
  
  // 星星高光（调整到眼珠上）
  fill(255);
  star(240, 275, 5, 10, 4); // 左眼
  star(340, 275, 5, 10, 4);
  // -------------------------------------------------------------------
  
  // 7. 腮红（橘粉色区分于头发）
  fill(255, 180, 180);
  ellipse(200, 320, 40, 30);
  ellipse(400, 320, 40, 30);
  
  // 8. 微笑嘴（更二次元的简化画法）
  fill(255, 120, 150);
  arc(300, 350, 60, 30, 0, 180, CHORD);
  
  // 9. 大号水平蝴蝶结（使用圆角矩形+三角形组合）
  fill(255, 150, 200);
  // 中心结
  rect(270, 180, 60, 30, 15);
  // 左右飘带
  triangle(240,180, 270,195, 240,210); // 左
  triangle(340,180, 330,195, 360,210); // 右
}

// 背景装饰函数
function drawBackground() {
  // 渐变背景
  let bg1 = color(255, 245, 200); // 鹅黄
  let bg2 = color(255, 230, 230); // 粉
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(bg1, bg2, inter);
    fill(c);
    rect(0, y, width, 1);
  }
  
  // 随机装饰元素
  fill(255, 200, 150, 150); // 半透明橘色
  for (let i = 0; i < 20; i++) {
    let x = random(width);
    let y = random(height);
    let s = random(10, 30);
    if (random() > 0.5) {
      star(x, y, s*0.3, s, 4); // 四角星
    } else {
      // 简单五瓣花
      for (let j = 0; j < 5; j++) {
        ellipse(x + s*0.6 * cos(j*72), 
               y + s*0.6 * sin(j*72), 
               s*0.4, s*0.4);
      }
      fill(255, 150, 180, 150); // 花蕊粉色
      ellipse(x, y, s*0.3, s*0.3);
    }
  }
}

// 星星函数（优化版）
function star(x, y, radius1, radius2, npoints) {
  push();
  translate(x, y);
  beginShape();
  for (let i = 0; i < 360; i += 360/npoints) {
    let sx = cos(i) * radius2;
    let sy = sin(i) * radius2;
    vertex(sx, sy);
    sx = cos(i + 180/npoints) * radius1;
    sy = sin(i + 180/npoints) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
  pop();
}
