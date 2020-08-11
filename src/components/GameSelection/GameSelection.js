import React, { useState, useEffect, Fragment } from "react";
import GameCard from "../GameCard/GameCard";
import ErorrMessage from "../ErrorMessage/ErrorMessage";
import "./GameSelection.css";
import { socket } from "../../lib/socket";

// Displays all the available games for the use to selecti from
const GameSelection = (props) => {
    const [games, setGames] = useState([
        "TicTacToe",
        "Chess",
        "Checkers",
        "Pictionary",
    ]);
    const [joinError, setJoinError] = useState(false);

    useEffect(() => {
        socket.on("roomJoinFailed", (game, error) => {
            setJoinError(error);
        });
    }, []);

    return (
        <Fragment>
            {joinError ? (
                <ErorrMessage error={joinError} setError={setJoinError} />
            ) : (
                <div></div>
            )}
            <div className="game-selection">
                {games.map((e) => (
                    <GameCard gameName={e} />
                ))}
            </div>
        </Fragment>
    );
};

export default GameSelection;
