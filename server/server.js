// Import required modules
var express = require('express');
var cors = require('cors');
var https = require('https');
var fs = require('fs');
var app = express();
const PromptGPT = require('./PromptGPT');

let promptResponse = {};

// Use cors middleware for handling Cross-Origin Resource Sharing
app.use(cors());

// Tell Express to parse JSON in the body of incoming requests.
app.use(express.json());

// Log all incoming requests
app.use(function(req, res, next) {
    console.log(`${req.method} request for '${req.url}'`);
    next();  // Pass control to the next middleware function
});


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

// Define HTTPS credentials
var options = {
  key: fs.readFileSync('/opt/bitnami/apache/conf/brennan.games.key'),
  cert: fs.readFileSync('/opt/bitnami/apache/conf/brennan.games.crt')
};

// Create HTTPS server
https.createServer(options, app).listen(3000, function () {
    console.log('HTTPS server listening on port 3000!');
});
