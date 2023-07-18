// Import required modules
var express = require('express');
var cors = require('cors');
var https = require('https');
var fs = require('fs');
var app = express();

const PromptGPT = require('./PromptGPT');

const JudgeGPTServer = require('./JudgeGPTServer');
const judgeGPTServer = new JudgeGPTServer();
judgeGPTServer.Start();

// Use cors middleware for handling Cross-Origin Resource Sharing
app.use(cors());

/*app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    return callback(null, true);
  }
}));*/

/*app.use(cors({
  origin: 'https://brennan.games'
}));*/

// Tell Express to parse JSON in the body of incoming requests.
app.use(express.json());

// Log all incoming requests
app.use(function(req, res, next) {
    console.log(`${req.method} request for '${req.url}'`);
    next();  // Pass control to the next middleware function
});


// Define a GET route for '/getData'
app.get('/GetGameState', function (req, res) {
    res.send({ 
        messages: judgeGPTServer.messagesChat.messages,
        playerTurn: judgeGPTServer.playersTurn()
        });
});

app.post

// Define a POST route for '/startUnFake'
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

/*/ Define a POST route for '/startUnFake'
app.post('/MJImage', function (req, res) {
    // Log the body of the request
    //console.log(req.body);

    // Extract youtubeId from the request body
    const prompt = req.body.prompt;

    // Log the prompt
    console.log(prompt);

    // Create a new OpenAI Reponse with prompt
    TNLMJImages[prompt] = new TNLMJ(prompt);

    // Get the response 
    TNLMJImages[prompt].GetImage().then((data) => {
        //console.log(data);
        console.log(data.imageUrl);
        res.json({ //why not make res.json = data
            image: data.imageUrl,
            inputPrompt: data.inputPrompt
        });
    })
    .catch((error) => {
        // If there is an error, log it and send a response
        console.error(error);
        res.json("error");
    });

});*/

const axios = require('axios');

/*
// Define a POST route for '/DiscrdWebHook'
app.post('/DiscrdWebHook', function (req, res) {
    // Log the body of the request
    console.log(req.body);

    // Extract message from the request body
    const message = req.body.message;

    // Log the message
    console.log(message);

    // Send a POST request to the Discord webhook URL
    axios.post("https://discord.com/api/webhooks/1130070499758723136/zYUTrekJr89xCLwci3H4EQqtQuqPQX_ib0QedAWdEaHJFmOSDrkbrLITeMd9BBiTxoUg", {
        content: message
    })
    .then(function (response) {
        //console.log('Message sent successfully');
    })
    .catch(function (error) {
        console.error('Error sending discord message:', error);
    });
});*/


// Define HTTPS credentials
var options = {
  key: fs.readFileSync('/opt/bitnami/apache/conf/brennan.games.key'),
  cert: fs.readFileSync('/opt/bitnami/apache/conf/brennan.games.crt')
};

// Create HTTPS server
https.createServer(options, app).listen(3000, function () {
    console.log('HTTPS server listening on port 3000!');
});



