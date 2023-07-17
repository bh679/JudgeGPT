const fs = require('fs');
const axios = require('axios');

const ENV = require('./env');
const OPENAI_API_KEY = ENV.OPENAI_API_KEY;

class PromptGPT {
  constructor(inputPrompt) 
  {

    this.status = {
      finished: false,
      generatedText: "",
      startTime: new Date(),
      completeTime: "",
      inputPrompt: ""
    };

    this.inputPrompt = inputPrompt;

    this.callbacks = [];

  }

  // Add a function to add a callback
  addCallback(callback) {
    this.callbacks.push(callback);
  }

  async AskGPT() {
    return new Promise((resolve, reject) => {
      console.log(this.inputPrompt);

        const maxTokens = 200;
        const model = "text-davinci-003";//"gpt-3.5-turbo";//"text-davinci-003";

        axios.post('https://api.openai.com/v1/completions', {
          model,
          prompt: this.inputPrompt,
          max_tokens: maxTokens,
        }, {
          headers: {
            'Authorization': `Bearer `+OPENAI_API_KEY,
            'Content-Type': 'application/json',
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

module.exports = PromptGPT;
