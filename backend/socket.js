const Tictactoe = require('./tictactoe');
const Chess = require('./chess');
const cli = require('./cli');

// Inits all the sockets and is exported
const sockets = (io) => {
    
    io.on('connection', socket => {

        console.log(`User: ${socket.id} has connected`);

        socket.on('setPlayerName', name => {
            socket['name'] = name;
            console.log(socket['name']);
        }); 

        socket.on('joinGame', (gameName) => {
            if(!socket['roomCode']) {
                switch(gameName.toLowerCase()) {
                    case 'tictactoe':
                        Tictactoe(socket, io);
                        break;
                    case 'chess':
                        Chess(socket, io);
                        break;
                }
            }
        });
    
        socket.on('disconnect', (reason) => {
            console.log(`User: ${socket.id} has d/c || Reason: ${reason}`);
        });
    
    });    

}

const namespaces = {
    tictactoe: Tictactoe,
    chess: Chess,
}

// cli(namespaces);



module.exports = sockets;