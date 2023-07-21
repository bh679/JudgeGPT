
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
const JudgeGPTServer = require('./JudgeGPTServer');
const judgeGPTServer = new JudgeGPTServer();
judgeGPTServer.Start();


// Use cors middleware for handling Cross-Origin Resource Sharing
app.use(cors());

// Tell Express to parse JSON in the body of incoming requests.
app.use(express.json());

// Log all incoming requests
app.use(function(req, res, next) {
    if(req.url != "/Update")
        console.log(`${req.method} request for '${req.url}'`);
    next();  // Pass control to the next middleware function
});

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


app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io/client-dist'));

// Create HTTPS server
const server = https.createServer(options, app);/*.listen(3000, function () {
    console.log('HTTPS server listening on port 3000!');
});*/

//const io = new socketIO.Server(server);
//const io = require('socket.io')(server, { transports: ['polling', 'websocket'] });
const io = require('socket.io')(server, {
    cors: {
        origin: "https://brennan.games", // This is the origin that is allowed to connect
        methods: ["GET", "POST"]
    },
    transports: ['polling', 'websocket']
});

const port = 3000; // Typically, HTTPS servers use port 443 by default
server.listen(port, () => {
    console.log(`Secure server is running on port ${port}`);
});

io.on('connection', (socket) => {
    const clientIpAddress = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
    
    console.log(`A user connected with ID: ${socket.id} from ${clientIpAddress}`);
    
    // Set up an interval to emit messages
    const interval = setInterval(() => {
        socket.emit('StatusUpdate', { message: `Hello ${socket.id} from the server! Your IP is ${clientIpAddress}` });
    }, 1000);


    // Listen for the 'testEvent' event
    socket.on('GetStatus', (data) => {
        console.log('Received GetStatus with data:', data);

        // Emit a response event back to the client
        socket.emit('GetStatusResponse', { message: 'Hello from the server!' });
    });


    // Clear the interval when the user disconnects
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        clearInterval(interval);
    });
});
