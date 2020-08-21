import React, { useEffect, useState, Fragment, useRef } from "react";
import { socket } from "../../lib/socket";
import "./Pictionary.css";

const Pictionary = (props) => {

    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const context2Ref = useRef(null);
    const [ isDrawing, setIsDrawing ] = useState();
    
    useEffect(() => {
        
        const canvas = canvasRef.current;
        canvas.width = 400;
        canvas.height = 400;
        
        const context = canvas.getContext("2d");
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 2;
        contextRef.current = context;
        
        const context2 = canvas.getContext("2d");
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 2;
        context2Ref.current = context2;

    }, []);
    
    useEffect(() => {
        
        socket.on("startDrawing", (offsetX, offsetY) => {
            context2Ref.current.beginPath();
            context2Ref.current.moveTo(offsetX, offsetY);
        });
        
        socket.on("draw", (offsetX, offsetY) => {
            context2Ref.current.lineTo(offsetX, offsetY);
            context2Ref.current.stroke();
        });
        
        socket.on("finishDrawing", () => {
            context2Ref.current.closePath();
        });

    }, []);

    const startDrawing = ({nativeEvent}) => {
        const { offsetX, offsetY } = nativeEvent;
        // console.log(offsetX, offsetY);
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
        socket.emit("startDrawing", offsetX, offsetY);
      }
      
    const finishDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
        socket.emit("finishDrawing");
    }
    
    const draw = ({nativeEvent}) => {
        if(!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
        socket.emit("draw", offsetX, offsetY)
    }

    return (
        <div className="game-display">
            <h1>Pictionary</h1>
            <canvas 
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                ref={canvasRef}
            />
        </div>
    );
};

export default Pictionary;
