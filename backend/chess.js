const Chess = (socket) => {
    
    const rooms = [];

    socket.on('message', (message) => {
        console.log(`Chess: ${message}`);
    });

}

module.exports = Chess;