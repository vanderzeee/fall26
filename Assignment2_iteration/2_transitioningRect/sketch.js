function setup() {
  createCanvas(400, 400);
  background(220);

  let rectNum = 20;
  let margin = 20;
  let size = width / rectNum;

  for (let i = margin; i < width - margin; i = i + size) {
    
    fill(i);
    rect(i, height - i -margin, size, i);
  }
}

