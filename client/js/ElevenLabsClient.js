// A class that manages speech synthesis through an external API
class SpeechManager {
    // The constructor initializes the class with the API domain and sets up some state variables
    constructor(apiDomain, status) {
        this.apiDomain = apiDomain;  // The domain of the API to fetch speech from
        this.currentAudio = null;  // The Audio object of the currently playing speech
        this.queue = [];  // A queue of speech tasks
        this.voicing = true;  // A flag indicating whether speech synthesis is currently allowed
        this.isSpeaking = false;  // A flag indicating whether speech synthesis is currently happening
        
        if(status)
            this.status = stutus;
    }

    AddToStatus(newLine, reset)
    {
        console.log(newLine);

        if(reset)
            if (this.status != null)
                this.status.innerText = "";
        
        if (this.status != null) this.status.innerText += newLine + "\n";
    }

    // The Speak function initiates a speech task
    async Speak(text, voice, callBack) {
        // If the system is not currently allowed to speak, or if there is an audio currently playing, or if a speech task is already happening, return immediately
        if (!this.voicing)
            return;

        //if new thing to be said
        if(text != null && voice != null)
        {
            console.log("Adding to queue");

            // Add the speech task to the queue
            this.queue.push({text: text, voice: voice, callBack: callBack});

        }

        if(this.isSpeaking)
            return;

        this.isSpeaking = true;  // Set the isSpeaking flag to true

        console.log("getting message to play");

        // Get the next speech task from the queue
        let message = this.queue.shift();

        // Update the status text
        this.AddToStatus("Speak: " + message.text, true);

        try {
            // Update the status text
            this.AddToStatus('Processing...');

            // Fetch the speech audio from the API
            const response = await this.fetchSpeech(message.text, message.voice);

            // Update the status text
            this.AddToStatus('Speech successfully generated!');

            // Create a blob URL from the response
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // If the voicing flag is false, return immediately
            if (!this.voicing) {
                return;
            }

            // Create an Audio object from the blob URL and play it
            const audio = new Audio(url);
            audio.play();

            this.currentAudio = audio;  // Set the currently playing audio

            // Handle the end of the audio
            this.handleAudioEnd(audio, callBack, status);

        } catch (error) {
            // Log the error and update the status text
            console.error('Error:', error);
            this.AddToStatus('Error: ' + error.message);
        }
    }

    // The fetchSpeech function fetches the speech audio from the API
    async fetchSpeech(text, voice) {
        const response = await fetch(this.apiDomain + '/Speak', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: text, voiceId: voice })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    }

    // The handleAudioEnd function handles the end of the audio
    handleAudioEnd(audio, callBack, status) {
        audio.onended = () => {
            // Update the status text
            this.AddToStatus('Audio has finished playing!');

            // Call the callback function if it's provided
            if (callBack != null)
                callBack();

            this.currentAudio = null;  // Clear the currently playing audio

            this.isSpeaking = false; // Set the isSpeaking flag to false

            // If there are more speech tasks in the queue, start the next one
            if (this.queue.length > 0) {
                this.Speak();
            } 
        };
    }

    // The StopSpeaking function stops the currently playing audio and pauses any further speech synthesis
    StopSpeaking() {
        if (this.currentAudio) {
            this.currentAudio.pause();  // Stop the currently playing audio
            this.currentAudio = null;  // Clear the currently playing audio
        }
        this.isSpeaking = false;  // Set the isSpeaking flag to false
        this.voicing = false;  // Set the voicing flag to false
    }

    // The ResumeSpeaking function resumes speech synthesis
    ResumeSpeaking() {
        this.voicing = true;  // Set the voicing flag to true
        if(this.queue.length > 0) {
            this.Speak();  // Start the next speech task if there are any in the queue
        }
    }
}

// Create a new SpeechManager object
let speechManager = new SpeechManager('https://brennan.games:3000');
