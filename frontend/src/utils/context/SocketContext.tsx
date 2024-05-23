import { createContext } from 'react'
import socketIO from "socket.io-client";

export const socket = socketIO("http://localhost:4000/", { transports: ["websocket"] });

export const SocketContext = createContext(socket)