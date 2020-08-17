const rooms = {};

const Checkers = (socket, io) => {
    const updateClient = () => {
        const room = rooms[socket['roomCode']];
        socket.emit('setGame', 'checkers');
        socket.emit('roomJoined', room['roomNumber']);
        io.to(socket['roomCode']).emit(
            'updateUsers',
            Object.values(room['users'])
        );
        socket.emit('updateChatHistory', room['chatHistory']);
    };

    const createRoom = () => {
        const roomNumber = generateRoomNumber();
        const roomCode = `checkers${roomNumber}`;
        socket['roomCode'] = roomCode;
        socket.join(roomCode);
        rooms[roomCode] = {
            users: {},
            roomMaster: socket.id,
            playerTurn: 0,
            chatHistory: [],
            roomNumber: roomNumber,
        };
        rooms[roomCode]["users"][socket.id] = socket['name'];

        updateClient();
        socket.emit('setRoomMaster');
    }

    const joinRoom = (roomNumber) => {
        const roomCode = `checkers${roomNumber}`;
        const room = rooms[roomCode];

        if(!room) {
            socket.emit('roomJoinFailed', 'checkers', 'Room does not exist');
            unbind();
        } else if (Object.keys(room["users"]).length >= 2) {
            socket.emit("roomJoinFailed", "checkers", "Room is full");
            unbind();
        } else {
            socket.join(roomCode);
            socket["roomCode"] = roomCode;
            room["users"][socket.id] = socket["name"];
            updateClient();
        }
    }

    const leaveRoom = () => {
        const room = rooms[socket["roomCode"]];
        if (room) {
            delete room["users"][socket.id];

            // Checks if the user leaving is the only user
            if (Object.values(room["users"]).length === 0) {
                delete rooms[socket["roomCode"]];
                // Checks if the user leaving is the current roomMaster
            } else if (room["roomMaster"] === socket.id) {
                room["roomMaster"] = Object.keys(room["users"])[0];
                io.to(room["roomMaster"]).emit("setRoomMaster");
            }
            // Updates the rest of the users that a user has left
            io.in(socket["roomCode"]).emit(
                "updateUsers",
                Object.values(room["users"])
            );

            // Unbinds all the events on this socket
            unbind();

            // Notifies the socket they have left the game
            socket.emit("setGame", null);
        }
    }

    const startGame = () => {
        const room = rooms[socket['roomCode']];

        if (Object.keys(room['users']).length < 2) {
            socket.emit('gameError', 'Not enough people');
        } else {
            room['grid'] = Array(64);
            for(let i = 0; i < 64; i++) {
                const row = Math.floor(i/ 8) % 2; 
                const color = row === 0 && i % 2 == 0 || row === 1 && i % 2 == 1;
                if (color && i < 24) {
                    room['grid'][i] = -1; 
                } else if (color && i > 40) {
                    room['grid'][i] = 1; 
                }
            }
            io.to(socket["roomCode"]).emit("startGame", room["grid"]);
        }
    }

    const playerMove = (row, col) => {

    }

    const sendMessage = (message) => {
        const room = rooms[socket["roomCode"]];
        const messageObj = {
            user: socket["name"],
            message: message,
        }
        room["chatHistory"].push(messageObj);
        io.to(socket["roomCode"]).emit(
            "updateChatHistory",
            room["chatHistory"]
        );
    }

    const bind = () => {
        socket.on('createRoom', createRoom);
        socket.on('joinRoom', joinRoom);
        socket.on('startGame', startGame);
        socket.on('leaveRoom', leaveRoom);
        socket.on('disconnect', leaveRoom);
        socket.on('sendMessage', sendMessage);
    }
    
    const unbind = () => {
        // Socket leaves the room
        socket.leave(socket["roomCode"]);
        // Removes the roomCode stored in the socket
        delete socket["roomCode"];
        
        socket.off('createRoom', createRoom);
        socket.off('joinRoom', joinRoom);
        socket.off('starGame', startGame);
        socket.off('leaveRoom', leaveRoom);
        socket.off('disconnect', leaveRoom);
        socket.off('sendMessage', sendMessage);
    }

    bind();

} 

const generateRoomNumber = () => {
    return Math.floor(Math.random() * 100);
};

module.exports = Checkers;