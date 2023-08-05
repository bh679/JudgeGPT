class SpeechManager {
    constructor(apiDomain) {
        this.apiDomain = apiDomain;
        this.currentAudio = null;
        this.queue = [];
        this.voicing = true;
        this.isSpeaking = false;
    }

    async Speak(text, voice, callBack, status) {
            
        if(!this.voicing)
            return;

        this.queue.push({text: text, voice: voice, callBack: callBack, status: status});

        if(this.currentAudio || this.isSpeaking)
            return;

        this.isSpeaking = true;

        let message = this.queue.shift();

        if(status != null) status.innerText = "Speak: " + message.text + '\n';

        try {
            if(status != null) status.innerText += 'Processing...\n';

            const response = await fetch(this.apiDomain+'/Speak', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: message.text, voiceId: message.voice })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if(status != null) status.innerText += 'Speech successfully generated!\n';

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            if(!this.voicing) {

                return;
            }

            const audio = new Audio(url);
            audio.play();

            this.currentAudio = audio;  // set the currently playing audio

            audio.onended = () => {
                if(status != null) status.innerText += 'Audio has finished playing!\n';
                
                if(callBack != null)
                    callBack();

                this.currentAudio = null;  // clear the currently playing audio

                if(this.queue.length > 0) {
                    this.Speak();
                }else
                    this.isSpeaking = false;
            };

        } catch (error) {
            console.error('Error:', error);
            if(status != null) status.innerText += 'Error: ' + error.message + '\n';
        }
    }

    StopSpeaking() {
        if (this.currentAudio) {
            this.currentAudio.pause();  // stop the audio
            this.currentAudio = null;  // clear the currently playing audio
        }
        this.isSpeaking = false;
        this.voicing = false;  // pause any further speech processing
    }

    ResumeSpeaking() {
        this.voicing = true;
        if(this.queue.length > 0) {
            this.Speak();
        }
    }
}

let speechManager = new SpeechManager('https://brennan.games:3000');
