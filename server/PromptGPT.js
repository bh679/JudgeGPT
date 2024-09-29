// Import the OpenAI SDK
const OpenAI = require("openai");
const ENV = require('./env');

// Initialize OpenAI with the API key from the environment variable
const openai = new OpenAI({
  apiKey: ENV.OPENAI_API_KEY
});

class PromptGPT {
  constructor(inputPrompt) {
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

  // Use OpenAI SDK to generate a completion
  async AskGPT() {
    return new Promise(async (resolve, reject) => {
      console.log(this.inputPrompt);

      try {
        // Create a chat completion
        const completion = await openai.chat.completions.create({
          model: "gpt-4", // or "gpt-3.5-turbo"
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: this.inputPrompt }
          ]
        });

        // Process the response
        this.status.finished = true;
        this.status.generatedText = completion.choices[0].message.content.trim();
        this.status.completeTime = new Date();
        this.status.inputPrompt = this.inputPrompt;

        // Invoke all registered callbacks
        for (const callback of this.callbacks) {
          try {
            callback(null, this.status);
          } catch (e) {
            console.error('Error invoking callback:', e);
          }
        }

        // Resolve the promise with the status object
        console.log("Returning generated text:", this.status.generatedText);
        resolve(this.status);

      } catch (error) {
        console.error("Error in OpenAI API call:", error.response ? error.response.data : error.message);
        reject(error);
      }
    });
  }
}


module.exports = PromptGPT;