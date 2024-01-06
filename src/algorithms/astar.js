import { NodeInfo } from "../PathfindingVisualizer/Node/NodeInfo";

const CARDINAL_MOVE_COST = 10;
const DIAGONAL_MOVE_COST = 14;

export function astar(grid, start, end) {
  let openNodes = [];
  let closedNodes = [];
  const nodesInVisitedOrder = [];
  let current = start;
  openNodes.push(current);
  nodesInVisitedOrder.push(new NodeInfo(current, true));

  while (openNodes) {
    current = getLowestFCost(openNodes);
    const index = openNodes.indexOf(current);
    openNodes.splice(index, 1);
    closedNodes.push(current);
    nodesInVisitedOrder.push(new NodeInfo(current, false));

    if (current.row === end.row && current.col === end.col)
      return nodesInVisitedOrder;

    const neighbors = getCardinalOrdinalNeighbors(
      grid,
      current.row,
      current.col
    );
    for (let i = 0; i < neighbors.length; i++) {
      if (neighbors[i].isWall || closedNodes.includes(neighbors[i])) {
        continue;
      }

      if (
        getDistToNeighbor(current, neighbors[i]) + current.gCost <
          neighbors[i].gCost ||
        !openNodes.includes(neighbors[i])
      ) {
        neighbors[i].gCost = calcGCost(current, neighbors[i]);
        neighbors[i].fCost = neighbors[i].gCost + neighbors[i].hCost;
        neighbors[i].previousNode = current;
        if (!openNodes.includes(neighbors[i])) {
          openNodes.push(neighbors[i]);
          nodesInVisitedOrder.push(new NodeInfo(neighbors[i], true));
        }
      }
    }
  }
}

// calculates the distance from start to current node
function calcGCost(current, next) {
  return current.gCost + getDistToNeighbor(current, next);
}

// calculates the distance from the start node to the end node (heuristic)
export function calcHCost(startRow, startCol, endRow, endCol) {
  let currentRow = startRow;
  let currentCol = startCol;
  let diagonalMoves = 0;
  let cardinalMoves = 0;
  let left = false;
  let right = false;
  let up = false;
  let down = false;
  if (startRow - endRow > 0) up = true;
  if (startRow - endRow < 0) down = true;
  if (startCol - endCol > 0) left = true;
  if (startCol - endCol < 0) right = true;

  if (isDiagonal(left, right, up, down)) {
    let rowDiff = Math.abs(startRow - endRow);
    let colDiff = Math.abs(startCol - endCol);
    let diff = 0;
    if (rowDiff < colDiff) diff = rowDiff;
    else diff = colDiff;
    if (left && up) {
      diagonalMoves += diff;
      currentRow -= diff;
      currentCol -= diff;
    }
    if (right && up) {
      diagonalMoves += diff;
      currentRow -= diff;
      currentCol += diff;
    }
    if (left && down) {
      diagonalMoves += diff;
      currentRow += diff;
      currentCol -= diff;
    }
    if (right && down) {
      diagonalMoves += diff;
      currentRow += diff;
      currentCol += diff;
    }
  }

  if (currentRow !== endRow) cardinalMoves += Math.abs(currentRow - endRow);
  else if (currentCol !== endCol)
    cardinalMoves += Math.abs(currentCol - endCol);

  return (
    DIAGONAL_MOVE_COST * diagonalMoves + CARDINAL_MOVE_COST * cardinalMoves
  );
}

function isDiagonal(left, right, up, down) {
  if (left && up) return true;
  if (right && up) return true;
  if (left && down) return true;
  if (right && down) return true;
  return false;
}

function getDistToNeighbor(current, neighbor) {
  if (current.row === neighbor.row || current.col === neighbor.col)
    return CARDINAL_MOVE_COST;
  else return DIAGONAL_MOVE_COST;
}

function getLowestFCost(openNodes) {
  let lowestFCost = Infinity;
  let lowestCostChoices = [];
  // find all open nodes with the lowest F cost
  openNodes.sort(compareFCosts);
  for (let i = 0; i < openNodes.length; i++) {
    if (openNodes[i].fCost <= lowestFCost) {
      lowestFCost = openNodes[i].fCost;
      lowestCostChoices.push(openNodes[i]);
    }
  }

  // if multiple open nodes with lowest F cost, sort by lowest H cost
  lowestCostChoices.sort(compareHCosts);

  // return lowest F cost and lowest H cost node
  return lowestCostChoices.shift();
}

function compareFCosts(a, b) {
  if (a.fCost < b.fCost) {
    return -1;
  }
  if (a.fCost > b.fCost) {
    return 1;
  }
  return 0;
}

function compareHCosts(a, b) {
  if (a.hCost < b.hCost) {
    return -1;
  }
  if (a.hCost > b.hCost) {
    return 1;
  }
  return 0;
}

function getCardinalOrdinalNeighbors(grid, curRow, curCol) {
  const neighbors = [];
  if (curRow > 0) {
    neighbors.push(grid[curRow - 1][curCol]);
    if (curCol > 0)
      if (!grid[curRow - 1][curCol].isWall || !grid[curRow][curCol - 1].isWall)
        // if up and left neighbors are walls, diagonal up and left neighbor isn't reachable
        neighbors.push(grid[curRow - 1][curCol - 1]);

    if (curCol < grid[0].length - 1)
      if (!grid[curRow - 1][curCol].isWall || !grid[curRow][curCol + 1].isWall)
        // if up and right neighbors are walls, diagonal up and right neighbor isn't reachable
        neighbors.push(grid[curRow - 1][curCol + 1]);
  }
  if (curRow < grid.length - 1) {
    neighbors.push(grid[curRow + 1][curCol]);
    if (curCol > 0)
      if (!grid[curRow + 1][curCol].isWall || !grid[curRow][curCol - 1].isWall)
        // if down and left neighbors are walls, diagonal down and left neighbor isn't reachable
        neighbors.push(grid[curRow + 1][curCol - 1]);
    if (curCol < grid[0].length - 1)
      if (!grid[curRow + 1][curCol].isWall || !grid[curRow][curCol + 1].isWall)
        // if down and right neighbors are walls, diagonal down and right neighbor isn't reachable
        neighbors.push(grid[curRow + 1][curCol + 1]);
  }
  if (curCol > 0) neighbors.push(grid[curRow][curCol - 1]);
  if (curCol < grid[0].length - 1) neighbors.push(grid[curRow][curCol + 1]);

  return neighbors;
}
