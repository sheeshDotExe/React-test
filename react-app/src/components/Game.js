import React, { Component } from "react";

class Board extends Component {
  constructor(props) {
    super(props);
  }

  renderBoard() {
    const retval = this.props.grid.map((rows, index) => {
      return (
        <tr key={index}>
          {rows.map((column, indexc) => {
            if (column.Active) {
              return (
                <td key={indexc} style={{ background: column.Color }}></td>
              );
            } else {
              return <td key={indexc}></td>;
            }
          })}
        </tr>
      );
    });

    return (
      <table>
        <tbody>{retval}</tbody>
      </table>
    );
  }

  render() {
    return <div>{this.renderBoard()}</div>;
  }
}

function getObj() {
  return { Active: 0, Color: "" };
}

function getArr() {
  return new Array(10).fill(null).map(getObj);
}

class Piece {
  constructor(piece, x, y) {
    this.piece = piece;
    this.x = x;
    this.y = y;
  }

  clear(arr) {
    this.piece.data.forEach((coord) => {
      if (
        !(
          this.x + coord.x < 0 ||
          this.x + coord.x > 10 ||
          this.y + coord.y < 0 ||
          this.y + coord.y >= 20
        )
      )
        arr[this.y + coord.y][this.x + coord.x] = { Active: 0, Color: "" };
    });
  }

  draw(arr) {
    this.piece.data.forEach((coord) => {
      if (
        !(
          this.x + coord.x < 0 ||
          this.x + coord.x > 10 ||
          this.y + coord.y < 0 ||
          this.y + coord.y >= 20
        )
      )
        arr[this.y + coord.y][this.x + coord.x] = {
          Active: 1,
          Color: this.piece.color,
        };
    });
  }

  checkCoord(x, y) {
    for (let i = 0; i < this.piece.data.length; i++) {
      const coord = this.piece.data[i];
      if (coord.x + this.x === x && coord.y + this.y === y) {
        return true;
      }
    }
    return false;
  }

  checkCollisionY(arr) {
    for (let i = 0; i < this.piece.data.length; i++) {
      const coord = this.piece.data[i];
      //console.log(this.y + coord.y);
      if (this.y + coord.y >= 19) {
        return true;
      } else if (!(this.x + coord.x < 0 || this.x + coord.x > 10)) {
        if (arr[this.y + coord.y + 1][this.x + coord.x].Active === 1) {
          if (!this.checkCoord(this.x + coord.x, this.y + coord.y + 1)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  checkLoss() {
    for (let i = 0; i < this.piece.data.length; i++) {
      const coord = this.piece.data[i];
      if (coord.y + this.y < 0) {
        return true;
      }
    }
    return false;
  }

  move(directions, speed, arr) {
    this.clear(arr);
    this.x += speed * directions[0];
    this.y += speed * directions[1];
    this.draw(arr);
  }
}

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRunning: false,
      columns: 10,
      rows: 20,
      grid: new Array(20).fill(null).map(getArr),
      piecesTemplate: {
        "stair-left": {
          data: [
            { x: 0, y: 0 },
            { x: 0, y: -1 },
            { x: 1, y: -1 },
            { x: 1, y: -2 },
          ],
          color: "green",
        },
      },
    };
  }

  update() {
    this.newArr = [...this.state.grid];
    //console.log(this.pieceObj);
    this.activePiece.move([0, 1], 1, this.newArr);

    if (this.activePiece.checkCollisionY(this.newArr)) {
      if (this.activePiece.checkLoss()) {
        console.log("game over");
        this.endGame();
      }

      this.activePiece = new Piece(
        this.state.piecesTemplate["stair-left"],
        4,
        0
      );
    }

    this.setState({
      grid: this.newArr,
    });
  }

  keyboardHandler = (event) => {
    if (event.key === "d") {
      if (this.activePiece.x < this.state.columns - 2)
        this.activePiece.move([1, 0], 1, this.newArr);
    }
    if (event.key === "a") {
      if (this.activePiece.x > 0)
        this.activePiece.move([1, 0], -1, this.newArr);
    }
  };

  startGame() {
    document.addEventListener("keydown", this.keyboardHandler);
    this.mainLoop = setInterval(() => this.update(), 200);
  }

  endGame() {
    document.removeEventListener("keydown", this.keyboardHandler);
    clearInterval(this.mainLoop);
  }

  componentDidMount() {
    this.activePiece = new Piece(this.state.piecesTemplate["stair-left"], 4, 0);
    this.startGame();
  }

  componentWillUnmount() {
    this.endGame();
  }

  render() {
    return (
      <div className="gameboard">
        <Board grid={this.state.grid} />
      </div>
    );
  }
}

export default Game;
