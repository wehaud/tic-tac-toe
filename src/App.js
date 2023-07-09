import { useState } from "react";

function Square({ value, onSquareClick, isWinning }) {
  const className = isWinning ? "square winning" : "square";

  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, onPlay, squares }) {
  const result = calculateWinner(squares);
  const winner = result ? result.winner : null;
  const winningLine = result ? result.line : [];

  function handleClick(indexOfClickedSquare) {
    if (winner || squares[indexOfClickedSquare]) {
      return;
    }
    const updatedSquares = squares.slice();
    if (xIsNext) {
      updatedSquares[indexOfClickedSquare] = "X";
    } else {
      updatedSquares[indexOfClickedSquare] = "O";
    }
    onPlay(updatedSquares);
  }

  const renderSquare = (squareIndex) => {
    const isWinningSquare = winningLine.includes(squareIndex);
    return (
      <Square
        value={squares[squareIndex]}
        onSquareClick={() => handleClick(squareIndex)}
        isWinning={isWinningSquare}
      />
    );
  };

  let board = [];

  for (let i = 0; i < 3; i++) {
    let row = [];
    for (let j = 0; j < 3; j++) {
      let squareIndex = i * 3 + j;
      row.push(renderSquare(squareIndex));
    }
    board.push(
      <div className="board-row" key={i}>
        {row}
      </div>
    );
  }

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>

      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [currentMove, setCurrenMove] = useState(0);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(updatedSquares) {
    const newHistory = [...history.slice(0, currentMove + 1), updatedSquares];
    setHistory(newHistory);
    setCurrenMove(newHistory.length - 1);
  }

  function backTo(chosenMove) {
    setCurrenMove(chosenMove);
  }

  const moves = history.map((squares, historyStep) => {
    let description;
    if (historyStep === currentMove) {
      description = "You are at move #" + historyStep;
      return (
        <li className="currentMove" key={historyStep}>
          {description}
        </li>
      );
    }
    if (historyStep > 0) {
      description = "Move to step #" + historyStep;
    } else {
      description = "Game start";
    }
    return (
      <li key={historyStep}>
        <button onClick={() => backTo(historyStep)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: [a, b, c]
      };
    }
  }

  return null;
}
