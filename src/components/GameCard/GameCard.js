import React, { useState, useEffect } from "react";
import { socket } from "../../lib/socket";
import "./GameCard.css";

const GameCard = (props) => {
    const [roomNumber, setRoomNumber] = useState();

    const createRoom = () => {
        socket.emit("joinGame", props.gameName);
        socket.emit("createRoom");
    };

    const joinRoom = () => {
        if (roomNumber) {
            socket.emit("joinGame", props.gameName);
            socket.emit("joinRoom", roomNumber);
        } else {
            setRoomNumber("");
        }
    };

    return (
        <div className="game-card">
            <h1>{props.gameName}</h1>
            {roomNumber !== undefined ? (
                <input
                    type="text"
                    placeholder="code"
                    onChange={(e) => setRoomNumber(e.target.value)}
                    minLength={0}
                    maxLength={3}
                ></input>
            ) : (
                <div></div>
            )}
            <div className="menu-buttons">
                <button onClick={createRoom}>Create</button>
                <button onClick={joinRoom}>Join</button>
            </div>
        </div>
    );
};

export default GameCard;
