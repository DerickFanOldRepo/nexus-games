import React, { useState, useEffect } from 'react';
import { socket } from '../../lib/socket';
import './ChatDisplay.css';

const ChatDisplay = () => {

    const [ chatHistory, setChatHistory ] = useState([]);
    const [ message, setMessage ] = useState();

    useEffect(() => {

        socket.on('updateChatHistory', chatHistory => {
            console.log(chatHistory);
            setChatHistory(chatHistory);
        })

    }, []);

    const sendMessage = () => {
        socket.emit('sendMessage', message);
        setMessage('');
    }

    return (
        <div className='chat-display'>
            <h1>Chat Display</h1>
            {
                chatHistory.map(e => <p><strong>{e.user}: </strong>{e.message}</p>)
            }
            <input type='text' onChange={e => setMessage(e.target.value)} value={message} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );

}

export default ChatDisplay;