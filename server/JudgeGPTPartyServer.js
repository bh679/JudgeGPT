
const PromptGPT = require('./PromptGPT');
const RandomLines = require('./RandomLines');

const aiID = "ai";

class JudgeGPTPartyServer {

    constructor(restartCallback) {
        this.restartCallback = restartCallback;
        this.players = {}; //all human players, and audience
        this.stop = false;

        this.init();
    }

    init()
    {
        this.judge = new Player("GPT", "Judge", aiID);
        this.narrator = new Player("","", "system");

        this.keyRoles = [ //Key roles that need to be filled
            "Defendant",
            "Plaintiff"
            ];

        this.activeRoles = []; //players and humans in hearing

        this.turn = 0;
        this.gameCase = "undefined";
        this.ruling = "";
        this.punishment = "";
        this.winner = "";

        this.messagesChat = new MessageBackEnd();
        this.prompts = new Prompts();
        this.timeStart = Date.now();

        this.running = false;
        this.aiTurn = true;
        this.courtEmpty = !(Object.keys(this.players).length > 0);

        //remove ai from players (and disconnected)
        this.RemoveAIfromPlayers(); 
        //reset roles
        this.SetActiveRolesFromPlayers();

        this.RestPlayers();
    }

    //also removes disconnected players
    RemoveAIfromPlayers() 
    {
        for(let clientID in this.players) 
        {
            while(clientID < this.players.length && 
                (this.players[clientID].clientID.toLowerCase() === aiID || this.players[clientID].connected == false)) {
                delete this.players[clientID];
            }
        }
    }

    SetActiveRolesFromPlayers() {
        // Reset activeRoles
        this.activeRoles = [];

        // Get the first two players from the players object
        const playerIDs = Object.keys(this.players);
        for (const id of playerIDs) {
            const player = this.players[id];
            if (this.activeRoles.length < this.keyRoles.length) {
                player.SetRole(this.keyRoles[this.activeRoles.length]);
                this.activeRoles.push(player);
            } else {
                break;
            }
        }
    }

    RestPlayers() 
    {
        for(let clientID in this.players) 
        {
            this.players[clientID].Reset();
        }
    }


    // Start the game
    async Start() {

        this.running = true;
        this.aiTurn = true;

        
        this.gameCase = await AskGPT(this.prompts.cases[Math.floor(Math.random() * this.prompts.cases.length)]);
        this.messagesChat.AddToChat(this.judge, this.gameCase);
        await new Promise(resolve => setTimeout(resolve, 3000));
        if(this.stop)
            return;

        if(this.courtEmpty)
            this.messagesChat.AddToChat(this.narrator, "The court will begin when the members arrive.");

        while(this.courtEmpty)
        {
            await new Promise(resolve => setTimeout(resolve, 1000));
            if(this.stop)
                return;
        }

        this.NextPlayerTurn();

    }



    async OnPlayerConnected(clientID)
    {
        const now = Date.now();
        const lastTime = this.timeStart || now;
        const seconds =  (now - lastTime) / 1000; // returns seconds

        //are you the first person to connect? --hack for quick bug fix
        if(this.HumansConnected() == 0 && this.activeRoles > 0 && seconds > 60)
        {
            //restart the game 
            this.restartCallback();
            return;
        }

        //Has the game been over 5min?
        if(seconds > 60*15)
        {
            //restart the game 
            this.restartCallback();
            return;
        }

        if(this.players.hasOwnProperty(clientID))
            return this.players[clientID];

        var newPlayer = this.AddNewPlayerToAudience(clientID);//.socket = socket;

        console.log(this.activeRoles.length);

        if(this.activeRoles.length < 2)
        {
            this.JoinHearing(newPlayer);
        }

        //console.log(newPlayer);

        return newPlayer;
    }

    JoinHearing(playerJoining)
    {
            this.courtEmpty = false;
            playerJoining.SetRole(this.keyRoles[this.activeRoles.length]);
            this.activeRoles[this.activeRoles.length] = playerJoining;
    }

