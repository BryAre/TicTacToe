import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';


function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
            style={{ width: "15vh", height: "15vh", fontSize: "16vh" }}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {

        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}

            />

        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                }
            ],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                stepNumber: history.length,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner =
            calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'GO TO MOVE #' + move :
                'GAME START';
            return (
                <ul key={move}>
                    <Button
                        style={{ "backgroundColor": "Black", float: "right" }} className="btn btn-dark"
                        onClick={() => this.jumpTo(move)}>{desc}
                    </Button>
                </ul>
            );
        });

        let status;
        if (winner) {
            status = 'WINNER: ' + winner;
        }
        else {
            status = 'NEXT PLAYER: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <div className="game-board">
                    <div style={{ display: "flex", justifyContent: "center", height: "10vh", fontSize: "5vh" }} > {status}</div>

                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                    />

                </div>
                <div className="game-info">
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}



// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}