// Import required modules
var express = require('express');
var cors = require('cors');
var app = express();
const VideoTranscriber = require('./VideoTranscriber');
const fs = require('fs');

// Use cors middleware for handling Cross-Origin Resource Sharing
app.use(cors());

// Tell Express to parse JSON in the body of incoming requests.
app.use(express.json());

// Log all incoming requests
app.use(function(req, res, next) {
    console.log(`${req.method} request for '${req.url}'`);
    next();  // Pass control to the next middleware function
});

// Define a GET route for '/getData'
app.get('/getData', function (req, res) {
    res.send({ data: "Hello from Node.js!" });
});

// Start the server and listen on port 3000
app.listen(3000, function () {
    console.log('App listening on port 3000!');
});

let unfakes = {};

// Define a POST route for '/startUnFake'
app.post('/startUnFake', function (req, res) {
    // Log the body of the request
    console.log(req.body);

    // Extract youtubeId from the request body
    const videoId = req.body.youtubeId;

    // Log the videoId
    console.log(videoId);

    // Check if we already have a VideoTranscriber for this videoId
    if (unfakes.hasOwnProperty(videoId)) {
        unfakes[videoId].addCallback((error, data) => {
            // If there is an error, log it and send a response
            if (error) {
                console.error(error);
                res.json("error");
                return;
            }

            // Log the data and send a response
            console.log(data);
            console.log(data.generatedText);
            console.log(data.videoName);
            res.json({
                generatedText: data.generatedText,
                videoName: data.videoName
            });
        });
    }
    else {
        // Create a new VideoTranscriber for this videoId
        unfakes[videoId] = new VideoTranscriber(videoId);
    
        // Transcribe the video and send a response
        unfakes[videoId].transcribeVideo().then((data) => {
            console.log(data);
            console.log(data.generatedText);
            console.log(data.videoName);
            res.json({
                generatedText: data.generatedText,
                videoName: data.videoName
            });
        })
        .catch((error) => {
            // If there is an error, log it and send a response
            console.error(error);
            res.json("error");
        });
    }
});

// Define a POST route for '/updateUnFake'
app.post('/updateUnFake', function (req, res) {
    // Extract youtubeId from the request body
    const videoId = req.body.youtubeId;

    console.log("here");

    // Check if we have a VideoTranscriber for this videoId
    if (unfakes.hasOwnProperty(videoId)) {
        console.log(unfakes[videoId].status.finished);
        res.json({
            finished: unfakes[videoId].status.finished,
            status: unfakes[videoId].status.progress,
            generatedText:  unfakes[videoId].status.generatedText,
            videoName:  unfakes[videoId].status.videoName
        });
        console.log("Video details returned.");
    } else {
        console.log("Video id not found.");
    }
});

// Define a POST route for '/save'
app.post('/save', function(req, res) {
    console.log(req);
    console.log(req.body);
    console.log(req.body.content);
    console.log('File Save Request!' + req.body.content);

    // Write the request body content to a file
    fs.writeFileSync('prompt.txt', req.body.content, (err) => {
        if (err) throw err;
        console.log('Download status has been written to downloadStatus.txt');
        res.send('File saved!');
    });
});
