import io from 'socket.io-client';
import dotenv from 'dotenv';

dotenv.config();

export const socket = io(process.env.REACT_APP_BACKEND_SERVER);

