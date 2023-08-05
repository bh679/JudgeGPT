// A class that manages speech synthesis through an external API
class SpeechManager {
    // The constructor initializes the class with the API domain and sets up some state variables
    constructor(apiDomain, status) {
        this.apiDomain = apiDomain;  // The domain of the API to fetch speech from
        this.currentAudio = null;  // The Audio object of the currently playing speech
        this.queue = [];  // A queue of speech tasks
        this.voicing = false;  // A flag indicating whether speech synthesis is currently allowed
        this.isSpeaking = false;  // A flag indicating whether speech synthesis is currently happening
        
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.unlocked = false;

        if(status)
            this.status = status;
    }

    async unlockAudioContext() {
    if (this.unlocked) return;

    const buffer = this.audioContext.createBuffer(1, 1, 22050);
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.start(0);

    // Older browsers might require 'noteOn' instead of 'start'.
    // source.noteOn(0); 

    // By checking the play state after some time, we can see if we're really unlocked
    setTimeout(() => {
        if((source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE)) {
            this.unlocked = true;
        }
    }, 0);
}


    async resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    // The AddToStatus function updates the status text
    // newLine is the text to be added
    // reset is a boolean indicating whether the status text should be cleared before adding newLine
    AddToStatus(newLine, reset)
    {
        console.log(newLine);

        // If reset is true, clear the status text
        if(reset)
            if (this.status != null)
                this.status.innerText = "";
        
        // Add newLine to the status text
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

            // Fetch the speech audio from the API and add the speech task to the queue
            this.fetchSpeech(text, voice)
                .then(blobUrl => {
                this.queue.push({text: text, voice: voice, callBack: callBack, blobUrl: blobUrl});

                // If it's not currently speaking, start to play
                if (!this.isSpeaking) {
                    this.PlaySpeech();
                }
            });
        }
    }

    async PlaySpeech() {
        if (this.isSpeaking || this.queue.length === 0)
            return;

        this.isSpeaking = true;

        console.log("getting message to play");

        let message = this.queue.shift();

        this.AddToStatus("Speak: " + message.text, true);

        try {
            const response = await fetch(message.blobUrl);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

            const source = this.audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(this.audioContext.destination);
            source.start(0);

            this.handleAudioEnd(source, message.callBack);

        } catch (error) {
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

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        return url;
    }

    handleAudioEnd(source, callBack) {
        source.onended = () => {
            this.AddToStatus('Audio has finished playing!');

            if (callBack != null)
                callBack();

            this.isSpeaking = false;

            if (this.queue.length > 0) {
                this.PlaySpeech();
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
            this.PlaySpeech();  // Start the next speech task if there are any in the queue
        }
    }

}

// Create a new SpeechManager object
let speechManager = new SpeechManager('https://brennan.games:3000');

// Use this function to unlock the audio context after a user interaction (e.g., button press)
async function buttonPressHandler() {
    await speechManager.unlockAudioContext();
    await speechManager.resumeAudioContext();
}
