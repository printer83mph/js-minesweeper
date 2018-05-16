// dom stuff
var custominput, title;

// mouse stuff
var mouseX, mouseY, blockX, blockY;

// grid stuff
var canvas, ctx, bombGrid, visGrid, gridX, gridY, blockSize, gameState;

function drawGridIfNeeded() {
  var newX = Math.floor(mouseX/blockSize);
  var newY = Math.floor(mouseY/blockSize);
  if (gameState === 0 && (newX != blockX || newX != blockY)) {
    drawRecentTiles(newX, newY);
    blockX = Math.floor(mouseX/blockSize);
    blockY = Math.floor(mouseY/blockSize);
    drawDivs();
  }
}

function mouseOnGrid() {
  return mouseX > 0 && mouseX < canvas.width && mouseY > 0 && mouseY < canvas.height;
}

function drawRecentTiles(newX, newY) {
  if (blockX >= 0 && blockX < gridX && blockY >= 0 && blockY < gridY) {
    if (visGrid[blockY][blockX] === -1) {
      ctx.fillStyle = "#e8e8e8";
      ctx.fillRect(blockX*blockSize,blockY*blockSize, blockSize, blockSize);
    }
  } if (mouseOnGrid() && visGrid[newY][newX] === -1) {
    ctx.fillStyle = "#d0d0d0";
    ctx.fillRect(newX * blockSize, newY*blockSize, blockSize, blockSize);
  }
}

function drawGrid() {
  ctx.fillStyle = "#e8e8e8";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle ="#d0d0d0";

  // draw uncovered
  for (var x = 0; x < gridX; x++) {
    for (var y = 0; y < gridY; y++) {
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
      if (gameState === -1 && bombGrid[y][x]) {
        ctx.fillStyle = "#d02020"
        ctx.beginPath();
        ctx.ellipse(blockSize * (x + 0.5), blockSize * (y + 0.5), blockSize/3, blockSize/3, 0, 0, Math.PI*2);
        ctx.fill();
      }
    }
  }

  // draw divs
  drawDivs();

  // window.requestAnimationFrame(drawGrid);
}

function drawDivs() {
  ctx.lineWidth = 2;
  for (var i = 1; i < gridX; i++) {
    // draw col dividers
    ctx.beginPath();
    ctx.moveTo(i * blockSize, 0);
    ctx.lineTo(i * blockSize, canvas.height);
    ctx.stroke();
  }
  for (var i = 1; i < gridY; i++) {
    // draw row divs
    ctx.beginPath();
    ctx.moveTo(0, i * blockSize);
    ctx.lineTo(canvas.width, i * blockSize);
    ctx.stroke();
  }
}

function inSet(set, x, y) {
  for (b in set) {
    if (x === set[b][0] && y === set[b][1]) {
      return true;
    }
  }
  return false;
}

function bombsNear(x, y) {
  var bc = 0;
  for (var i = Math.max(x-1, 0); i < Math.min(x + 2, gridX); i++) {
    for (var j = Math.max(y-1, 0); j < Math.min(y + 2, gridY); j++) {
      if (bombGrid[j][i]) {bc++}
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
    if(bombGrid[y][x]) {
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
        for (var i = Math.max(spot[0]-1, 0); i < Math.min(spot[0] + 2, gridX); i++) {
          for (var j = Math.max(spot[1]-1, 0); j < Math.min(spot[1] + 2, gridY); j++) {
            if (!bombsNear(i, j) && visGrid[j][i] < 0 && !inSet(toCheckAround, i, j)) {
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
  for (x = 0; x < gridX; x++) {
    for (y = 0; y < gridY; y++) {
      // break if not checked or is bomb
      if (visGrid[y][x] < 0 && !(bombGrid[y][x])) {
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

function makeGrid(gX, gY, fill) {
  // output grid
  var out = [];
  // add all the zeroes
  for (var i = 0; i < gY; i++) {
    var thisRow = [];
    for (var j = 0; j < gX; j++) {
      thisRow.push(fill);
    }
    out.push(thisRow);
  }

  return out;
}


// WIP Scalability


function resizeGrid(gX,gY) {
  // refresh sizes + gameState
  let largerDim = Math.max(gX, gY);
  blockSize = Math.max(20, 512/largerDim);
  canvas.width = blockSize * gX;
  canvas.height = blockSize * gY;
  gridX = gX;
  gridY = gY;
  gameState = 0;
  //canvas stuff
  ctx.font = blockSize + "px Helvetica, sans serif";
  ctx.textAlign = "center";
  ctx.strokeStyle = "#d0d0d0";
  // dom stuff
  title.innerHTML = "Minesweeper";
  // make visGrid
  visGrid = makeGrid(gX, gY, -1);
  // re-place bombs
  bombGrid = makeGrid(gX, gY, false);
  var newJawn;
  for(var i = 0; i < gX * gY / 10; i++) {
    do {
      newJawn = [Math.floor(Math.random()*gX), Math.floor(Math.random()*gY)];
    } while (bombGrid[newJawn[1]][newJawn[0]]);
    bombGrid[newJawn[1]][newJawn[0]] = true;
  }
  drawGrid();
}

window.onload = function() {
  custominput = document.getElementById("custominput");
  title = document.getElementById("title");

  // game stuff
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  blockX = -1;
  blockY = -1;
  resizeGrid(8,8);

  // hover stuff
  document.addEventListener("mousemove", function(e) {
    mouseX = e.clientX - canvas.offsetLeft + window.scrollX;
    mouseY = e.clientY - canvas.offsetTop + window.scrollY;
    drawGridIfNeeded();
  });

  // click stuff
  document.addEventListener("contextmenu", function(e) {
    if (mouseX > 0 && mouseX < canvas.width && mouseY > 0 && mouseY < canvas.height) {
      e.preventDefault();
      markSpot(blockX, blockY);
    }
  });

  document.addEventListener("click", function(e) {
    if (mouseX > 0 && mouseX < canvas.width && mouseY > 0 && mouseY < canvas.height) {
      e.preventDefault();
      uncoverSpot(blockX, blockY);
    }
  });

  drawGrid();
}
