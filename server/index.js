import express from "express"
import cors from "cors"
import connectToMongo from "./Config/dbConfig.js";
import userRouter from "./Routes/auth.js"
import avatarRoute from "./Routes/avatar.js"
import allUsers from "./Routes/users.js"
import { createServer } from "http";
import { Server } from "socket.io";
import fetchChat from "./Routes/chat.js";

const app = express()
const server = createServer(app)
connectToMongo();
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "PUSH"],
        credentials: true
    }
})

const port = 7000;
app.use(cors());
app.use(express.json());

app.use("/auth", userRouter);
app.use("/set", avatarRoute);
app.use("/get", allUsers);
app.use("/chat", fetchChat);


app.get("/", (req, res) => {
    res.send("Hey why you came here!")
})
let activeUsers = [];

io.on("connection", (socket) => {
    socket.on("new-user-add", (newUserId)=>{
        if (newUserId !== "") {
            if (!activeUsers.some((user)=>user.userId === newUserId)) {
                activeUsers.push({
                    userId : newUserId,
                    socketId: socket.id,
                    peerId: ""
                })            
            }
        }
        io.emit('get-users',activeUsers)
    })

    socket.on("send-message",(data)=>{
        const {receiver } = data;
        const user = activeUsers.find((user)=>user.userId === receiver ) 
        if (user) {
            io.to(user.socketId).emit("receive-message" , data)            
        }
    })

  socket.on("peerID", (data) => {
    const { id, peerId } = data;
    

    const userIndex = activeUsers.findIndex(user => user.userId === id);

    if (userIndex !== -1) {
        // Update the existing user object with peerId
        activeUsers[userIndex].peerId = peerId;
    } 
    io.emit('get-users', activeUsers);
});


    socket.on('disconnect', () => {
        activeUsers = activeUsers.filter((user)=> user.socketId !== socket.id);
        io.emit('get-users',activeUsers)
    });
})

server.listen(port, () => {
    console.log("server is healthy 🟢: PORT=", port)
})