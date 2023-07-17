const ENV = require('./env');
const TNL_API_KEY = ENV.TNL_API_KEY;


class TNLMJ {
  constructor(inputPrompt) 
  {

    this.status = {
      finished: false,
      image: {},
      startTime: new Date(),
      completeTime: "",
      inputPrompt: "",
      progress: 0
    };

    this.inputPrompt = inputPrompt;

    this.callbacks = [];

  }

  // Add a function to add a callback
  addCallback(callback) {
    this.callbacks.push(callback);
  }

  async makeRequest(config) {
  const axios = require('axios');
  try {
    const response = await axios(config);
    const imageResponse = await axios({
      method: 'get',
      url: 'https://api.thenextleg.io/v2/message/' + response.data.messageId,
      headers: {
        'Authorization': 'Bearer ' + TNL_API_KEY,
      },
      data: config.data
    });
    console.log("progress: " + imageResponse.data.progress);
    if(imageResponse.data.progress < 100)
      console.log("imageResponse.data.progressImageUrl: " + imageResponse.data.progressImageUrl);
    else
      console.log("imageResponse.data.imageUrl: " + imageResponse.data.imageUrl);

    this.status.progress = imageResponse.data.progress;

    // Delay for 20 seconds
    await new Promise(resolve => setTimeout(resolve, 10000));  // 20000 milliseconds = 20 seconds
    return imageResponse;
  } catch (error) {
    console.error(error);
  }
}


async GetImage() {
  return new Promise(async (resolve, reject) => {
    console.log(this.inputPrompt);

    const prompt = this.inputPrompt;

    var data = JSON.stringify({
      "msg": prompt,
      "ref": "",
      "webhookOverride": "",
      "ignorePrefilter": "false"
    });

    var config = {
      method: 'post',
      url: 'https://api.thenextleg.io/v2/imagine',
      headers: {
        'Authorization': 'Bearer ' + TNL_API_KEY,
        'Content-Type': 'application/json'
      },
      data: data
    };

    var currentTime = new Date();
    var timeDifference = currentTime - this.status.startTime; 

    while (this.status.progress != "incomplete" && this.status.progress < 100 && timeDifference <= 60000) 
    {
      currentTime = new Date();
      timeDifference = currentTime - this.status.startTime;
      console.log("timeDifference: " +timeDifference);

      const response = await this.makeRequest(config);

      if (this.status.progress == 100) {
        this.status.finished = true;
        this.status.image = response.data.messageId;
        this.status.completeTime = new Date();
        this.status.inputPrompt = this.inputPrompt;
        resolve(this.status);

        for (const callback of this.callbacks) {
          try {
            callback(null, this.status);
          } catch (e) {
            console.error('Error invoking callback:', e);
          }
        }
      }
    }
  });
}

}

module.exports = TNLMJ;
