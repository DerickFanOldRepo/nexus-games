import React, { useEffect, useState, Fragment } from 'react';
import UserDisplay from '../UserDIsplay/UserDisplay';
import ChatDisplay from '../ChatDisplay/ChatDisplay';
import { socket } from '../../lib/socket';
import './TicTacToe.css';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

const TicTacToe = (props) => {

    const [ roomNumber, setRoomNumber ] = useState();
    const [ grid, setGrid ] = useState();
    const [ roomMaster, setRoomMaster ] = useState();
    const [ playerTurn, setPlayerTurn ] = useState(); 
    const [ gameError, setGameError ] = useState();
    const [ gameStatus, setGameStatus ] = useState();

    useEffect(() => {
        socket.on('roomCreated', roomNumber => {
            setRoomNumber(roomNumber);
        });
        socket.on('roomJoined', roomNumber => {
            setRoomNumber(roomNumber);
        });
        socket.on('setRoomMaster', () => setRoomMaster(true));
        socket.on('startGame', grid => {
            setGameStatus(false);
            setGrid(grid);
        });
        socket.on('playerMove', grid => {
            setGameError();
            setGrid(grid);
        });
        socket.on('userTurn', turn => setPlayerTurn(turn));
        socket.on('gameError', error => setGameError(error));
        socket.on('gameEnd', status => {
            setGameStatus(status);
            setPlayerTurn();
        });
    }, []);
    
    const startGame = () => {
        socket.emit('startGame');
    }

    return (
        <div className='room'>
            <UserDisplay gameName='TicTacToe' roomNumber={roomNumber}/>
            <div className='game-display'>
                {
                    grid
                    ? <Fragment>
                        {
                            gameStatus 
                            ? <h1>{gameStatus}</h1> 
                            : playerTurn ? <h1>Your Turn</h1> 
                            : <h1>Not Your Turn</h1>
                        }
                        <Grid grid={grid}/>
                        {
                            gameStatus && roomMaster
                            ? <button onClick={startGame}>New Game</button>
                            : <div></div>
                        }
                    </Fragment>
                    : roomMaster ? <button onClick={startGame}>Start Game</button>
                    : <h1>Waiting...</h1>
                }
                {
                    gameError ? <ErrorMessage error={gameError} setError={setGameError}/> : <div /> 
                }
            </div>
            <ChatDisplay />
        </div>
    );

}

const Grid = (props) => {

    return (
        <table>
            <tbody>
                <Row rowIdx={0} row={props.grid[0]}/>
                <Row rowIdx={1} row={props.grid[1]}/>
                <Row rowIdx={2} row={props.grid[2]}/>
            </tbody>
        </table>
    );

}

const Row = (props) => {

    return (
        <tr>
            <Cell rowIdx={props.rowIdx} colIdx={0} cell={props.row[0]}/>
            <Cell rowIdx={props.rowIdx} colIdx={1} cell={props.row[1]}/>
            <Cell rowIdx={props.rowIdx} colIdx={2} cell={props.row[2]}/>
        </tr>
    );

}

const Cell = (props) => {

    const playerMove = () => {
        socket.emit('playerMove', props.rowIdx, props.colIdx);
    }

    return (
        <td onClick={playerMove}>
            {
                props.cell === 'X' 
                ? <i class="fas fa-times fa-6x"></i>
                : props.cell === 'O' ? <i class="far fa-circle fa-6x"></i>
                : <div></div>
            }
        </td>
    );

}

export default TicTacToe;