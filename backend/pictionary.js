const rooms = {};

const Pictionary = (socket, io, room) => {

    const startDrawing = (offsetX, offsetY) => {
        socket.to(socket["roomCode"]).emit("startDrawing", offsetX, offsetY);
    }
        
    const draw = (offsetX, offsetY) => {
        socket.to(socket["roomCode"]).emit("draw", offsetX, offsetY);
            
    }
        
    const finishDrawing = () => {
        socket.to(socket["roomCode"]).emit("finishDrawing");
    }


    const bind = () => {
        socket.on("leaveRoom", unbind);
        socket.on("startDrawing", startDrawing);
        socket.on("draw", draw);
        socket.on("finishDrawing", finishDrawing);
    }
    
    const unbind = () => {
        socket.off("leaveRoom", unbind);
        socket.off("startDrawing", startDrawing);
        socket.off("draw", draw);
        socket.off("finishDrawing", finishDrawing);
    }

    bind();

}

module.exports = Pictionary;