    async OnPlayerDisconnected(clientID)
    {
        console.log(clientID + " is disconnecting.");

        //if player is part of the game
        if(this.players.hasOwnProperty(clientID))
        {

            console.log(this.players[clientID].role);

            //if player is not just an audience member
            if(this.players[clientID].role != "Audience")
            {

                console.log(this.players[clientID].testimony);

                //have they already played?
                if(this.players[clientID].testimony == null)
                {

                    //Get the next audence member 
                    var nextAudience = this.GetNextAudience();

                    //if there is a next audience member
                    if(nextAudience != null)
                    {
                        console.log("Setting role of next audience : " + nextAudience.clientID);
                        nextAudience.SetRole(this.players[clientID].role);
                    }
                    else //there is no next player, and this player is yet to play.
                    {
                        console.log("whos turn? " + this.activeRoles[this.turn].clientID + " " + this.turn) ;

                        //if its players turn
                        if(this.activeRoles[this.turn].clientID == clientID)
                        {

                            console.log("It is disconnecting players turn");

                            //if there are are other players waiting
                            if(this.activeRoles.length > this.turn + 1)
                            {
                                console.log("There are other players waiting");
                                //get role
                                var role = this.players[clientID].role;

                                console.log(role);

                                //create ai character and assign in roles
                                this.activeRoles[this.turn] = this.AddAIToHearing(role);
                    
                                //disconnect plauer
                                this.DisconnectPlayer(clientID);

                                //set AI turn while its is generating repsonse
                                this.aiTurn = true;
                                
                                //generate and submit repsonse
                                this.SubmitTestimony(await this.AiRespond());
                                if(this.stop)
                                    return;

                                return;
                            }else
                            {
                                console.log("no one else is here");
                                //this.RestartGame();//---------------------------------- Find a better thing to do here
                                //Restart();//find a better thing then this
                                this.restartCallback();
                            }
                        }//its not their turn, no worries just delete them and remove the role
                    }
                }
            }else
                console.log(this.players);

            
            this.DisconnectPlayer(clientID);
        }
        //Move an audience memeber to the hearing

        //check if room is empty
        //check if player should be replaced by AI

        /*if(Object.keys(this.players).length > 0)
        {
            this.courtEmpty = true;
        }*/
        
    }

    DisconnectPlayer(clientID)
    {

        if(this.players.hasOwnProperty(clientID))
        {
            this.players[clientID].connected = false;
            this.players[clientID].role = "disconnected";
            
            for(var i = 0; i < this.activeRoles.length; i++)
            {
                if(this.activeRoles[i].clientID == clientID)
                    this.activeRoles.splice(i, 1);


            }
        }

        /*if(this.players.hasOwnProperty(clientID))
            delete this.players[clientID];

        for(var i = 0; i < this.activeRoles.length; i++)
        {
            if(this.activeRoles[i] != null && this.activeRoles[i].clientID == clientID)
                delete this.activeRoles[i];

        }*/
    }

    GetNextAudience()
    {
        for(let clientID in this.players) 
        {
            if(this.players[clientID].role == "Audience")
                return this.players[clientID];
        }

        return null;
    }

    AddNewPlayerToAudience(clientID)
    {
            var newPlayer = new Player(RandomLines.GetRandomName(), "Audience", clientID);

            //Genearte ProfileURL
            newPlayer.profileUrl = GetRandomProfileImage();

            this.players[clientID] = newPlayer;
            
            return newPlayer;
    }


    async NextPlayerTurn()
    {
        console.log(this.turn);

        //Judge Sends Message
        await new Promise(resolve => setTimeout(resolve, 1000));
        if(this.stop)
            return;

        this.messagesChat.AddToChat(this.judge, this.PlayerIntroduction(this.activeRoles[this.turn]));


        if(this.turn >= this.activeRoles.length)
        {
            this.activeRoles[this.turn] = this.AddAIToHearing(this.keyRoles[this.turn]);

            //this.messagesChat.AddToChat(this.narrator, "The " + this.activeRoles[this.turn].role + " " + this.activeRoles[this.turn].name + " entered the courtroom.");
            
            var response = await this.AiRespond()
            if(this.stop)
                return;

            await this.SubmitTestimony(response);
            return;
        }
        
        this.aiTurn = false;
        //send message to clients


        var turnBeforeWait = this.turn;

        // Initialize externally accessible variable
        //this.activeRoles[this.turn].timeLeft = 60;
        var waitForReconnect = 0;

        //time run every second while they type
        await new Promise((resolve) => {
            let intervalId = setInterval(() => {

                    if(this.stop)
                        return;

                    //if the turn has progressed (through a submission, or its now the ai's turn (thorugh a submission))
                    if (turnBeforeWait != this.turn || this.aiTurn) 
                    {
                        //stop waiting for a repsonse
                        clearInterval(intervalId);
                        resolve();
                    }
                    //if the human has disconnected
                    else if (this.HumansInGame() == 0)
                    {

                        //stop waiting for a repsonse
                        clearInterval(intervalId);
                        resolve();
                    }
                    //if they ran out of time, and there are other humans waiting
                    else if(this.activeRoles[this.turn].timeLeft <= 0)
                    {
                        console.log("Out of time");
                        console.log("this.HumansConnected():" + this.HumansConnected());


                        if(this.HumansConnected() > 1)
                        {
                            //if they typed something
                            if(this.activeRoles[this.turn].typing != null && this.activeRoles[this.turn].typing != "")
                                //submit it
                                this.SubmitTestimony(this.activeRoles[this.turn].typing);

                            //stop waiting
                            clearInterval(intervalId);
                            resolve();
                        }else
                        {

                            //stop waiting
                            clearInterval(intervalId);
                            resolve(); 
                        }
                    }
                    //they are still connected and have time left
                    else if(this.activeRoles[this.turn].timeLeft > 0)
                    {
                        //decrease time
                        this.activeRoles[this.turn].timeLeft--;

                        //reset reconnection time
                        waitForReconnect = 0;
                    }

                
            }, 1000);
        });


        if(this.stop)
            return;


        //console.log(this.activeRoles[this.turn].timeLeft);
        //if still same turn
        if(turnBeforeWait == this.turn && this.HumansConnected() > 0)
        {
            //this.player[this.turn].clientID = "AI";  
            this.activeRoles[this.turn].name = RandomLines.GetRandomName() + " ai"; 
            this.activeRoles[this.turn].clientID = aiID; 

            var response = await this.AiRespond()
            if(this.stop)
                return;

            await this.SubmitTestimony(response);
            if(this.stop)
                return;
        }
        

    }

