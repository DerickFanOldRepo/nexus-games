import React, { useState, useEffect, Fragment } from "react";
import './Checkers.css';
import { socket } from "../../lib/socket";

const Checkers = (props) => {
    const [grid, setGrid] = useState();
    // const [grid, setGrid] = useState(Array.from(Array(64).keys()));
    const [playerTurn, setPlayerTurn] = useState();
    const [gameStatus, setGameStatus] = useState();
    
    useEffect(() => {
        socket.removeAllListeners('startGame');
        socket.removeAllListeners('playerMove');
        socket.removeAllListeners('userTurn');
        socket.removeAllListeners('gameEnd');
    }, []);
    
    useEffect(() => {
        socket.on("startGame", (grid) => {
            setGrid(grid);
        });
        socket.on("playerMove", (grid) => {

        });
        socket.on("userTurn", (turn) => {
            setPlayerTurn(turn);
        });
        socket.on("gameEnd", (status) => {

        });
    }, [grid, playerTurn, gameStatus]);

    const startGame = () => {
        socket.emit("startGame");
    }

    return (
        <div className='game-display'>
            {grid ? (
                <Fragment>
                    {
                        playerTurn ? <h1>Your Turn</h1> : <h1>Not Your Turn</h1>
                    }
                    <Board grid={grid}/>
                </Fragment>
            ) : props.roomMaster ? (
                    <button onClick={startGame}>Start Game</button>
            ) : (
                <h1>Waiting...</h1>
            )}
        </div>
    );
    
}



const Board = (props) => {
    return (
        <div className='board'>
            {
                displayBoard(props.grid)
            }
        </div>
    )
}
const displayBoard = (grid) => {
    const temp = [];
    for (let i = 0; i < grid.length; i++) {
        temp[i] = <Cell index={i} value={grid[i]}/>
    }
    return temp;
}

const Cell = (props) => {

    const row = Math.floor(props.index / 8) % 2; 
    const color = row === props.index % 2 ? "red" : "black";

    const handleClick = () => {
        console.log(props.index);
    }
    
    return (
        <span onClick={handleClick} className={`cell ${color}`}>
            {
                props.value === 1 ? <span className='circle-red' /> 
                : props.value === -1 ? <span className='circle-black' />
                : <span />
            }
        </span>
    )

} 

export default Checkers;