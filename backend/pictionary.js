const rooms = {};

const Pictionary = (socket, io, room) => {

    const bind = () => {
        socket.on("leaveRoom", unbind);
    }

    const unbind = () => {
        socket.off("leaveRoom", unbind);
    }

    bind();

}

module.exports = Pictionary;