    //Creates and AI and adds it to the hearing
    AddAIToHearing(role)
    {
            var newNPC = new Player(RandomLines.GetRandomName(), role, aiID);

            //Genearte ProfileURL
            newNPC.profileUrl = GetRandomProfileImage();
            
            return newNPC;
    }

    UserTyping(typing, clientID)
    {
        this.players[clientID].typing = typing;
    }


    // Define asynchronous function to send data
    async SubmitTestimony(testimony) {

        //GlitchBackground();

        console.log(testimony);

        this.aiTurn = true;

        this.activeRoles[this.turn].testimony = testimony;//this.UI.userInput.inputFeild.value;

        this.messagesChat.AddToChat(this.activeRoles[this.turn], this.activeRoles[this.turn].testimony);

        this.turn++;

        if(this.turn < this.keyRoles.length)
        {
            this.NextPlayerTurn();

        }else
        {
            await this.CreateRuling();
            if(this.stop)
                return;

            await this.DeclareWinner();
            if(this.stop)
                return;

            await this.CreatePunsihment();
            if(this.stop)
                return;

            for(var i = 0 ; i < this.activeRoles.length; i++)
            {
                await this.Analysis(i);
                if(this.stop)
                    return;
            }
        
            await new Promise(resolve => setTimeout(resolve, 20000));
            if(this.stop)
                return;
        
            await this.RestartGame();
            if(this.stop)
                return;

        }

    }

    //not used right now
    PlayerHeartBeat(clientID)
    {
        this.players[clientID].lastHeard = Date.now();
    }

    /*getTimeSinceLastResponse(clientID) {
        const now = Date.now();
        const lastTime = this.players[clientID].lastHeard || now;
        return (now - lastTime) / 1000; // returns seconds
    }*/


    InAudience(playerData)
    {
        playerData.lastHeard = new Date();

        if(this.CheckPlayerInGame(playerData.clientID))
            this.audience[playerData.clientID] = playerData;
    }

    //I dont think this is used
    CheckPlayerInGame(clientID)
    {
        console.log("###############\nDELTE THE COMMENT ABOVE THIS FUNCTION\n################");
        for(var i = 0; i < this.players.length; i++)
        {
            if(this.players[i].clientID != clientID)
                return true;
        }

        return false;
    }

    GetPlayers()
    {

        var audienceList = Object.values(this.players).filter(player => player.role === "Audience");
        
        //audienceList = Object.values(this.players);

        var activeRoles = [];
        activeRoles = Object.values(this.activeRoles);

        // Add the judge to the beginning of the array
        activeRoles.unshift(this.judge);

        return {players: this.players, activeRoles: activeRoles, audience: audienceList}; //make sure this is handlede correctly in client side
    }


    HumansInGame()
    {
        var count = 0;

        for(var i = 0; i < this.activeRoles.length; i++)
        {
            if(this.activeRoles[i] && this.activeRoles[i].clientID != "" && this.activeRoles[i].clientID != aiID)
                count++;
        }

        return count;

    }

    HumansConnected()
    {
         var count = 0;

        for(var i = 0; i < this.players.length; i++)
        {
            if(this.players[i] && this.players[i].clientID != "" && this.players[i].clientID != "disconnected")
                count++;
        }

        return count;       
    }

