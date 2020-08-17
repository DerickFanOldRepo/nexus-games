import React, { useState, useEffect, Fragment } from "react";
import WelcomeScreen from "./components/WelcomeScreen/WelcomeScreen";
import GameSelection from "./components/GameSelection/GameSelection";
import { socket } from "./lib/socket";
import TicTacToe from "./components/TicTacToe/TicTacToe";
import Checkers from "./components/Checkers/Checkers";
import "./App.css";
import UserDisplay from "./components/UserDIsplay/UserDisplay";
import ChatDisplay from "./components/ChatDisplay/ChatDisplay";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import Lobby from "./components/Lobby/Lobby";

const App = () => {
    const [playerName, setPlayerName] = useState();
    const [gameName, setGameName] = useState();
    const [roomNumber, setRoomNumber] = useState();
    const [roomMaster, setRoomMaster] = useState();
    const [gameError, setGameError] = useState();

    useEffect(() => {
        socket.on("setGame", (gameName) => setGameName(gameName));
        socket.on("roomCreated", (roomNumber) => setRoomNumber(roomNumber));
        socket.on("roomJoined", (roomNumber) => setRoomNumber(roomNumber));
        socket.on("setRoomMaster", () => setRoomMaster(true));
        socket.on("gameError", (error) => {
            setGameError(error);
            setTimeout(() => setGameError(), 1000);
        });
    }, []);

    const renderSelectedGame = () => {
        switch (gameName) {
            case "tictactoe":
                return <TicTacToe roomMaster={roomMaster} />;
            case "checkers":
                return <Checkers roomMaster={roomMaster} />;
        }
    };

    const displayError = () => {
        return gameError ? <ErrorMessage error={gameError} /> : <div />;
    };

    return (
        <Fragment>
            {gameName ? (
                <div className="room">
                    <UserDisplay gameName={gameName} roomNumber={roomNumber} />
                    {renderSelectedGame()}
                    <ChatDisplay />
                </div>
            ) : playerName ? (
                <GameSelection />
            ) : (
                <WelcomeScreen setPlayerName={setPlayerName} />
            )}
            {displayError()}
        </Fragment>
    );
};

export default App;
