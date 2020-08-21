

const Tictactoe = (socket, io, room) => {

    const startGame = () => {
        // const room = rooms[socket["roomCode"]];
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
            room["playerTurn"] = 0;
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
        // const room = rooms[socket["roomCode"]];
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

    const bind = () => {
        // Binds the functions to their corresponding events
        socket.on("startGame", startGame);
        socket.on("playerMove", playerMove);
        socket.on("leaveRoom", unbind);
    };
    
    const unbind = () => {
        // Unbinds the functions to their corresponding events
        socket.off("startGame", startGame);
        socket.off("playerMove", playerMove);
        socket.off("leaveRoom", unbind);
    };
    
    bind();
    
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