    CleanAudience(audienceList)
    {
        for (var key in audienceList) {
            if (audienceList.hasOwnProperty(key)) {

                var differenceInMilliseconds = new Date() - audienceList[key].lastHeard;

                if (differenceInMilliseconds >= 0.5 * 60 * 1000)
                {
                    delete audienceList[key];
                }
            }
        }
    }

    

    /*JoinHearing(playerData)
    {

        console.log("playerData.clientID: " + playerData.clientID);
        for(var i = 0; i < this.player.length; i++)
        {
            if(this.player[i].clientID == "")
            {
                this.courtEmpty = false;
                this.player[i].clientID = playerData.clientID;
                this.player[i].name = playerData.name;
                this.player[i].profileUrl = playerData.profileUrl;

                this.messagesChat.AddToChat(this.narrator, "The " + this.player[i].role + " " + this.player[i].name + " entered the courtroom.");

                if (this.audience.hasOwnProperty(playerData.clientID))
                    delete this.audience[playerData.clientID];

                return this.player[i];
            }
        }

        /*if(this.running && this.player.length < this.roles.length)
        {
            return AddPlayer();
        }*/
/*
        console.log("is not joining");
        return null;
    }*/
   
    PlayerIntroduction()
    {
        console.log("PlayerIntroduction()");
        console.log(this.turn);
        console.log(this.keyRoles[this.turn]);
        console.log(this.keyRoles);
        if(this.keyRoles[this.turn] == "Plaintiff")
            return "Plaintiff, do you have anything to add?";
        else if(this.keyRoles[this.turn] == "Defendant")
            return "Defendant, what is your repsonse?";
        else
            return "Does anyone else have anything to say?";
        
    }

    

    async AiRespond()
    {
        var prompt =  "You are " + this.activeRoles[this.turn].role + this.activeRoles[this.turn].name + " in court case " + this.gameCase + ". Make a very breif testimonal, of one or two sentences and include some suprising, abusrd and/or funny new information.";//prompts.punishment.replace("$", ruling);
        var testimonial = await AskGPT(prompt);
        return testimonial;
        
    }


    async AiAutoComplete(clientID)
    {
        var prompt =  "You are " + this.players[clientID].role + this.players[clientID].name + " in court case " + this.gameCase + ". Make a very breif testimonal, of one or two sentences and include some suprising, abusrd and/or funny new information.";//prompts.punishment.replace("$", ruling);
        var testimonial = await AskGPT(prompt);
        return testimonial;
        
    }

