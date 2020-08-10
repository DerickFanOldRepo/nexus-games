const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

const cli = (namespaces) => {

    rl.on('line', line => {
        switch(line.trim()) {
            case 't':
                namespaces.tictactoe.printRooms();
                break;
            default:
                console.log('Not a valid command');
        }
    }).on('close', () => {
        console.log('CLI closed');
        process.exit(0);
    });

}

module.exports = cli;