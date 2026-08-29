import { WebSocketServer, WebSocket } from "ws";
const wss = new WebSocketServer({ port: 8080 });
//read abt record and maps in ts
let userCount = 0;
let allsockets = [];
wss.on("connection", (socket) => {
    const generateId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
    };
    const getUsersRoom = (room) => {
        return allsockets.filter(x => x.room == room).map(x => ({ id: x.id, username: x.username }));
    };
    socket.on("message", (event) => {
        //we will receive a full object not text
        const parsedMessage = JSON.parse(event);
        const id = generateId();
        if (parsedMessage.type == "create") {
            allsockets.push({
                socket,
                id: id,
                room: parsedMessage.payload.roomId,
                username: parsedMessage.payload.username,
                isCreator: true
            });
            socket.send(JSON.stringify({ type: "joined",
                payload: {
                    id: id,
                    creator: true
                }
            }));
            const usersInRoom = getUsersRoom(parsedMessage.payload.roomId);
            allsockets.forEach(x => {
                if (x.room == parsedMessage.payload.roomId) {
                    x.socket.send(JSON.stringify({
                        type: "users",
                        payload: usersInRoom
                    }));
                }
            });
        }
        if (parsedMessage.type == "join") {
            const roomExists = allsockets.some(x => x.room === parsedMessage.payload.roomId);
            if (!roomExists) {
                socket.send(JSON.stringify({
                    type: "error",
                    message: "Room doesn't exist. Create one!"
                }));
                return;
            }
            allsockets.push({
                socket,
                id: id,
                room: parsedMessage.payload.roomId,
                username: parsedMessage.payload.username,
                isCreator: false
            });
            socket.send(JSON.stringify({ type: "joined",
                payload: {
                    id,
                    creator: false
                }
            }));
            const usersInRoom = getUsersRoom(parsedMessage.payload.roomId);
            allsockets.forEach(x => {
                if (x.room == parsedMessage.payload.roomId) {
                    x.socket.send(JSON.stringify({
                        type: "users",
                        payload: usersInRoom
                    }));
                }
            });
        }
        if (parsedMessage.type == "chat") {
            //console.log("chat rec", parsedMessage)
            const currentRoom = allsockets.find((x) => x.socket == socket)?.room;
            const currentUser = allsockets.find((x) => x.socket == socket)?.username;
            for (let i = 0; i < allsockets.length; i++) {
                if (allsockets[i]?.room == currentRoom) {
                    allsockets[i]?.socket.send(JSON.stringify({
                        type: "chat",
                        id: parsedMessage.payload.id,
                        username: currentUser,
                        message: parsedMessage.payload.message
                    }));
                }
            }
        }
        if (parsedMessage.type == "ban") {
            const currentUser = allsockets.find(x => x.socket === socket);
            if (!currentUser) {
                return;
            }
            if (!currentUser.isCreator) {
                socket.send(JSON.stringify({
                    type: "error",
                    message: "only creator can ban"
                }));
                return;
            }
            const userToBan = allsockets.find(x => x.id === parsedMessage.payload.id);
            if (!userToBan)
                return;
            //creator can ban themselve
            if (userToBan.id === currentUser.id) {
                return;
            }
            userToBan.socket.send(JSON.stringify({
                type: "banned"
            }));
            userToBan.socket.close();
        }
        //    
    });
    socket.on("close", () => {
        const user = allsockets.find(x => x.socket === socket);
        if (!user)
            return;
        const room = user.room;
        allsockets = allsockets.filter(x => x.socket !== socket);
        const userInRoom = getUsersRoom(room);
        allsockets.forEach(x => {
            if (x.room === room) {
                x.socket.send(JSON.stringify({
                    type: "users",
                    payload: userInRoom
                }));
            }
        });
        //console.log("after leaving: ", allsockets.map(x=>({room: x.room,username:x.username})))
    });
});
//# sourceMappingURL=index.js.map