    async CreateRuling() 
    {
        var prompt = this.prompts.judgeCharacter  + "You are creating a story and drawing your conclusion and announcing the verdict based on the following evidence.  Justify your verdict. The case is: {" + this.gameCase + "}. The "+this.activeRoles[0].role+"'s' testimony is: {" + this.activeRoles[0].testimony + "} The "+this.activeRoles[1].role+"'s' defence testimony is: {" + this.activeRoles[1].testimony + "}";
        this.ruling = await AskGPT(prompt);
        if(this.stop)
            return;

        this.messagesChat.AddToChat(this.judge, this.ruling);
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    async CreatePunsihment()
    {
        var prompt =  this.prompts.punishment.replace("$", this.ruling);
        console.log(prompt);
        this.punishment = await AskGPT(prompt);
        if(this.stop)
            return;

        this.messagesChat.AddToChat(this.judge, this.punishment);
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    async DeclareWinner()
    {
        //LogDiscordMessages(this.messagesChat);  
        var prompt = this.prompts.winner.replace("$", this.ruling);
        this.winner = await AskGPT(prompt);
        if(this.stop)
            return;
        
        console.log(this.winner);

        if(this.winner.toLowerCase().includes("innocent"))//this.activeRoles[1].role.toLowerCase()))
        {
            return this.activeRoles[1];
        }

        this.running = false;
    }

    async Analysis(playerid)
    {
        var prompt =  this.prompts.scoring.replace("$", this.activeRoles[playerid].testimony).replace("%", this.activeRoles[playerid].role);
        console.log(prompt);
        this.activeRoles[playerid].score = await AskGPT(prompt);

        return this.activeRoles[playerid];
    }

    async RestartGame()
    {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("restart");
        this.init();
        this.Start();
    }

    GetPlayersTurn()
    {
        if(this.aiTurn)
            return this.judge;

        if(this.activeRoles.length > this.turn)
            return this.activeRoles[this.turn];

        return this.judge;
    }

    Stop()
    {
        this.stop = true;
    }

}

class MessageBackEnd
{
    constructor()
    {
        this.messages = {};
        this.messages.length = 0;
    }

     //Add a message to the chat - maybe this should be in a message class
    AddToChat(playerSpeaking, chat)
    {
        this.messages[this.messages.length] = {};
        this.messages[this.messages.length].sender = playerSpeaking;
        this.messages[this.messages.length].message = chat;
        this.messages[this.messages.length].discord = false;
        this.messages.length++;
    }
}

class Player {
    constructor(name, role, clientID) {
        this.name = name;
        this.role = role;
        this.testimony = null;
        this.typing="";
        this.class = role.toLowerCase();
        this.score;
        this.clientID = clientID;
        this.profileUrl = "";
        this.lastHeard = Date.now();
        this.timeLeft = 60;
        this.connected = true;
    }

    Reset()
    {
        this.testimony = null;
        this.typing = null;
        this.score = null;
        this.timeLeft = 60;
    }

    SetRole(role)
    {
        this.role = role;
        this.class = role.toLowerCase();
    }
}

class Prompts {
    constructor() {

        this.judgeCharacter = "You are JudgeGPT, a judge in a televised small claims court TV show. You are similar to Judge Judy.";
        this.cases = [ "Come up with an absurd and/or hilarious accusation to be argued in small claims court between two parties.",
            "Come up with an absurd and/or hilarious accusation to be argued in court between two parties.",
            "Come up with a ridiculous and hilarious accusation to be argued in court between two parties."];
        this.punishment = "Provide a funny, absurd and unfitting punishment and lesson to be learnt for the following court ruling:{$}";
        this.winner = "A judge ruled the following: {$} Give a single word response of 'guity' or 'innocent' for the defendant. ";
        this.scoring = "You are scoring the result of a text based improv game, by %. Score the sentence on each of the four metrics, creativity, intelligence, humor and provide explanations on each. The sentence to be scored is {$}. At the end, provide a total score.";
    }
}


module.exports = JudgeGPTPartyServer;

async function AskGPT(input) {
    // Create a new OpenAI Reponse with prompt
    var promptResponse = new PromptGPT(input);

    try {
        // Get the response 
        const data = await promptResponse.AskGPT();
        return data.generatedText;
    } catch(error) {
        // If there is an error, log it
        console.error(error);
        return "error";
    }
}










const profileImages = [
    "brennanhatton_profile_picture_of_person_preparing_to_go_to_cour_e2da51d0-fb44-4204-96fe-9bb4c311e862.png",
    "brennanhatton_profile_picture_of_person_preparing_to_go_to_cour_6afb3b07-5722-4095-99b5-674658d56429.png",
    "brennanhatton_profile_picture_of_person_preparing_to_go_to_cour_d5de75c4-d7fa-40e5-b370-b4e97ee8920d.png",
    "brennanhatton_profile_picture_of_person_preparing_to_go_to_cour_b44a92bc-be0e-45d7-add5-349f4c2c0687.png",
    "brennanhatton_profile_picture_of_person_preparing_to_go_to_cour_01f3ff74-4a43-4f8e-b067-e027b01445ba.png",
    "brennanhatton_profile_picture_of_person_preparing_to_go_to_cour_7304d215-0a0f-46ab-a971-5516a8790cc7.png"
    ];

function GetRandomProfileImage()
{
    return 'https://brennan.games/JudgeGPT/images/profiles/' + profileImages[Math.floor(Math.random() * profileImages.length)];
}

/*
async function GetImage(input)
{


    try {
        console.log("progressInterval = setInterval(async function(){\n                try {");

        // Make POST request to updateUnFake
        const response = await fetch('https://brennan.games:3000/MJImage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: input }),
        });
        
        // Parse response data
        const data = await response.json();
        console.log(data);
        console.log(data.image);
        return data.image;

    } catch(error) {
        // If an error occurs, log it and update loading element
        console.error("Error fetching update: ", error);
        clearInterval(AskingGPTInterval);
        typingDiv.innerText="";
        return "Server unresponsive...";
    }
}


async function LogDiscordMessages(msgChat)
{
    /*var messages = msgChat.messages;

    for(var i =0 ;i  < messages.count; i++)
    {
        if(messages[i].discord == false)
        {
            
            
            var response = await fetch('https://brennan.games:3000/DiscrdWebHook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: messages[i].sender.role + " " + messages[i].sender.name + ": " + messages[i].message }),
        });  

            console.log(repsonse);

            messages[i].discord = true;
        }
    }*/ /*
}

async function SendMessage(input) {
  const response = await fetch('https://brennan.games:3000/DiscrdWebHook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: input }),
        });
}*/