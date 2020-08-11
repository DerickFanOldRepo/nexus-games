import React, { useState, useEffect } from "react";
import WelcomeScreen from "./components/WelcomeScreen/WelcomeScreen";
import GameSelection from "./components/GameSelection/GameSelection";
import { socket } from "./lib/socket";
import TicTacToe from "./components/TicTacToe/TicTacToe";
import "./App.css";

const App = () => {
    const [playerName, setPlayerName] = useState();
    const [gameName, setGameName] = useState();

    useEffect(() => {
        socket.on("setGame", (gameName) => setGameName(gameName));
    }, []);

    const renderSelectedGame = () => {
        switch (gameName) {
            case "tictactoe":
                return <TicTacToe />;
        }
    };

    return gameName ? (
        renderSelectedGame()
    ) : playerName ? (
        <GameSelection />
    ) : (
        <WelcomeScreen setPlayerName={setPlayerName} />
    );
};

export default App;
