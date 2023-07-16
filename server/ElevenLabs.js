const fs = require('fs');
const axios = require('axios');

class ElevenLabs {
  constructor(TextToSpeech) 
  {

    this.status = {
      finished: false,
      generatedText: "",
      startTime: new Date(),
      completeTime: "",
      inputPrompt: ""
    };

    this.TextToSpeech = TextToSpeech;

    this.callbacks = [];

  }

  // Add a function to add a callback
  addCallback(callback) {
    this.callbacks.push(callback);
  }

  async TextToSpeech() {
    return new Promise((resolve, reject) => {
      console.log(this.TextToSpeech);

        const maxTokens = 60;
        const voideId = "21m00Tcm4TlvDq8ikWAM";//"gpt-3.5-turbo";//"text-davinci-003";

        axios.post('https://api.elevenlabs.io/v1/text-to-speech/'+voideId, {
          text: this.TextToSpeech,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        }, {
          headers: {
            'accept: audio/mpeg',
            'xi-api-key: ba2052c19dd323c5a3430d86e42f5784',
            'Content-Type: application/json' 
          },
        }).then((response) => {

          this.status.finished = true;
          this.status.generatedText = response.data.choices[0].text.trim();
          this.status.completeTime = new Date();
          this.status.inputPrompt = this.inputPrompt;

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

    });
  }
}

/*
curl -X 'POST' \
  'https://api.elevenlabs.io/v1/text-to-speech/<voice-id>' \
  --header 'accept: audio/mpeg' \
  --header 'xi-api-key: <xi-api-key>' \
  --header 'Content-Type: application/json' \
  --data '{
    "text": "string",
    "model_id": "eleven_monolingual_v1",
    "voice_settings": {
      "stability": 0.5,
      "similarity_boost": 0.5
    }
  }'

*/

module.exports = PromptGPT;
