import React, { Component } from "react";
import Node from "./Node/Node";

import "./PathfindingVisualizer.css";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";
import { breadthfirstsearch } from "../algorithms/breadthfirst";
import { depthfirstsearch } from "../algorithms/depthfirst";
import { astar } from "../algorithms/astar";
import { calcHCost } from "../algorithms/astar";

const GRID_ROWS = 20;
const GRID_COLS = 50;
const DEFAULT_START_NODE_COL = 5;
const DEFAULT_START_NODE_ROW = 10;
const DEFAULT_FINISH_NODE_COL = 45;
const DEFAULT_FINISH_NODE_ROW = 10;
const DIJKSTRA = "DIJKSTRA";
const DEPTH_FIRST_SEARCH = "DFS";
const BREADTH_FIRST_SEARCH = "BFS";
const A_STAR = "ASTAR";
const SELECT_START_NODE = "Select a start node";
const SELECT_END_NODE = "Select an end node";
const IS_START_NODE = "IS_START";
const IS_FINISH_NODE = "IS_FINISH";

export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      isMousePressed: false,
      startNodeCol: 5,
      startNodeRow: 10,
      finishNodeCol: 45,
      finishNodeRow: 10,
      helpText: SELECT_START_NODE,
      isSelectingStartFinishNode: false,
      isVisualizing: false,
      isCompleted: false,
    };
  }

  initializeGrid() {
    const { startNodeRow, startNodeCol, finishNodeRow, finishNodeCol } =
      this.state;
    const grid = getInitialGrid(
      DEFAULT_START_NODE_ROW,
      DEFAULT_START_NODE_COL,
      DEFAULT_FINISH_NODE_ROW,
      DEFAULT_FINISH_NODE_COL
    );
    this.setState({ grid });
  }

  componentDidMount() {
    this.initializeGrid();
  }

  handleMouseClick(row, col) {
    const {
      grid,
      startNodeRow,
      startNodeCol,
      finishNodeRow,
      finishNodeCol,
      isSelectingStartFinishNode,
      helpText,
    } = this.state;
    if (isSelectingStartFinishNode && helpText === SELECT_START_NODE) {
      const newGrid = getNewGridWithStartFinishNodeUpdate(
        grid,
        row,
        col,
        startNodeRow,
        startNodeCol,
        IS_START_NODE
      );
      this.setState({
        grid: newGrid,
        startNodeRow: row,
        startNodeCol: col,
        helpText: SELECT_END_NODE,
      });
    } else {
      if (isSelectingStartFinishNode && helpText === SELECT_END_NODE) {
        const newGrid = getNewGridWithStartFinishNodeUpdate(
          grid,
          row,
          col,
          finishNodeRow,
          finishNodeCol,
          IS_FINISH_NODE
        );
        this.setState({
          grid: newGrid,
          finishNodeRow: row,
          finishNodeCol: col,
          isSelectingStartFinishNode: false,
          helpText: SELECT_START_NODE,
        });
      }
    }
  }

  handleMouseDown(row, col) {
    if (!this.state.isSelectingStartFinishNode && !this.state.isVisualizing) {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid, isMousePressed: true });
    }
  }

  handleMouseEnter(row, col) {
    if (!this.state.isMousePressed || this.state.isVisualizing) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    if (!this.state.isSelectingStartFinishNode && !this.state.isVisualizing) {
      this.setState({ isMousePressed: false });
    }
  }

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder, isAStar) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 25 * i);
        return;
      }
      if (isAStar) {
        // A Star animation here
        // const node = visitedNodesInOrder[i];
        // document.getElementById(`node-${node.row}-${node.col}`).className = "node node-"
        setTimeout(() => {
          const nodeInfo = visitedNodesInOrder[i];
          const node = nodeInfo.node;
          if (nodeInfo.isOpenNode) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-open";
          } else {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-closed";
          }
        }, 25 * i);
      } else {
        setTimeout(() => {
          const node = visitedNodesInOrder[i];
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited";
        }, 25 * i);
      }
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i <= nodesInShortestPathOrder.length; i++) {
      if (i === nodesInShortestPathOrder.length) {
        this.setState({ isVisualizing: false, isCompleted: true });
      } else {
        setTimeout(() => {
          const node = nodesInShortestPathOrder[i];
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-shortest-path";
        }, 25 * i);
      }
    }
  }

  visualizeAlgorithm(keyword) {
    if (!this.state.isVisualizing) {
      this.resetGrid();
      this.setState({ isVisualizing: true, isCompleted: false }, () => {
        const {
          grid,
          startNodeRow,
          startNodeCol,
          finishNodeRow,
          finishNodeCol,
        } = this.state;
        const startNode = grid[startNodeRow][startNodeCol];
        const finishNode = grid[finishNodeRow][finishNodeCol];
        let visitedNodesInOrder = null;
        if (keyword === DIJKSTRA) {
          visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        } else if (keyword === BREADTH_FIRST_SEARCH) {
          visitedNodesInOrder = breadthfirstsearch(grid, startNode, finishNode);
        } else if (keyword === DEPTH_FIRST_SEARCH) {
          visitedNodesInOrder = depthfirstsearch(grid, startNode, finishNode);
        } else if (keyword === A_STAR) {
          visitedNodesInOrder = astar(grid, startNode, finishNode);
        }
        const nodesInShortestPathOrder =
          getNodesInShortestPathOrder(finishNode);
        const isAStar = keyword === A_STAR;
        this.animateAlgorithm(
          visitedNodesInOrder,
          nodesInShortestPathOrder,
          isAStar
        );
      });
    }
  }

  resetGrid() {
    if (this.state.isCompleted) {
      const grid = getInitialGrid(
        this.state.startNodeRow,
        this.state.startNodeCol,
        this.state.finishNodeRow,
        this.state.finishNodeCol
      );
      this.setState(
        {
          grid: grid,
        },
        () => {
          for (let row = 0; row < this.state.grid.length; row++) {
            for (let col = 0; col < this.state.grid[0].length; col++) {
              if (
                row === this.state.startNodeRow &&
                col === this.state.startNodeCol
              ) {
                document.getElementById(`node-${row}-${col}`).className =
                  "node node-start";
              } else if (
                row === this.state.finishNodeRow &&
                col === this.state.finishNodeCol
              ) {
                document.getElementById(`node-${row}-${col}`).className =
                  "node node-finish";
              } else {
                document.getElementById(`node-${row}-${col}`).className =
                  "node";
              }
            }
          }
        }
      );
    }
  }

  setStartAndFinishNodes() {
    if (!this.state.isVisualizing) {
      this.setState({
        isSelectingStartFinishNode: !this.state.isSelectingStartFinishNode,
      });
    }
  }

  render() {
    const { grid, isMousePressed } = this.state;

    return (
      <>
        <button
          className="button"
          onClick={() => this.visualizeAlgorithm(DIJKSTRA)}
        >
          Visualize Dijkstra's Algorithm
        </button>
        <button
          className="button"
          onClick={() => this.visualizeAlgorithm(DEPTH_FIRST_SEARCH)}
        >
          Visualize Depth-First Search Algorithm
        </button>
        <button
          className="button"
          onClick={() => this.visualizeAlgorithm(BREADTH_FIRST_SEARCH)}
        >
          Visualize Breadth-First Search Algorithm
        </button>
        <button
          className="button"
          onClick={() => this.visualizeAlgorithm(A_STAR)}
        >
          Visualize A-Star Algorithm
        </button>
        <button
          className="button"
          onClick={() => this.setStartAndFinishNodes()}
        >
          Set Start and Finish Nodes
        </button>
        <button className="button" onClick={() => this.resetGrid()}>
          Reset Visualizer
        </button>

        {this.state.isSelectingStartFinishNode && (
          <div className="text">{this.state.helpText}</div>
        )}
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isStart, isFinish, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      row={row}
                      col={col}
                      isStart={isStart}
                      isFinish={isFinish}
                      isWall={isWall}
                      mouseIsPressed={isMousePressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      onMouseClick={(row, col) =>
                        this.handleMouseClick(row, col)
                      }
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = (
  startNodeRow,
  startNodeCol,
  finishNodeRow,
  finishNodeCol
) => {
  const grid = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < GRID_COLS; col++) {
      const isStart = row === startNodeRow && col === startNodeCol;
      const isFinish = row === finishNodeRow && col === finishNodeCol;
      currentRow.push(
        createNode(row, col, isStart, isFinish, finishNodeRow, finishNodeCol)
      );
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (
  row,
  col,
  isStart,
  isFinish,
  finishNodeRow,
  finishNodeCol,
  isWall = false
) => {
  return {
    col,
    row,
    isStart: isStart,
    isFinish: isFinish,
    distance: Infinity,
    isVisited: false,
    isWall: isWall,
    previousNode: null,
    fCost: 0,
    gCost: 0,
    hCost: calcHCost(row, col, finishNodeRow, finishNodeCol),
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;

  return newGrid;
};

const getNewGridWithStartFinishNodeUpdate = (
  grid,
  newRow,
  newCol,
  prevRow,
  prevCol,
  updateType
) => {
  const newGrid = grid.slice();
  if (updateType === IS_START_NODE) {
    const prevNode = newGrid[prevRow][prevCol];
    const node = newGrid[newRow][newCol];
    const newPrevNode = {
      ...prevNode,
      isStart: false,
    };
    const newNode = {
      ...node,
      isStart: true,
    };
    newGrid[prevRow][prevCol] = newPrevNode;
    newGrid[newRow][newCol] = newNode;
  } else if (updateType === IS_FINISH_NODE) {
    const prevNode = newGrid[prevRow][prevCol];
    const node = newGrid[newRow][newCol];
    const newPrevNode = {
      ...prevNode,
      isFinish: false,
    };
    const newNode = {
      ...node,
      isFinish: true,
    };

    newGrid[prevRow][prevCol] = newPrevNode;
    newGrid[newRow][newCol] = newNode;

    // update HCost for all cells
    for (let row = 0; row < newGrid.length; row++) {
      for (let col = 0; col < newGrid[row].length; col++) {
        const isStart = newGrid[row][col].isStart;
        const isFinish = row === newRow && col === newCol;
        const isWall = newGrid[row][col].isWall;
        const node = createNode(
          row,
          col,
          isStart,
          isFinish,
          newRow,
          newCol,
          isWall
        );
        newGrid[row][col] = node;
      }
    }
  }
  return newGrid;
};
