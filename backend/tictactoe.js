const rooms = {};

const Tictactoe = (socket, io) => {
    const updateClient = () => {
        const room = rooms[socket["roomCode"]];

        socket.emit("setGame", "tictactoe");
        socket.emit("roomJoined", room["roomNumber"]);
        io.to(socket["roomCode"]).emit(
            "updateUsers",
            Object.values(room["users"])
        );
        socket.emit("updateChatHistory", room["chatHistory"]);
    };

    const createRoom = () => {
        const roomNumber = generateRoomNumber();
        const roomCode = `tictactoe${roomNumber}`;
        socket["roomCode"] = roomCode;
        socket.join(roomCode);
        rooms[roomCode] = {
            users: {},
            roomMaster: socket.id,
            playerTurn: 0,
            chatHistory: [],
            roomNumber: roomNumber,
        };
        rooms[roomCode]["users"][socket.id] = socket["name"];

        updateClient();
        socket.emit("setRoomMaster");
    };

    const joinRoom = (roomNumber) => {
        const roomCode = `tictactoe${roomNumber}`;
        const room = rooms[roomCode];
        // Checks if the room exists
        if (!room) {
            socket.emit("gameError", "Room does not exist");
            unbind();
            // Checks if the room is full
        } else if (Object.keys(room["users"]).length >= 2) {
            socket.emit("gameError", "Room is full");
            unbind();
        } else {
            socket.join(roomCode);
            socket["roomCode"] = roomCode;
            room["users"][socket.id] = socket["name"];
            updateClient();
        }
    };

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
    };

    const startGame = () => {
        const room = rooms[socket["roomCode"]];
        // Checks if there are enough players to start
        if (Object.keys(room["users"]).length < 2) {
            socket.emit("gameError", "Not Enough People");
            // Sends all the clients in the room the grid
        } else {
            room["grid"] = [
                ["", "", ""],
                ["", "", ""],
                ["", "", ""],
            ];
            room["gameStatus"] = 0;
            room["turn"] = 0;
            io.to(socket["roomCode"]).emit("startGame", room["grid"]);
            io.to(Object.keys(room["users"])[room["playerTurn"]]).emit(
                "userTurn",
                true
            );
        }
    };

    const playerMove = (row, col) => {
        const room = rooms[socket["roomCode"]];
        const players = Object.keys(room["users"]);
        if (players[room["playerTurn"]] !== socket.id) {
            socket.emit("gameError", "It is not your turn");
        } else if (room["grid"][row][col] !== "") {
            socket.emit("gameError", "Tile already taken");
        } else {
            room["playerTurn"] === 0
                ? (room["grid"][row][col] = "X")
                : (room["grid"][row][col] = "O");

            if (checkWin(room["grid"], row, col)) {
                io.to(socket["roomCode"]).emit(
                    "gameEnd",
                    `${socket["name"]} wins`
                );
            } else if (room["turn"] === 8) {
                io.to(socket["roomCode"]).emit("gameEnd", `It's a tie`);
            } else {
                room["turn"]++;
                io.to(Object.keys(room["users"])[room["playerTurn"]]).emit(
                    "userTurn",
                    false
                );
                room["playerTurn"] ^= 1;
                io.to(Object.keys(room["users"])[room["playerTurn"]]).emit(
                    "userTurn",
                    true
                );
            }
            io.to(socket["roomCode"]).emit("playerMove", room["grid"]);
        }
    };

    const sendMessage = (message) => {
        const room = rooms[socket["roomCode"]];
        const messageObj = {
            user: socket["name"],
            message: message,
        };
        room["chatHistory"].push(messageObj);
        io.to(socket["roomCode"]).emit(
            "updateChatHistory",
            room["chatHistory"]
        );
    };

    const bind = () => {
        // Binds the functions to their corresponding events
        socket.on("createRoom", createRoom);
        socket.on("joinRoom", joinRoom);
        socket.on("startGame", startGame);
        socket.on("leaveRoom", leaveRoom);
        socket.on("playerMove", playerMove);
        socket.on("disconnect", leaveRoom);
        socket.on("sendMessage", sendMessage);
    };
    
    const unbind = () => {
        // Socket leaves the room
        socket.leave(socket["roomCode"]);
        // Removes the roomCode stored in the socket
        delete socket["roomCode"];
        
        // Unbinds the functions to their corresponding events
        socket.off("createRoom", createRoom);
        socket.off("joinRoom", joinRoom);
        socket.off("startGame", startGame);
        socket.off("leaveRoom", leaveRoom);
        socket.off("playerMove", playerMove);
        socket.off("disconnect", leaveRoom);
        socket.off("sendMessage", sendMessage);
    };
    
    bind();
    
};

const generateRoomNumber = () => {
    return Math.floor(Math.random() * 100);
};

const checkWin = (grid, row, col) => {
    // Checks a win on the row
    if (grid[row][0] === grid[row][1] && grid[row][1] === grid[row][2])
        return true;
    // Checks a win on the col
    if (grid[0][col] === grid[1][col] && grid[1][col] === grid[2][col])
        return true;
    // Checks for a diagonal win
    if (row === col) {
        if (grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2])
            return true;
    }
    // Checks for a diagonal win
    if (row + col === 2) {
        if (grid[2][0] === grid[1][1] && grid[1][1] === grid[0][2])
            return true;
    }
    return false;
};

module.exports = Tictactoe;
