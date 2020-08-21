const Tictactoe = require("./tictactoe");
const Chess = require("./chess");
const Checkers = require("./checkers");
const Pictionary = require("./pictionary");
// const cli = require('./cli');

// const games = [
//     { ganeName: "tictactoe", maxPlayers: 2 },
//     { ganeName: "checkers", maxPlayers: 2 },
//     { ganeName: "pictionary", maxPlayers: 10 },
// ];

const games = {
    tictactoe: 2,
    checkers: 2,
    pictionary: 10
}

const rooms = {};

// Inits all the sockets and is exported
const sockets = (io) => {
    io.on("connection", (socket) => {
        // Logs when a user connects to socket
        console.log(`User: ${socket.id} has connected`);

        const joinGame = (gameName) => {
            if (socket["roomCode"]) {
                const room = rooms[socket["roomCode"]];
                switch (gameName.toLowerCase()) {
                    case "tictactoe":
                        Tictactoe(socket, io, room);
                        break;
                    case "checkers":
                        Checkers(socket, io, room);
                        break;
                    case "pictionary":
                        Pictionary(socket, io, room);
                        break;
                }
                socket.emit("setGame", gameName.toLowerCase());
            }
        };

        const updateClient = () => {
            const room = rooms[socket["roomCode"]];
            socket.emit("roomJoined", room["roomNumber"]);
            // Sends the sockets in the room the updated list of users
            io.to(socket["roomCode"]).emit(
                "updateUsers",
                Object.values(room["users"])
            );
            // Sends connecting socket the chatHistory
            socket.emit("updateChatHistory", room["chatHistory"]);
        };

        const createRoom = (gameName) => {
            const roomNumber = Math.floor(Math.random() * 100);
            const roomCode = `${gameName}${roomNumber}`;

            socket["roomCode"] = roomCode;
            socket.join(roomCode);

            const room = {
                users: {},
                roomMaster: socket.id,
                chatHistory: [],
                roomNumber: roomNumber,
            };
            room["users"][socket.id] = socket["name"];

            rooms[roomCode] = room;

            joinGame(gameName);
            updateClient();

            socket.emit("setRoomMaster");
        };

        const joinRoom = (gameName, roomNumber) => {
            const roomCode = `${gameName}${roomNumber}`;
            const room = rooms[roomCode];
            // Checks if the room exists
            if (!room) {
                socket.emit("gameError", "Room does not exist");
            } else if (Object.keys(room["users"]).length >= games[gameName.toLowerCase()]) {
                socket.emit("gameError", "Room is full");
            } else {
                socket.join(roomCode);
                socket["roomCode"] = roomCode;
                room["users"][socket.id] = socket["name"];
                joinGame(gameName);
                updateClient();
            }
        };

        const leaveRoom = () => {
            const room = rooms[socket["roomCode"]];
            if (room) {
                // Deletes the user from users
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

                // Removes the socket from the room
                socket.leave(socket["roomCode"]);

                // Deletes the roomCode stored in the socket
                delete socket["roomCode"];

                socket.emit("setGame", null);
            }
        };

        const sendMessage = (messageText) => {
            const room = rooms[socket["roomCode"]];
            const message = {
                user: socket["name"],
                message: messageText,
            };
            room["chatHistory"].push(message);
            io.to(socket["roomCode"]).emit(
                "updateChatHistory",
                room["chatHistory"]
            );
        };

        socket.on("createRoom", createRoom);
        socket.on("joinRoom", joinRoom);
        socket.on("leaveRoom", leaveRoom);
        socket.on("sendMessage", sendMessage);
        socket.on("setPlayerName", (name) => {
            // Stores their name in the socket obj
            socket["name"] = name;
        });

        socket.on("disconnect", (reason) => {
            leaveRoom();
            // Logs when a user disconnects from server
            console.log(`User: ${socket.id} has d/c || Reason: ${reason}`);
        });
    });
};

module.exports = sockets;
