import { getUnvisitedCardinalNeighbors } from "./dijkstra";

export function depthfirstsearch(grid, startNode, finishNode) {
  if (!startNode || !finishNode || startNode === finishNode) return false;
  const stack = [];
  const visitedNodesInOrder = [];

  stack.push(startNode);
  while (!!stack) {
    const currentNode = stack.pop();
    if (!currentNode.isVisited) {
      currentNode.isVisited = true;
      visitedNodesInOrder.push(currentNode);
      if (currentNode === finishNode) return visitedNodesInOrder;
      const neighbors = getUnvisitedCardinalNeighbors(currentNode, grid);
      for (let i = 0; i < neighbors.length; i++) {
        if (!neighbors[i].isWall) {
          neighbors[i].previousNode = currentNode;
          stack.push(neighbors[i]);
        }
      }
    }
  }
}
