let connectingToServerMessages = [
    "Knock, knock! Who's there? It's your friendly deepfake detector, plugging into the server.",
    "Reaching out to the server, like trying to find the remote in the couch cushions.",
    "Playing hide and seek with the server... Found it! Ready for some deepfake detection?",
    "Summoning the all-knowing server for some deepfake shenanigans. Stand by.",
    "Whipping out the virtual magnifying glass. Server, here we come!",
    "About to connect to the server. This might tickle a bit!",
    "Like a bloodhound on the scent of a deepfake. Server, activate!",
    "Engaging warp speed to the server. Deepfake detection, engage!",
    "Don't worry, we're about to ask the server: 'To deepfake or not to deepfake?'",
    "Like a squirrel to an acorn, we're heading to the server for some deepfake detection!",
    "Connecting to the server. This is no Mission Impossible, we got this!",
    "Accessing the server - like a detective seeking the truth in a sea of deepfakes.",
    "Making the pilgrimage to the sacred server, the oracle of deepfake truth.",
    "Hold on to your hats, we're taking a trip to the server. Deepfake detection, ho!",
    "And now, for our next trick, we will connect to the server! Deepfakes, beware.",
    "Deepfakes, it's time to meet your match. Server, come out, come out, wherever you are!",
    "Taking a virtual stroll to the server. It's a nice day for some deepfake detection.",
    "Tiptoeing into the server's den. Let's catch those pesky deepfakes!",
    "Onwards, to the server! Let the game of deepfake 'Whack-a-Mole' begin.",
    "About to connect to the server. Deepfakes, you're about to be served!"
];
let totalConnecting = 20;


let loadingMessages = [
"Feeding the video to our AI overlords for authenticity verification...",
"Calling in the digital sniffing dogs to root out deepfakery...",
"Summoning Sherlock Holo-mes to investigate the video scene...",
"Conducting full pixel-by-pixel pat-down for signs of deepfake contraband...",
"Training AI pigeons to peck at suspicious pixels...",
"Running the video through our state-of-the-art BullS*** Detector...",
"Initiating time travel to check if the video existed in the past...",
"Comparing video with entries in the Encyclopedia of Real Things...",
"Calibrating our deepfake Geiger counter for radioactive fakery...",
"Digitally sniffing the video like a bloodhound on the trail of a deepfake...",
"Consulting the ancient AI Oracles for signs of deepfakery...",
"Running the video through our patented Deepfake Stain Remover...",
"Baking the video at 350 degrees to see if any deepfakes rise to the top...",
"Hosting a pixel party to see if any invitee behaves suspiciously...",
"Currently reverse-engineering the pixels…",
"Peeking behind the scenes of the video matrix...",
"Inspecting digital DNA for signs of deepfake intrusion...",
"Unraveling quantum video quarks for deepfake traces...",
"Deploying neural network detectives on a deepfake hunt...",
"Initiating video Turing Test to determine video humanity...",
"Decoding video's binary DNA...",
"Inviting the video to a round of 'Truth or Dare'...",
"Sailing the digital seas to find the island of originality...",
"Sending video to the Moon and back, deepfakes can't survive the trip...",
"Scanning video with our AI's lie detector...",
"Analyzing video's past, present, and future...",
"Sweeping video for deepfake bugs...",
"Sending video to digital detox camp...",
"Taking the video on a trip to 'Reality Check'...",
"Analyzing video's body language...",
"Checking video's heartbeat for irregularities...",
"Getting a second opinion from another AI...",
"Subjecting video to the Turing test...",
"Cross-examining video's alibi...",
"Dipping video in a solution of truth serum...",
"Measuring video's 'Reality Quotient'...",
"Cross-referencing video with reality database...",
"Taking video for a walk in the 'Reality Park'...",
"Running video through deepfake traffic signals...",
"Subjecting video to polygraph test...",
"Performing digital exorcism on the video...",
"Putting video under the cyber microscope...",
"Counting the grains of reality in the video...",
"Interrogating the video's pixels one by one...",
"Putting video on the deepfake treadmill to see how it runs...",
"Serving video with a truth-or-deepfake quiz...",
"Checking video's reality visa...",
"Running video through the seven layers of authenticity...",
"Consulting the grand AI Council for video's reality certification...",
"Requesting video's permission to cross the reality check post...",
"Reading video's last rites before deepfake exorcism...",
"Sweeping the video with anti-deepfake broom...",
"Sending video to AI's lie detection academy...",
"Asking video to look straight into the AI's eye...",
"Examining video under the authenticity lens...",
"Running video through the digital reality scanner...",
"Dipping the video in a pool of authenticity...",
"Giving video a hot cup of reality tea...",
"Introducing video to the jury of truth...",
"Passing video through the reality check turnstile...",
"Crossing the video through seven circles of deepfake hell...",
"Running a thorough background check on the video...",
"Setting video on the truth track...",
"Applying the reality filter on the video...",
"Conducting a surprise reality check raid on the video...",
"Strapping video to the lie detector...",
"Pouring reality check syrup on the video pancake...",
"Throwing the video into the reality check pit...",
"Requesting video to present its reality credentials...",
"Running the video against our deepfake watchlist...",
"Putting the video through the truth-or-deepfake gateway...",
"Escorting the video to the reality validation department...",
"Imposing reality check curfew on the video...",
"Running a surprise reality audit on the video...",
"Inviting video to the 'No deepfake allowed' party...",
"Handing video the reality check receipt...",
"Taking video on a tour of the 'Deepfake museum'...",
"Exposing video to the rays of truth...",
"Running video through the anti-deepfake washing machine...",
"Serving the video with a court order to appear before the reality check judge...",
"Scrubbing off the deepfake dirt from the video...",
"Scanning video's reality barcode...",
"Polishing the video with truth wax...",
"Running video through the deepfake decibel test...",
"Taking the video on a reality check rollercoaster...",
"Scanning the video with deepfake detection radar...",
"Subjecting video to the truth detection prism...",
"Engaging video in a duel of reality versus deepfake...",
"Spraying the video with deepfake repellent...",
"Running the video through the tunnel of truth...",
"Inviting video to dance the waltz of reality..."
]; //50
let totaldownload = 90;

