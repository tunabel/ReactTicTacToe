import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className='square'
            onClick={props.onClick}
        >
            {props.value}
        </button>
    )
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key = {i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    };

    renderRow(i) {
        const newRow = [];
        for ( let j = 0 ; j < 3 ; j++) {
            newRow.push(this.renderSquare(i*3+j));
        }
        return newRow;
    }

    render() {
        const newBoard = [];

        for ( let i = 0 ; i < 3 ; i++) {
            newBoard.push(
                <div className="board-row" key={i}>
                    {this.renderRow(i)}
                </div>
            )
        }

        return (
            <div>
                {newBoard}
            </div>
        )


        // return (
        //     <div>
        //         <div className="board-row">
        //             {this.renderSquare(0)}
        //             {this.renderSquare(1)}
        //             {this.renderSquare(2)}
        //         </div>
        //         <div className="board-row">
        //             {this.renderSquare(3)}
        //             {this.renderSquare(4)}
        //             {this.renderSquare(5)}
        //         </div>
        //         <div className="board-row">
        //             {this.renderSquare(6)}
        //             {this.renderSquare(7)}
        //             {this.renderSquare(8)}
        //         </div>
        //     </div>
        // );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history : [{
                squares: Array(9).fill(null),
                ticLoc: undefined,
            }],
            stepNumber: 0,
            xIsNext: true,
            moveOrderIsAsc: true
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0,this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                ticLoc: i,
                move: current.move+1,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2 ) === 0,
        })
    }

    renderMoves() {
        this.setState(
            {
                moveOrderIsAsc: !this.state.moveOrderIsAsc,
            }
        )
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = [];
        history.map((step,move) => {
            let btnClass = '';
            if (move === this.state.stepNumber) {
                btnClass += ' active-step';
            }
            const desc = move ?
                'Go to move #' + move + ' by ' + (move%2===0 ? 'O' : 'X') + ' at ' +findLocationOrder(step.ticLoc):
                'Go to game start';
            // return (
            //     <li key={move}>
            //         <button className={btnClass} onClick={() => this.jumpTo(move)}>{desc}</button>
            //     </li>
            // )
                if (this.state.moveOrderIsAsc) {
                    moves.push(
                        <li key={move}>
                            <button className={btnClass} onClick={() => this.jumpTo(move)}>{desc}</button>
                        </li>
                    )
                } else {
                    moves.unshift(
                        <li key={move}>
                            <button className={btnClass} onClick={() => this.jumpTo(move)}>{desc}</button>
                        </li>
                    )
                }
               return null;
        })

        let status;
        if (winner) {
            status = 'Winner is: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares ={current.squares}
                        onClick = {(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <button onClick={() => this.renderMoves()}>{this.state.moveOrderIsAsc?"Ascending":"Descending"}</button>
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
)

function calculateWinner(squares) {
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a,b,c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

function findLocationOrder(ticLoc) {
    const ticLocX = ticLoc % 3;
    const ticLocY = (ticLoc-ticLocX)/3;

    return 'row no.'+(ticLocY+1)+', col no.'+(ticLocX+1);
}