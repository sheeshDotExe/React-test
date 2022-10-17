import React, { Component } from 'react';

class Board extends Component {
    constructor(props) {
        super(props);
    }

    renderBoard() {
        const retval = this.props.grid.map((rows, index) => {
            return (
                <tr>
                    {rows.map((column, indexc) => {
                        if (column.Active) {
                            return <td style={{ background: column.Color }}></td>;
                        } else {
                            return <td></td>;
                        }
                    })}
                </tr>
            )
        });

        return (<table>{retval}</table>);
    }

    render() {
        return (
            <div>{this.renderBoard()}</div>
        );
    }
}

function getObj() {
    return { Active: 0, Color: "" }
}

function getArr() {
    return new Array(10).fill(null).map(getObj)
}

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRunning: false,
            columns: 10,
            rows: 20,
            grid: new Array(20).fill(null).map(getArr),

            pieces: {
                "stair-left": { data: [{ x: 0, y: 0 }, { x: 0, y: -1 }, { x: 1, y: -1 }, { x: 1, y: -2 }], color: "green" }
            }
        };
    }

    addPiece(piece, x, y) {
        const newArr = [...this.state.grid];

        piece.data.forEach(coord => {
            console.log(x + coord.x, y + coord.y)

            newArr[y + coord.y][x + coord.x] = { Active: 1, Color: piece.color };
        });



        this.setState(
            {
                grid: newArr
            }
        );

    }

    update() {
        //console.log(new Date().toLocaleTimeString());
    }

    componentDidMount() {
        this.addPiece(this.state.pieces["stair-left"], 4, 10);
        //this.mainLoop = setInterval(() => this.update(), 20);
    }

    componentWillUnmount() {
        //clearInterval(this.mainLoop);
    }

    render() {
        return (<div class="gameboard">
            <Board grid={this.state.grid} /></div>);
    }
}

export default Game;