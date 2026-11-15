import { useState } from 'react';


// Square Component: Stateless "dumb" component for individual grid cells
 function Square({ value, onSquareClick }) {
  // 1. Render an interactive element (like a button).
  // 2. Bind the 'onSquareClick' callback to the element's click event.
  // 3. Display the 'value' prop (X, O, or empty) inside the element.
  const valueClass = value === 'X' ? 'x' : value === 'O' ? 'o' : '';
  return (
    <button className={`square ${valueClass}`} onClick={onSquareClick}>
      {value}
    </button>
  )
}

// Board Component: Renders the 3x3 grid
function Board({ gridState, onSquareClick }) {
  // 1. Define a helper function to render a Square for a given index.
  // 2. The helper should pass gridState[index] as the 'value' prop to the Square.
  // 3. The helper should pass a closure/function that invokes onSquareClick(index) to the Square.
  // 4. Render a container element for the board.
  // 5. Inside the container, render three rows.
  // 6. Inside each row, render three Squares using the helper function (mapping indices 0 through 8).
   const renderSquare = (index) => {
    return (
      <Square
        value={gridState[index]}
        onSquareClick={() => onSquareClick(index)}
      />
    )
   }

    return (
      <div className="board">
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row" >
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
    )


}

// GameInfo Component: Displays match meta-information
function GameInfo({ statusMessage }) {
  // 1. Render a container element.
  // 2. Display the 'statusMessage' text inside the container.
  return (
    <div className="game-info">
      <p>{statusMessage}</p>
    </div>
  )
}

// Game Component: Top-level orchestrator and state manager
export default function Game() {
  // 1. Declare state for 'gridState': initialize as an array of 9 empty/null elements.
  const [gridState, setGridState] = useState(Array(9).fill(null));
  // 2. Declare state for 'isXNext' (Turn Tracker): initialize as a boolean (e.g., true for 'X').
  const [isXNext, setIsXNext] = useState(true);

  // 3. Derive game status strictly from 'gridState':
  //    a. Evaluate 'gridState' against the 8 winning mathematical combinations.
  //    b. If a winner exists, set status string to declare the winner.
  //    c. Else if no winner and no unassigned squares remain, set status string to declare a draw.
  //    d. Else, set status string to declare the next player's turn.
  const calculateWinner = (squares) => {
    const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return null;
  };
  
  const winner = calculateWinner(gridState);
  const isDraw = !winner && gridState.every(square => square !== null);
  
  let statusMessage;
  if (winner) statusMessage = `Winner: ${winner}`;
  else if (isDraw) statusMessage = "Draw!";
  else statusMessage = `Next player: ${isXNext ? 'X' : 'O'}`;

  // 4. Define interaction flow callback: handleSquareClick(index)
  //    a. If gridState[index] is already assigned, return early (ignore click).
  //    b. If a winner or draw is already declared (game is no longer ongoing), return early.
  //    c. Create a copy of the current gridState array.
  //    d. Mutate the copy at the given index with the active player's symbol ('X' or 'O').
  //    e. Update the gridState with the newly mutated copy.
  //    f. Toggle the 'isXNext' boolean to pass control to the opposing player.
  const handleSquareClick = (index) => {
    if (gridState[index] || winner) return;
    const newGridState = [...gridState];
    newGridState[index] = isXNext ? 'X' : 'O';
    setGridState(newGridState);
    setIsXNext(!isXNext);
  };

  // 5. Render the application component hierarchy:
  //    a. Render a top-level wrapper element.
  //    b. Inside the wrapper, render the Board component:
  //       - Pass the 'gridState' to the Board.
  //       - Pass the 'handleSquareClick' function to the Board.
  //    c. Render the GameInfo component:
  //       - Pass the derived status message to GameInfo.
  const resetGame = () => {
    setGridState(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <>
      <h1 className="game-title">Tic Tac Toe</h1>
      <div className="game">
        <div className="game-board">
          <Board gridState={gridState} onSquareClick={handleSquareClick} />
        </div>
        <GameInfo statusMessage={statusMessage} />
        {(winner || isDraw) && (
          <button className="reset-button" onClick={resetGame}>
            Play Again
          </button>
        )}
      </div>
    </>
  );
}