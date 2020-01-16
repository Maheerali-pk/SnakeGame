let game = [];
let prevGame = [];
let tiles;
let len, wid;
let snakePoints;
const dirObject = {
   0: [0, -1],
   1: [0, 1],
   2: [-1, 0],
   3: [1, 0]
};
let isPlaying = true;
let moveSnakeInterval;

function newGame(l, w) {
   len = l;
   wid = w;
   snakePoints = [];
   createBoard();
   game = Array(l)
      .fill()
      .map(x =>
         Array(w)
            .fill()
            .map(x => ({ val: 0 }))
      );
   updateGame(game);
   initalizeSnake();
   initalizeSnakeMovement();
   console.log("update snake");
   moveSnakeInterval = setInterval(moveSnake, 200);
   generateFood();
   console.log();
}

function createBoard() {
   const tableObject = {
      tag: "table",
      id: "game",
      children: [...Array(len)].map(_ => ({
         tag: "tr",
         children: [...Array(wid)].map(x => ({ tag: "td" }))
      }))
   };
   document.body.appendChild(ce(tableObject));
   const rows = [...qs("#game").qsa("tr")];
   tiles = rows.map(row => [...row.qsa("td")]);
}

function initalizeSnake() {
   let randomDirection = getRandomVal(0, 4);
   let [i, j] = getRandomPoint(0, len, 0, wid);
   console.log(i, j);
   const newGame = clone(game);
   newGame[i][j] = { dir: randomDirection, val: 1 };
   snakePoints.push([i, j]);
   updateGame(newGame);
}

function changeSnakeDirection(newDir) {
   let headPoint = snakePoints[0];
   let [hx, hy] = headPoint;
   const newGame = clone(game);
   newGame[hx][hy] = { val: 1, dir: newDir };
   highlightTile(hx, hy, "red");
   updateGame(newGame);
}

function initalizeSnakeMovement() {
   const buttonDirectionObject = {
      a: 0,
      d: 1,
      w: 2,
      s: 3
   };

   document.onkeydown = function(e) {
      let newDir = buttonDirectionObject[e.key];
      console.log(newDir);
      changeSnakeDirection(newDir);
   };
}

function moveSnake() {
   const newGame = clone(game);
   let foodEaten = false;
   snakePoints.some(([i, j], pNo) => {
      const { val, dir } = game[i][j];
      if (dir === undefined) {
         console.log("direction is undefined at", i, j);
         highlightTile(i, j);
      }

      const [di, dj] = dirObject[dir];
      if (!newGame[i + di] || !newGame[i + di][j + dj]) {
         gameOver();
         return true;
      }
      newGame[i][j] = { dir: dir, val: 0 };
      let newPoint = newGame[i + di][j + dj];
      let tempNewPointVal = newPoint.val;

      newPoint.val = 1;
      newPoint.dir = newPoint.dir === undefined ? dir : newPoint.dir;
      if (tempNewPointVal === 2 && pNo === 0) {
         //increaseSnakeLength();
         foodEaten = true;
      }
   });
   updateGame(newGame);
   snakePoints = snakePoints.map(([i, j], pointNumber) => {
      const { val, dir } = game[i][j];
      const [di, dj] = dirObject[dir];

      //Clear the "dir" when all the points are passed through certain points.
      if (pointNumber === snakePoints.length - 1) {
         game[i][j].dir = undefined;
      }
      return [i + di, dj + j];
   });
   if (foodEaten) {
      increaseSnakeLength();
      generateFood();
   }
}

function getNextPointOfPoint(i, j) {}

function increaseSnakeLength() {
   const tailPoint = snakePoints[snakePoints.length - 1];
   const [ti, tj] = tailPoint;
   const { val, dir } = game[ti][tj];
   const [di, dj] = dirObject[dir];
   let i = ti - di;
   let j = tj - dj;
   game[i][j] = { dir, val: 1 };
   snakePoints.push([i, j]);
}

function updateGame(newGame) {
   prevGame = game;
   game = clone(newGame);
   console.log("game updated");

   updateAllTiles();
}

//To update all the tiles
function updateAllTiles() {
   game.forEach((row, i) => {
      row.forEach((val, j) => {
         updateSingleTile(i, j);
      });
   });
}

//Update the className of element according to its val in the
function updateSingleTile(i, j) {
   const currentVal = game[i][j].val;
   if (currentVal === 2) {
      console.log("ok val is 2");
   }
   const prevVal = prevGame[i][j].val;
   if (currentVal !== prevVal) {
      //console.log(`point ${i}, ${j} is changed`, currentVal);
      const tile = tiles[i][j];
      if (currentVal === 0) {
         tile.className = "";
      } else if (currentVal === 1) {
         //console.log("tile class name changed");
         tile.className = "snake";
      } else if (currentVal === 2) {
         console.log("food set");

         tile.className = "food";
      }
   }
}

function highlightTile(i, j, color = "black") {
   tiles[i][j].style.border = "3px solid " + color;
}

function generateFood() {
   let randomPoint;
   //To prevent creation of food on any snake point
   do {
      randomPoint = getRandomPoint(0, len, 0, wid);
   } while (snakePoints.some(snakePoint => snakePoint.isEqualTo(randomPoint)));

   let [i, j] = randomPoint;
   const newGame = clone(game);
   newGame[i][j] = { val: 2 };
   updateGame(newGame);
}

function gameOver() {
   console.log("game Over");
   isPlaying = false;
   clearInterval(moveSnakeInterval);
}

newGame(30, 30);
