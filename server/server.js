

// Required libraries
const cors = require('cors');             // Middleware for enabling CORS (Cross-Origin Resource Sharing)
const axios = require('axios');           // Promise based HTTP client for node.js
const fs = require('fs');                 // Node.js File System module for reading/writing files
const express = require('express');       // Express.js framework for building web applications
const https = require('https');           // HTTPS module for creating HTTPS server
const socketIO = require('socket.io');    // Socket.io library for real-time bidirectional event-based communication

// Define HTTPS credentials using the File System (fs) to read the key and certificate files
const options = {
  key: fs.readFileSync('/opt/bitnami/apache/conf/brennan.games.key'),   // Path to private key
  cert: fs.readFileSync('/opt/bitnami/apache/conf/brennan.games.crt')   // Path to certificate file
};

// Create an instance of an Express application
const app = express();

//For Older Version of JudgeGPT
const PromptGPT = require('./PromptGPT');
let promptResponse = {};

//Judge GPT
const RandomLines = require('./RandomLines');
const BackgroundImages = require('./BackgroundImages');
const JudgeGPTServer = require('./JudgeGPTServer');
const { Speak, ResetCache } = require('./ElevenLabsServer');// Import functions from 'ElevenLabsServer.js'
//const Transcribe = require('./WhisperTranscribeServer');// Import function from 'WhisperTranscribe.js'

console.log(JudgeGPTServer);
var judgeGPTServer = new JudgeGPTServer(Restart);
judgeGPTServer.Start();


// Use cors middleware for handling Cross-Origin Resource Sharing
app.use(cors());

// Tell Express to parse JSON in the body of incoming requests.
app.use(express.json());

// Log all incoming requests
app.use(function(req, res, next) {
    console.log(`${req.method} request for '${req.url}'`);
    next();  // Pass control to the next middleware function
});

// Use the 'Speak' function as a route handler for the '/Speak' route - Eleven Labs
app.post('/Speak', Speak);

//Use the 'Transcribe' function as a route handler for the '/Transcribe' route - Whisper OpenAI
//app.post('/Transcribe', Transcribe);

// Restart the server
app.get('/Restart', function (req, res) {
    Restart();
});

function Restart()
{
    ResetCache();

    judgeGPTServer.Stop();
    judgeGPTServer = new JudgeGPTServer(Restart);
    judgeGPTServer.Start();

    io.emit('ReloadPage',"");
}

// Call to GPT for older version of JudgeGPT
app.post('/AskGPT', function (req, res) {
    // Log the body of the request
    console.log(req.body);

    // Extract youtubeId from the request body
    const prompt = req.body.prompt;

    // Log the prompt
    console.log(prompt);

    // Create a new OpenAI Reponse with prompt
    promptResponse[prompt] = new PromptGPT(prompt);

    // Get the response 
    promptResponse[prompt].AskGPT().then((data) => {
        console.log(data);
        console.log(data.generatedText);
        res.json({ //why not make res.json = data
            generatedText: data.generatedText,
            inputPrompt: data.inputPrompt
        });
    })
    .catch((error) => {
        // If there is an error, log it and send a response
        console.error(error);
        res.json("error");
    });

});

// Update the POST handler to be async
app.post('/GetCase', async function (req, res) {
    console.log(req.body);
    const data = req.body.data;
    console.log('Get case ' + JSON.stringify(data));

    try {
        const gameCase = await judgeGPTServer.GetCase(data);
        console.log("case: " + JSON.stringify(gameCase));
        res.json({ case: gameCase });
    } catch (error) {
        console.error("Error fetching case:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update the POST handler to be async
app.post('/GetCaseMaxID', async function (req, res) {
    //console.log(req.body);
    //const data = req.body.data;
    //console.log('Get case ' + JSON.stringify(data));

    try {
        const MaxID = await judgeGPTServer.GetCaseMaxID();
        console.log("MaxID: " + JSON.stringify(MaxID));
        res.json({ MaxID: MaxID });
    } catch (error) {
        console.error("Error fetching case:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


//-------------------------
//  Socket.io
//-------------------------

// Serve static files related to socket.io from the node_modules directory
app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io/client-dist'));

// Define the port and HTTPS server options
const port = 3000;  // Define server port. Note: HTTPS servers typically use port 443 by default.

// Create and start the HTTPS server
var server = https.createServer(options, app).listen(port, () => {
    console.log(`Secure server is running on port ${port}`);
});

// Socket.io configuration
const io = socketIO(server, {
    cors: {
        origin: "https://brennan.games", // Specify the origins allowed to connect
        methods: ["GET", "POST"]         // Allowed HTTP methods
    },
    transports: ['polling', 'websocket'] // Specify the transports for socket.io
});

// Handle client connections using socket.io
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

    /*console.log("sending player name to chat");
    console.log(player);
    console.log(player.name);*/
    if(player != null)
        io.emit('chatroomMessage', player.name + " has connected to the courtroom as a " + player.role);

    // Emit status updates to the client at regular intervals
    const interval = setInterval(() => {

        //All details of game
        socket.emit('GameUpdate', { 
            messages: judgeGPTServer.messagesChat.messages,
            playerTurn: judgeGPTServer.GetPlayersTurn(),
            playerList: judgeGPTServer.GetPlayers(),
            bg: judgeGPTServer.backgroundImage,
            winner: judgeGPTServer.winner
        });
        //console.log(judgeGPTServer.messagesChat.messages);
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


    /*/
    socket.on('heartbeat', () => {
        PlayerHeartBeat(clientIpAddress);
    });*/

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