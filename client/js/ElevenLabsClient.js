class SpeechManager {
    constructor(apiDomain, status) {
        this.apiDomain = apiDomain;
        this.currentAudio = null;
        this.queue = [];
        this.voicing = false;
        this.isSpeaking = false;
        this.audioContext = null;
        this.unlocked = false;
        this.currentSource = null;
        this.gainNode = null;  // New line: Node to control the volume

        if (status) {
            this.status = status;
        }

        this.cache = new Map();
    }

    async unlockAudioContext() {
        if (this.unlocked) return;

        this.AddToStatus("Unlocking", true);

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.gainNode = this.audioContext.createGain();  // New line: Initialize gainNode for volume control
        this.gainNode.connect(this.audioContext.destination);  // New line: Connect the gainNode to the destination

        const buffer = this.audioContext.createBuffer(1, 1, 22050);
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.start(0);

        setTimeout(() => {
            if ((source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE)) {
                this.unlocked = true;
                this.AddToStatus("Unlocked");
            }
        }, 0);
    }

    async resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.AddToStatus("resuming");
            await this.audioContext.resume();
        }
    }

    AddToStatus(newLine, reset) {
        console.log(newLine);

        if (reset && this.status != null) {
            this.status.innerText = "";
        }

        if (this.status != null) this.status.innerText += newLine + "\n";
    }

    async Speak(text, voice, callBack) {
        this.AddToStatus("Speak text:" + text + " voice:" + voice);

        if (!this.voicing) return;
        if (!this.unlocked) await buttonPressHandler();

        if (text != null && voice != null) {
            console.log("Adding to queue");

            const cacheKey = `${text}-${voice}`;
            let blobUrl;

            if (this.cache.has(cacheKey)) {
                blobUrl = this.cache.get(cacheKey);
            } else {
                blobUrl = await this.fetchSpeech(text, voice);
                this.cache.set(cacheKey, blobUrl);
            }

            this.queue.push({ text: text, voice: voice, callBack: callBack, blobUrl: blobUrl });

            if (!this.isSpeaking) {
                await this.PlayNextInQueue();
            }
        }
    }

    async PlayNextInQueue() {
        if (this.isSpeaking || this.queue.length === 0) return;

        this.isSpeaking = true;

        console.log("getting message to play");

        let message = this.queue.shift();
        this.AddToStatus("Speak: " + message.text, true);

        try {
            const audioBuffer = await this.GetAudio(message.blobUrl);
            this.PlayAudio(audioBuffer, message.callBack);
        } catch (error) {
            console.error('Error:', error);
            this.AddToStatus('Error: ' + error.message);
        }
    }

    async GetAudio(blobUrl) {
        const response = await fetch(blobUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch audio from blob URL. Status: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        return this.audioContext.decodeAudioData(arrayBuffer);
    }

    PlayAudio(audioBuffer, callBack) {
        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.gainNode);  // Changed line: Connect the source to the gainNode for volume control
        source.start(0);

        this.currentSource = source;
        this.handleAudioEnd(source, callBack);
    }

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
        console.log(`Generated blob URL: ${url}`);
        return url;
    }

    handleAudioEnd(source, callBack) {
        source.onended = () => {
            this.AddToStatus('Audio has finished playing!');

            if (callBack != null) callBack();

            this.isSpeaking = false;

            if (this.queue.length > 0) {
                this.PlayNextInQueue();
            }
        };
    }

    StopSpeaking() {
        if (this.currentSource) {
            this.currentSource.stop();
            this.currentSource = null;
        }
        this.queue = [];
        this.isSpeaking = false;
        this.voicing = false;
    }

    ResumeSpeaking() {
        this.voicing = true;
        if (this.queue.length > 0) {
            this.PlayNextInQueue();
        }
    }

    // New function to set the volume
    setVolume(volumeLevel) {
        if (this.gainNode) {
            this.gainNode.gain.setValueAtTime(volumeLevel, this.audioContext.currentTime);  // New line: Set the volume level
            this.AddToStatus(`Volume set to: ${volumeLevel}`);  // New line: Update status with the current volume
        }
    }
}

// Create a new SpeechManager object
let speechManager = new SpeechManager('https://brennan.games:3000', document.getElementById('SpeechManagerStatus'));

// Use this function to unlock the audio context after a user interaction (e.g., button press)
async function buttonPressHandler() {
    await speechManager.unlockAudioContext();
    await speechManager.resumeAudioContext();
}
