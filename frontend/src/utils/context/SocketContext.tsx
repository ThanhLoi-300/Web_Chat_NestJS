import { createContext } from 'react'
// import { io } from 'socket.io-client'
import socketIO from "socket.io-client";

// export const socket = io("http://localhost:3001", {
//     withCredentials: true
// })

export const socket = socketIO("http://localhost:4000/", { transports: ["websocket"] });

export const SocketContext = createContext(socket)