class LoadingMessage {
  constructor(logElement) {
	console.log("constructor");

    this.logParent = logElement;
    this.logTarget = document.createElement('p');
    //this.total = total;
    this.counter = Math.floor(Math.random() * 100);
    this.intervalId = null;
    this.state = "";
  }

  updateLoadingMessage() {
	console.log("updateLoadingMessage");

  	if(this.state == "connecting")
    	this.logTarget.innerText = connectingToServerMessages[this.counter % totalConnecting];
    else if(this.state == "downloading")
    	this.logTarget.innerText = loadingMessages[this.counter % totaldownload];
    else if(this.state == "processing")
    	this.logTarget.innerText = loadingMessages[this.counter % totaldownload];

    this.counter++;
  }

  start() {
	console.log("start");

	if(this.state != "connecting")
	{
		console.log("connecting");
		newLog();
	}

  	this.state = "connecting";
    this.updateLoadingMessage();

    this.stop();
    this.intervalId = setInterval(() => {
      this.updateLoadingMessage();
    }, 4000);
  }

  downloading() {

	if(this.state != "downloading")
	{
		console.log("downloading");
		newLog();
	}

  	this.state = "downloading";
  	this.updateLoadingMessage();

    this.stop();
    this.intervalId = setInterval(() => {
      this.updateLoadingMessage();
    }, 4000);
  }

  processing() {

	if(this.state != "processing")
	{
		console.log("processing");
		newLog();
	}

  	this.state = "processing";
  	this.updateLoadingMessage();

    this.stop();
    this.intervalId = setInterval(() => {
      this.updateLoadingMessage();
    }, 4000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  newLog(){
	    this.logTarget = document.createElement('p');
	    this.logParent.prepend(this.logTarget);
  }
}