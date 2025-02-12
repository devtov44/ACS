// src/Game.js
import React, { useState } from "react";

// Estado inicial: todos los actores en la orilla izquierda.
const initialState = {
  granjero: "left",
  lobo: "left",
  cabra: "left",
  col: "left",
};

// Función que invierte la orilla.
const flip = (side) => (side === "left" ? "right" : "left");

// Función para validar el estado del juego.
// Si el lobo y la cabra están juntos sin el granjero, o si la cabra y la col están juntas sin el granjero, se considera un estado inválido.
const isValidState = (state) => {
  if (state.lobo === state.cabra && state.granjero !== state.lobo) {
    return { valid: false, reason: "El lobo se comió a la cabra." };
  }
  if (state.cabra === state.col && state.granjero !== state.cabra) {
    return { valid: false, reason: "La cabra se comió la col." };
  }
  return { valid: true };
};

const Game = () => {
  const [state, setState] = useState(initialState);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const getActorEmoji = (actor) => {
    switch (actor) {
      case 'granjero': return '👨‍🌾';
      case 'lobo': return '🐺';
      case 'cabra': return '🐐';
      case 'col': return '🥬';
      default: return '';
    }
  };

  // Función para ejecutar un movimiento.
  // "item" puede ser "none" (mover solo) o uno de los actores ("lobo", "cabra", "col").
  const makeMove = (item) => {
    if (gameOver || gameWon) return;

    // Verifica que si se va a mover un objeto, éste se encuentre en la misma orilla que el granjero.
    if (item !== "none" && state[item] !== state.granjero) {
      setMessage(
        `No puedes mover ${item} porque no está en la misma orilla que el granjero.`
      );
      return;
    }

    // Se genera el nuevo estado: el granjero siempre cambia de orilla.
    const newState = { ...state, granjero: flip(state.granjero) };

    // Si se mueve un objeto, se cambia también su orilla.
    if (item !== "none") {
      newState[item] = flip(state[item]);
    }

    // Se valida el nuevo estado.
    const validity = isValidState(newState);
    if (!validity.valid) {
      setState(newState);
      setGameOver(true);
      setMessage(validity.reason + " ¡Juego terminado!");
      return;
    }

    // Actualiza el estado y muestra mensaje de éxito.
    setState(newState);
    setMessage("Movimiento exitoso.");

    // Verifica la condición de victoria: todos los actores deben estar en la orilla derecha.
    if (
      newState.granjero === "right" &&
      newState.lobo === "right" &&
      newState.cabra === "right" &&
      newState.col === "right"
    ) {
      setGameWon(true);
      setMessage("¡Felicidades! Has ganado el juego.");
    }
  };

  // Función para reiniciar el juego.
  const resetGame = () => {
    setState(initialState);
    setGameOver(false);
    setGameWon(false);
    setMessage("");
  };

  return (
    <div className="game-container">
      <h1 className="game-title">El Granjero, el Lobo, la Cabra y la Col</h1>
      <h3>Hecho por: Sebastian Salgado</h3>
      <div className="banks">
        <div className="bank">
          <h2>Orilla Izquierda</h2>
          {Object.entries(state).map(([key, side]) =>
            side === "left" ? (
              <div key={key} className="actor">
                {getActorEmoji(key)} {key}
              </div>
            ) : null
          )}
        </div>
        <div className="river"></div>
        <div className="bank">
          <h2>Orilla Derecha</h2>
          {Object.entries(state).map(([key, side]) =>
            side === "right" ? (
              <div key={key} className="actor">
                {getActorEmoji(key)} {key}
              </div>
            ) : null
          )}
        </div>
      </div>
      <div className="controls">
        <h3>Elige un movimiento:</h3>
        <button onClick={() => makeMove("none")} disabled={gameOver || gameWon}>
          🚣 Mover solo
        </button>
        <button onClick={() => makeMove("lobo")} disabled={gameOver || gameWon}>
          🐺 Mover lobo
        </button>
        <button onClick={() => makeMove("cabra")} disabled={gameOver || gameWon}>
          🐐 Mover cabra
        </button>
        <button onClick={() => makeMove("col")} disabled={gameOver || gameWon}>
          🥬 Mover col
        </button>
      </div>
      <div className="message">
        <p>{message}</p>
      </div>
      {(gameOver || gameWon) && (
        <div className="reset">
          <button onClick={resetGame}>🔄 Reiniciar juego</button>
        </div>
      )}
    </div>
  );
};

export default Game;
