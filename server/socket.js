// socket.js

const socketIO = require('socket.io');

module.exports = function(server, judgeGPTServer) {
    const io = socketIO(server, {
        cors: {
            origin: "https://brennan.games", // Specify the origins allowed to connect
            methods: ["GET", "POST"]         // Allowed HTTP methods
        },
        transports: ['polling', 'websocket'] // Specify the transports for socket.io
    });

    io.on('connection', async (socket) => {
        // Get client's IP address
        const clientIpAddress = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;

        //Log client joining
        console.log(`A user connected with ID: ${socket.id} from ${clientIpAddress}`);

        var clientID = socket.id;

        //Player has successful joined game, here is player details
        let player = await judgeGPTServer.OnPlayerConnected(clientID);
        socket.emit('OnJoinEvent', { 
            player: player, 
        });

        // Emit status updates to the client at regular intervals
        const interval = setInterval(() => {

            //All details of game
            socket.emit('GameUpdate', { 
                messages: judgeGPTServer.messagesChat.messages,
                playerTurn: judgeGPTServer.GetPlayersTurn(),
                playerList: judgeGPTServer.GetPlayers(),
                winner: judgeGPTServer.winner
            });
        }, 1000);

        //Called when it is your turn
        socket.emit('OnYourTurnEvent', { 
                message: `Hello ${socket.id} from the server! Your IP is ${clientIpAddress}` 
        });

        // 
        socket.on('SubmitTestimony', (data) => {
            console.log('A user submitted a testimony ' + data.testimony);
            judgeGPTServer.SubmitTestimony(data.testimony, clientID);
        });

        // 
        socket.on('Typing', (data) => {
            console.log('A user is typing ' + data.typing);
            judgeGPTServer.UserTyping(data.typing, clientID);
        });

        //
        socket.on('AiRespond', async () => {
            socket.emit('AiResponse', { 
                response: await judgeGPTServer.AiAutoComplete(clientID)
            });
        });

        socket.on('chatroomMessage', (message) => {
            io.emit('chatroomMessage', message); // Broadcast the message to all connected clients
        });

        // 
        socket.on('disconnect', () => {
            judgeGPTServer.OnPlayerDisconnected(clientID);
            console.log('A user disconnected');
            clearInterval(interval); // Stop the status update interval
        });
    });

    return io;
}
