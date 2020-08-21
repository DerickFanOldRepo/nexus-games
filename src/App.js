import React, { useState, useEffect, Fragment } from "react";
import WelcomeScreen from "./components/WelcomeScreen/WelcomeScreen";
import GameSelection from "./components/GameSelection/GameSelection";
import TicTacToe from "./components/TicTacToe/TicTacToe";
import Checkers from "./components/Checkers/Checkers";
import UserDisplay from "./components/UserDIsplay/UserDisplay";
import ChatDisplay from "./components/ChatDisplay/ChatDisplay";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import Pictionary from "./components/Pictionary/Pictionary";
import { socket } from "./lib/socket";
import "./App.css";

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
            // Resets gameError
            setTimeout(() => setGameError(), 1000);
        });
    }, []);

    const renderSelectedGame = () => {
        switch (gameName) {
            case "tictactoe":
                return <TicTacToe roomMaster={roomMaster} />;
            case "checkers":
                return <Checkers roomMaster={roomMaster} />;
            case "pictionary":
                return <Pictionary roomMaster={roomMaster} />
        }
    };

    const displayError = () => {
        if (gameError) return <ErrorMessage error={gameError} />;
    };

    return (
        <Fragment>
            {gameName ? (
                <div className="room">
                    <UserDisplay gameName={gameName} roomNumber={roomNumber} setRoomMaster={setRoomMaster} />
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
