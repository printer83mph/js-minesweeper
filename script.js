// dom stuff
var custominput, title;

// mouse stuff
var mouseX, mouseY, blockX, blockY;

// grid stuff
var canvas, ctx, size, bombs, visGrid, gridSize, blockSize, gameState;

// bombs

function drawGridIfNeeded() {
  if (Math.floor(mouseX/blockSize) != blockX || Math.floor(mouseY/blockSize) != blockY) {
    blockX = Math.floor(mouseX/blockSize);
    blockY = Math.floor(mouseY/blockSize);
    if (gameState === 0) {
      drawGrid();
    }
  }
}

function drawGrid() {
  ctx.fillStyle = "#e8e8e8";
  ctx.fillRect(0, 0, size, size);
  
  ctx.fillStyle ="#d0d0d0";

  // mouse hover
  if (mouseX > 0 && mouseX < size && mouseY > 0 && mouseY < size) {
    ctx.fillRect(blockX*blockSize, blockY*blockSize, blockSize, blockSize);
  }

  // draw uncovered
  for (var x = 0; x < gridSize; x++) {
    for (var y = 0; y < gridSize; y++) {
      if (visGrid[y][x] >= 0) {
        // if is uncovered
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(blockSize * x, blockSize * y, blockSize, blockSize);
        if (visGrid[y][x]) {
          // number
          ctx.fillStyle = "#202020";
          ctx.fillText(visGrid[y][x], blockSize * (x + 0.5), blockSize * (y + 0.85));
        }
      } else if (visGrid[y][x] === -2) {
        // checked
        ctx.fillStyle = "#2020d0";
        ctx.beginPath();
        ctx.ellipse(blockSize * (x + 0.5), blockSize * (y + 0.5), blockSize/3, blockSize/3, 0, 0, Math.PI*2);
        ctx.fill();
      }
    }
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
  if (visGrid[y][x] < 0 && gameState === 0) {
    visGrid[y][x] = -3 -visGrid[y][x];
    drawGrid();
  }
}

function uncoverSpot(x, y) {
  if (gameState === 0) {
    if (visGrid[y][x] === -2) {return;}
    if(isBomb(x,y)) {
      gameState = -1;
      title.innerHTML = "Defeat!";
    } else {
      var toCheckAround = [];
      // see if init spot needs to be checked around
      visGrid[y][x] = bombsNear(x,y);
      if (!bombsNear(x,y)) {
        toCheckAround.push([x, y]);
      }
      while (toCheckAround.length) {
        var spot = toCheckAround.shift();
        // fill toCheckAround with new spots (cannot be bombs/next to bombs) and update visgrid
        for (var i = Math.max(spot[0]-1, 0); i < Math.min(spot[0] + 2, gridSize); i++) {
          for (var j = Math.max(spot[1]-1, 0); j < Math.min(spot[1] + 2, gridSize); j++) {
            if (!bombsNear(i, j) && visGrid[j][i] < 0) {
              toCheckAround.push([i, j]);
            }
            visGrid[j][i] = bombsNear(i,j);
          }
        }
      }
      checkWin();
    }
    drawGrid();
  }
}

function checkWin() {
  var won = true;
  checking:
  for (x = 0; x < gridSize; x++) {
    for (y = 0; y < gridSize; y++) {
      // break if not checked or is bomb
      if (visGrid[y][x] < 0 && !(isBomb(x, y))) {
        won = false;
        break checking;
      }
    }
  }
  if (won) {
    gameState = 1;
    title.innerHTML = "Victory!";
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
  // refresh sizes + gameState
  gridSize = gSize;
  blockSize = size/gridSize;
  gameState = 0;
  ctx.font = blockSize + "px Helvetica, sans serif";
  ctx.textAlign = "center";
  title.innerHTML = "Minesweeper";
  // make visGrid
  visGrid = makeGrid(gSize, -1);
  // re-place bombs
  bombs = [];
  var newJawn;
  for(var i = 0; i < gridSize**2 / 10; i++) {
    do {
      newJawn = [Math.floor(Math.random()*gridSize), Math.floor(Math.random()*gridSize)];
    } while (isBomb(newJawn[0],newJawn[1]));
    bombs.push(newJawn);
  }
  drawGrid();
}

window.onload = function() {
  custominput = document.getElementById("custominput");
  title = document.getElementById("title");

  // game stuff
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  size = canvas.width;
  resizeGrid(8);

  // canvas stuff
  ctx.strokeStyle = "#d0d0d0"

  // hover stuff
  document.addEventListener("mousemove", function(e) {
    mouseX = e.clientX - canvas.offsetLeft + window.scrollX;
    mouseY = e.clientY - canvas.offsetTop + window.scrollY;
    drawGridIfNeeded();
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
