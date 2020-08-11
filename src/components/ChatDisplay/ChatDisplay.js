import React, { useState, useEffect } from "react";
import { animateScroll } from "react-scroll";
import { socket } from "../../lib/socket";
import "./ChatDisplay.css";

const ChatDisplay = () => {
    const [chatHistory, setChatHistory] = useState([]);
    const [message, setMessage] = useState();

    useEffect(() => {
        socket.on("updateChatHistory", (chatHistory) => {
            setChatHistory(chatHistory);
            scrollToBottom();
        });
    }, []);

    const sendMessage = () => {
        socket.emit("sendMessage", message);
        setMessage("");
    };

    const keyInput = (event) => {
        if (event.charCode === 13 && message) {
            sendMessage();
        }
    };

    const scrollToBottom = () => {
        animateScroll.scrollToBottom({
            containerId: "message-container",
            duration: 0,
        });
    };

    return (
        <div className="chat-display">
            <h1>Chat Display</h1>
            <div className="message-container" id="message-container">
                {chatHistory.map((e) => (
                    <p>
                        <strong>{e.user}</strong>: {e.message}
                    </p>
                ))}
            </div>
            <input
                type="text"
                onKeyPress={(event) => keyInput(event)}
                onChange={(event) => setMessage(event.target.value)}
                value={message}
            />
        </div>
    );
};

export default ChatDisplay;
