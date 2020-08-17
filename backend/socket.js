const Tictactoe = require("./tictactoe");
const Chess = require("./chess");
const Checkers = require("./checkers");
// const cli = require('./cli');

// Inits all the sockets and is exported
const sockets = (io) => {
    io.on("connection", (socket) => {
        // Logs when a user connects to socket
        console.log(`User: ${socket.id} has connected`);

        socket.on("setPlayerName", (name) => {
            // Stores their name in the socket obj
            socket["name"] = name;
        });

        socket.on("joinGame", (gameName) => {
            // Checks if the socket already is in a room
            if (!socket["roomCode"]) {
                switch (gameName.toLowerCase()) {
                    case "tictactoe":
                        Tictactoe(socket, io);
                        break;
                    case "checkers":
                        Checkers(socket, io);
                        break;
                }
            }
        });

        socket.on("disconnect", (reason) => {
            // Logs when a user disconnects from server
            console.log(`User: ${socket.id} has d/c || Reason: ${reason}`);
        });
    });
};

module.exports = sockets;
