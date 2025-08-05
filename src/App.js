// src/App.js
import React from 'react';
import Game from './Components/Game';
import './App.css';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>💣 Jogo das Minas</h1>
                <Game />
            </header>
        </div>
    );
}

export default App;
