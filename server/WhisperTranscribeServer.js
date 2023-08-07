//https://chat.openai.com/share/cd8628b6-1fed-4028-af5a-882bb8a436b7 - How to use whisper
//https://chat.openai.com/share/ca60ea94-5709-4675-8563-96d220fa6b52 - Redesigning it for Node

// Import necessary modules
const fetch = require('node-fetch');
const FormData = require('form-data');
const ENV = require('./env');

// Extract API key from ENV
const OPENAI_API_KEY = ENV.OPENAI_API_KEY;

const Transcribe = async (req, res) => {
    // Extract chunks from the request body
    const { chunks } = req.body;

    // Create the audio file and the form data to send to the API
    const blob = new Blob(chunks, { type: 'audio/wav' });
    const file = new File([blob], 'audio.wav', { type: 'audio/wav' });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', 'whisper-1');

    // Make the API request
    try {
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + OPENAI_API_KEY
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('API response was not ok. Status: ' + response.status);
        }

        const data = await response.json();
        if (data.text) {
            // Send the transcription back in the response
            res.json({ transcription: data.text });
        } else if (data.status === 'processing') {
            // For simplicity, let's just send a message back
            res.json({ message: 'Transcription is still processing' });
        }
    } catch (error) {
        // Send the error message back in the response
        res.json({ error: error.message });
    }
};

module.exports = Transcribe;
