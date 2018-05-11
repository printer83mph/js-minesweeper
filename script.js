// dom stuff
var custominput;

// mouse stuff
var mouseX, mouseY, blockX, blockY;

// grid stuff
var canvas, ctx, size, bombs, visGrid, gridSize, blockSize;

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

  // window.requestAnimationFrame(drawGrid);
}

function bombsNear(x, y) {
  var bc = 0;
  for (var i = x-1; i < x + 2; i++) {
    for (var j = y-1; j < y + 2; j++) {
      for (var k in bombs) {
        if ([i,j] == bombs[k]) {bc++}
      }
      // if ([i, j] in bombs) {
      //   bc++;
      // } else {console.log([i,j].toString() + " not in bombs")}
    }
  }
  return bc;
}

function markSpot(x, y) {
  drawGrid();
}

function uncoverSpot(x, y) {
  if([x, y] in bombs) {
    endGame(false);
  }
  drawGrid();
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
  visGrid = makeGrid(gSize, 0);
  // re-place bombs
  bombs = [];
  var newJawn;
  for(var i = 0; i < 10; i++) {
    do {
      newJawn = [Math.floor(Math.random()*gridSize), Math.floor(Math.random()*gridSize)];
    } while (bombs.indexOf(newJawn) > -1);
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
