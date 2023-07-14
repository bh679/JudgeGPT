const fs = require('fs');
const axios = require('axios');

class PromptGPT {
  constructor(inputPrompt) 
  {

    this.status = {
      finished: false,
      generatedText: "",
      startTime: new Date(),
      completeTime: "",
      fullPrompt: "",
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

        // Read the prompt from a text file.
       // const promptWrapper = fs.readFileSync('prompt.txt', 'utf8');
        
        //console.log(promptWrapper);

        // Insert the transcript into the prompt
        const formattedPrompt = this.inputPrompt;//`${promptWrapper} {${this.inputPrompt}}`; //Is this a deepfake? return chances from 0-100% and analysis: 

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
          this.status.completeTime = new Date();
          this.status.inputPrompt = this.inputPrompt;
          this.status.fullPrompt = formattedPrompt;

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
