import io from 'socket.io-client';
import dotenv from 'dotenv';

dotenv.config();


const URL = process.env.REACT_APP_URL || '';

export const socket = io(URL);

