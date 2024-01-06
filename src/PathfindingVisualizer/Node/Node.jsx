import React, { Component } from "react";

import "./Node.css";

export default class Node extends Component {
  render() {
    const {
      row,
      col,
      isStart,
      isFinish,
      isWall,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      onMouseClick,
      distance,
    } = this.props;
    const extraClassName = isFinish
      ? "node-finish"
      : isStart
      ? "node-start"
      : isWall
      ? "node-wall"
      : "";

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
        onClick={() => onMouseClick(row, col)}
      ></div>
    );
  }
}

Node.prototype.valueOf = function () {
  return this.props.distance;
};
