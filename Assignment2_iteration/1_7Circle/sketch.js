function setup() {
  createCanvas(400, 400);
  background(220)
  let numC = 7;
  let size = width/numC;
  let margin = 20
  
  for (let i = 0; i< width - margin; i = i + size){
    circle(i+size/2,width/2,size/2);
  }
}
