import { getUnvisitedCardinalNeighbors } from "./dijkstra";

export function breadthfirstsearch(grid, startNode, finishNode) {
  const queue = [];
  const visitedNodesInOrder = [];
  startNode.isVisited = true;
  const currentNode = startNode;
  queue.push(currentNode);
  visitedNodesInOrder.push(currentNode);
  while (!!queue) {
    const currentNode = queue.shift();
    if (currentNode === finishNode) return visitedNodesInOrder;
    const neighbors = getUnvisitedCardinalNeighbors(currentNode, grid);
    for (let i = 0; i < neighbors.length; i++) {
      if (!neighbors[i].isVisited && !neighbors[i].isWall) {
        neighbors[i].isVisited = true;
        neighbors[i].previousNode = currentNode;
        queue.push(neighbors[i]);
        visitedNodesInOrder.push(neighbors[i]);
      }
    }
  }
}
