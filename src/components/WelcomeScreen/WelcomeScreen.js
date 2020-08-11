import React, { useState } from "react";
import "./WelcomeScreen.css";
import { socket } from "../../lib/socket";

const WelcomeScreen = (props) => {
    const [playerName, setPLayerName] = useState("");

    const enterUser = () => {
        if (playerName.trim().length > 0) {
            props.setPlayerName(playerName);
            socket.emit("setPlayerName", playerName);
        }
    };

    return (
        <div className="welcome-screen">
            <h1>Nexus Games</h1>
            <input
                type="text"
                placeholder="name"
                onChange={(e) => setPLayerName(e.target.value)}
                maxLength={15}
            />
            <button onClick={enterUser}>Enter</button>
        </div>
    );
};

export default WelcomeScreen;
