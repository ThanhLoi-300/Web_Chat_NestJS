import { createContext } from 'react'
import socketIO from "socket.io-client";

export const socket = socketIO("https://web-chat-nestjs.onrender.com/", { transports: ["websocket"] });

export const SocketContext = createContext(socket)