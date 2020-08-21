const rooms = {};

const Checkers = (socket, io, room) => {

    const startGame = () => {
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
            io.to(Object.keys(room["users"])[room["playerTurn"]]).emit(
                "userTurn",
                true
            );
        }
    }

    const playerMove = (row, col) => {

    }

    const bind = () => {
        socket.on('startGame', startGame);
        socket.on("leaveRoom", unbind);
    }
    
    const unbind = () => {
        socket.off('starGame', startGame);
        socket.off("leaveRoom", unbind);
    }

    bind();

} 

module.exports = Checkers;