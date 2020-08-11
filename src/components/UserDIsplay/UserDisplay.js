import React, { useState, useEffect } from 'react';
import { socket } from '../../lib/socket';
import './UserDisplay.css';

const UserDisplay = (props) => {

    const [ users, setUsers ] = useState([]);

    useEffect(() => {
        socket.on('updateUsers', users => {
            setUsers(users);
        });
    }, []);

    const leaveRoom = () => {
        socket.emit("leaveRoom");
    }

    return (
        <div className='user-display'>
            <h1>{props.gameName} - {props.roomNumber}</h1>
            <div className='user-container'>
                {
                    users.map(name => <h1>{name}</h1>)
                }
            </div>
            <button onClick={leaveRoom}>Leave Room</button>
        </div>
    );

}

export default UserDisplay;