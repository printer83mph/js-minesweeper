// dom stuff
var custominput;

// mouse stuff
var mouseX, mouseY, blockX, blockY;

// grid stuff
var canvas, ctx, size, bombs, visGrid, gridSize, blockSize, gameState;

// bombs

function drawGrid() {
  ctx.fillStyle = "#d8d8d8";
  ctx.fillRect(0, 0, size, size);

  blockX = Math.floor(mouseX/blockSize);
  blockY = Math.floor(mouseY/blockSize);

  if (mouseX > 0 && mouseX < size && mouseY > 0 && mouseY < size) {
    ctx.fillStyle ="#e0e0e0";
    ctx.fillRect(Math.floor(mouseX/blockSize)*blockSize, Math.floor(mouseY/blockSize)*blockSize, blockSize, blockSize);
  }

  // draw divs
  ctx.lineWidth = 1;
  for (var i = 1; i < gridSize; i++) {
    // draw col dividers
    ctx.beginPath();
    ctx.moveTo(i * blockSize, 0);
    ctx.lineTo(i * blockSize, size);
    // draw row dividers
    ctx.moveTo(0, i * blockSize);
    ctx.lineTo(size, i * blockSize);
    ctx.stroke();
  }

  if (gameState == -1) {
    ctx.fillStyle = "#d02020"
    for (b in bombs) {
      ctx.beginPath();
      ctx.ellipse((bombs[b][0] + .5) * blockSize, (bombs[b][1] + .5) * blockSize, blockSize/3, blockSize/3, 0, 0, Math.PI*2);
      ctx.fill();
    }
  }

  // window.requestAnimationFrame(drawGrid);
}

function isBomb(x, y) {
  for (b in bombs) {
    if (x === bombs[b][0] && y === bombs[b][1]) {
      return true;
    }
  }
  return false;
}

function bombsNear(x, y) {
  var bc = 0;
  for (var i = x-1; i < x + 2; i++) {
    for (var j = y-1; j < y + 2; j++) {
      if (isBomb(i, j)) {bc++}
    }
  }
  return bc;
}

function markSpot(x, y) {
  // console.log("todo: mark spot");

  var toCheckAround = [[x, y]];
  while (toCheckAround.length > 0) {
    for (var spot = toCheckAround.length - 1; i >= 0; i--) {

      // TODO: fill toCheckAround with new spots (cannot be bombs/next to bombs) and update visgrid

      toCheckAround.splice(spot,1);
    }
  }

  drawGrid();
}

function uncoverSpot(x, y) {
  if (gameState === 0) {
    console.log(x, y);
    if(isBomb(x,y)) {
      gameState = -1;
      drawGrid();
    }
  }
}

function makeGrid(gSize, fill) {
  // output grid
  var out = [];
  // add all the zeroes
  for (var i = 0; i < gridSize; i++) {
    var thisRow = [];
    for (var j = 0; j < gridSize; j++) {
      thisRow.push(fill);
    }
    out.push(thisRow);
  }

  return out;
}

function resizeGrid(gSize) {
  // refresh sizes
  gridSize = gSize;
  blockSize = size/gridSize;
  // make visGrid
  visGrid = makeGrid(gSize, -1);
  gameState = 0;
  // re-place bombs
  bombs = [];
  var newJawn;
  for(var i = 0; i < gridSize**2 / 10; i++) {
    do {
      newJawn = [Math.floor(Math.random()*gridSize), Math.floor(Math.random()*gridSize)];
    } while (newJawn in bombs);
    bombs.push(newJawn);
  }
  drawGrid();
}

window.onload = function() {
  custominput = document.getElementById("custominput");

  // game stuff
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  size = canvas.width;
  resizeGrid(8);

  // canvas stuff
  ctx.strokeStyle = "#ffffff"

  // hover stuff
  document.addEventListener("mousemove", function(e) {
    mouseX = e.clientX - canvas.offsetLeft;
    mouseY = e.clientY - canvas.offsetTop;
    drawGrid();
  });

  // click stuff
  document.addEventListener("contextmenu", function(e) {
    if (mouseX > 0 && mouseX < size && mouseY > 0 && mouseY < size) {
      e.preventDefault();
      markSpot(blockX, blockY);
    }
  });

  document.addEventListener("click", function(e) {
    if (mouseX > 0 && mouseX < size && mouseY > 0 && mouseY < size) {
      e.preventDefault();
      uncoverSpot(blockX, blockY);
    }
  });

  drawGrid();
}
