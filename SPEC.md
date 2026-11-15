# Tic-Tac-Toe React Architecture Specification

## 1. Overview

This document outlines the architectural specifications for a browser-based Tic-Tac-Toe game built with React. It details the component structure, state management, and the core mathematical logic required to evaluate the progression and outcome of a match.

## 2. Component Hierarchy

The application will be divided into the following modular hierarchy:

**Game**: The top-level parent container. It acts as the primary orchestrator for the application, managing the global game state and facilitating data flow to child components.
**Board**: A child of the Game component. Its sole responsibility is to render the 3x3 grid by instantiating individual square components. It receives the current grid state and click handler callbacks from the Game component.
**Square**: A child of the Board component. It represents a single interactive cell within the grid. It is a stateless "dumb" component that displays its current value (X, O, or empty) and triggers a callback when interacted with by the user.
**GameInfo**: A child of the Game component. It displays meta-information about the match, such as the current player's turn, the winning player, or a draw declaration.

## 3. State Management

To accurately track the game's progression, the top-level **Game** component will maintain the following application state:

**Grid State**: A linear collection of 9 elements representing the 3x3 board. Each element corresponds to a specific square on the board (indexed from top-left to bottom-right). The value of each element will represent the player who claimed it (X or O) or an indicator that the square is currently unassigned.
**Turn Tracker**: A boolean or enumerated value indicating which player (X or O) currently has the active turn. This toggles after every valid grid interaction.
**Game Status** (Derived State): The application must derive the current status of the game (ongoing, won by X, won by O, or draw) strictly based on the current Grid State.

### Interaction Flow

When a user interacts with a **Square**:

1. The Square invokes a callback passed down from the Game component.
2. The Game component evaluates if the target square is currently unassigned and if the game is still ongoing (no winner or draw yet).
3. If the interaction is valid, the Game updates the Grid State at the specific index with the active player's symbol.
4. The Turn Tracker is toggled to pass control to the opposing player.

## 4. Win and Draw Mathematical Logic

### Win Condition

A win occurs when a single player successfully occupies three squares that form a continuous straight line. Mathematically, the 3x3 grid translates to 8 possible winning combinations based on the indices of the Grid State array (indices 0 through 8).

The predefined winning index sets are:
**Horizontal Rows**:
    *Top row: Indices 0, 1, and 2
    *Middle row: Indices 3, 4, and 5
    *Bottom row: Indices 6, 7, and 8
    **Vertical Columns**:
    *Left column: Indices 0, 3, and 6
    *Middle column: Indices 1, 4, and 7
    *Right column: Indices 2, 5, and 8
    **Diagonals**:
    *Top-left to bottom-right: Indices 0, 4, and 8
    *Top-right to bottom-left: Indices 2, 4, and 6

After every move, the system will evaluate the Grid State against these 8 mathematical sets. If all three indices in any single set contain the exact same player's symbol (and are not unassigned), that player is immediately declared the winner.

### Draw Condition

A draw (or cat's game) occurs when no player has met the Win Condition, and there are no unassigned squares remaining in the Grid State.

The system will evaluate the Draw Condition only if the Win Condition evaluates to false. If the Grid State array is completely filled (meaning it contains zero unassigned elements), the game is declared a draw.
