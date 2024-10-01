// backgroundMusic.js

class BackgroundMusicManager {
    constructor() {
        // Array of music tracks
        this.tracks = [
            './music/track1.mp3', // Path to the first track
            './music/track2.mp3', // Path to the second track
            './music/track3.mp3', // Path to the third track
            './music/track4.mp3'  // Path to the fourth track
        ];

        this.currentTrackIndex = null;
        this.audioElement = new Audio();
        this.audioElement.loop = false; // Disable built-in loop, we'll handle it manually
        this.audioEnabled = false; // Audio is initially off

        // Add an event listener to play the next track when the current one ends
        this.audioElement.addEventListener('ended', () => this.playRandomTrack());
    }

    // Function to randomly select a track
    getRandomTrackIndex() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.tracks.length);
        } while (newIndex === this.currentTrackIndex);
        return newIndex;
    }

    // Function to play a random track
    playRandomTrack() {
        if (this.audioEnabled) {
            this.currentTrackIndex = this.getRandomTrackIndex();
            this.audioElement.src = this.tracks[this.currentTrackIndex];
            this.audioElement.play();
        }
    }

    // Enable or disable audio
    toggleMusic(enable) {
        this.audioEnabled = enable;
        if (this.audioEnabled) {
            this.playRandomTrack();
        } else {
            this.audioElement.pause();
        }
    }
}

// Create an instance of BackgroundMusicManager
const musicManager = new BackgroundMusicManager();

// Function to handle the audio toggle
function toggleMusic(isAudioOn) {
    musicManager.toggleMusic(isAudioOn);
}
