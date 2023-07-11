const fs = require('fs');
const YoutubeMp3Downloader = require('youtube-mp3-downloader');
const { Deepgram } = require('@deepgram/sdk');
const ffmpeg = require('ffmpeg-static');
const axios = require('axios');

class VideoTranscriber {
  constructor(videoId) 
  {
    this.deepgram = new Deepgram('c51cc887f8383da372d45aef9ee4a0715ec7a8c5');
    this.YD = new YoutubeMp3Downloader({
      ffmpegPath: ffmpeg,
      outputPath: './',
      youtubeVideoQuality: 'highestaudio'
    });

    this.status = {
      progress: 0, 
      finished: false,
      generatedText: "",
      videoName: "",
      startTime: new Date(),
      completeTime: ""
    };

    this.YD.on('progress', (data) => {
      this.status.progress = data.progress.percentage;
      console.log(`${this.status.progress}%`);
    });

    this.callbacks = [];

    this.videoId = videoId;// || 'ir-mWUYH_uo';
  }

  // Add a function to add a callback
  addCallback(callback) {
    this.callbacks.push(callback);
  }

  async transcribeVideo() {
    return new Promise((resolve, reject) => {
      console.log(this.videoId);

      this.YD.download(this.videoId);

      const finishedEventHandler = async (err, video) => {
  
        const videoFileName = video.file;
        console.log(`Downloaded ${videoFileName}`);

        const file = {
          buffer: fs.readFileSync(videoFileName),
          mimetype: 'audio/mp3'
        };
        const options = {
          punctuate: true
        };

        const result = await this.deepgram.transcription.preRecorded(file, options).catch((e) => console.log(e));
        const transcript = result.results.channels[0].alternatives[0].transcript;

        console.log(transcript);

        // Read the prompt from a text file.
        const prompt = fs.readFileSync('prompt.txt', 'utf8');
        
        console.log(prompt);

        // Insert the transcript into the prompt
        const formattedPrompt = `${prompt} {${transcript}}`; //Is this a deepfake? return chances from 0-100% and analysis: 

        //const prompt = `Is this a deepfake? return chances from 0-100% and analysis: {${transcript}}`;
        console.log(formattedPrompt);

        const maxTokens = 60;
        const model = "text-davinci-003";//"gpt-3.5-turbo";//"text-davinci-003";

        axios.post('https://api.openai.com/v1/completions', {
          model,
          prompt: formattedPrompt,
          max_tokens: maxTokens,
        }, {
          headers: {
            'Authorization': `Bearer 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`,
            'Content-Type': 'application/json',
          },
        }).then((response) => {

          this.status.finished = true;
          this.status.generatedText = response.data.choices[0].text.trim();
          this.status.videoName = videoFileName;
          this.status.completeTime = new Date();

          // Invoke all registered callbacks
          for (const callback of this.callbacks) {
            try {
              callback(null, status);
            } catch (e) {
              console.error('Error invoking callback:', e);
            }
          }

          console.log("returning generated text" + this.status );
          resolve(this.status);

        }).catch((error) => {
          reject(error);
        });

        fs.writeFileSync(`${videoFileName}.txt`, transcript, () => `Wrote ${videoFileName}.txt`);
        
        if (fs.existsSync(videoFileName)) {
            fs.unlinkSync(videoFileName);
        } else {
            console.log('File does not exist, cannot delete!');
        }



        // Remove this event handler after it has finished
        this.YD.removeListener('finished', finishedEventHandler);
      }

      this.YD.on('finished', finishedEventHandler);
    });
  }
}

module.exports = VideoTranscriber;
