import React, { useState, useEffect } from 'react';
import { socket } from '../../lib/socket';
import './UserDisplay.css';

const UserDisplay = (props) => {

    const [ users, setUsers ] = useState([]);
    
    // When this component unmounts the socket will stop listening
    useEffect(() => {
        socket.removeAllListeners('updateUsers');
    }, []);

    useEffect(() => {
        socket.on('updateUsers', users => {
            setUsers(users);
        });
    }, [users]);

    

    const leaveRoom = () => {
        props.setRoomMaster(false);
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