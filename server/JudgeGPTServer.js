"use strict";
console.log('JudgeGPTServer loaded');

const PromptGPT = require('./PromptGPT');
const RandomLines = require('./RandomLines');
const BackgroundImages = require('./BackgroundImages');
const Player = require('./Player');
const MessageBackEnd = require('./Messages');
const Prompts = require('./Prompts');
const JudgeGPTDBManager = require('./JudgeGPTDBManager'); //--- 1/3

const aiID = "ai";

class JudgeGPTServer {

    constructor(restartCallback) {
        this.restartCallback = restartCallback;
        this.players = {}; //all human players, and audience
        this.stop = false;
        this.speechCharTime = 50;

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
        this.caseTitle = "";
        this.backgroundImage = "";

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

        this.judgeGPTDBManager = new JudgeGPTDBManager(this);// -------- Saving is currently disabled while I debug to fix other issues 2/3

        //this.activeRoles.reverse();
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
        let playerIDs = Object.keys(this.players);

        // Shuffle the array of player IDs
        playerIDs = this.shuffleArray(playerIDs);

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

    // Fisher-Yates (aka Knuth) Shuffle algorithm to shuffle an array
    shuffleArray(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
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
        this.judgeGPTDBManager = new JudgeGPTDBManager(this);

        this.backgroundImage = BackgroundImages.GetRandomBackgroundImage();

        this.gameCase = await AskGPT(this.prompts.cases[Math.floor(Math.random() * this.prompts.cases.length)]);

        console.log("game case set");
        this.SetTitle(); //sets title async

        this.messagesChat.AddToChat(this.judge, this.gameCase);
        await new Promise(resolve => setTimeout(resolve, 3000+this.gameCase.length*this.speechCharTime));
        if(this.stop)
            return;

        //if(this.courtEmpty)
        //   this.messagesChat.AddToChat(this.narrator, "The court will begin when the members arrive.");

        while(this.courtEmpty)
        {
            await new Promise(resolve => setTimeout(resolve, 1000));
            if(this.stop)
                return;
        }

        this.NextPlayerTurn();



    }

    async SetTitle()
    {
        this.caseTitle = await AskGPT("Come up for a short title for this legal case: " + this.gameCase);
        this.judgeGPTDBManager.UpdateData(this);

        console.log("Title: " + this.caseTitle);
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
            this.players[clientID].role = "Disconnected";
            
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
            newPlayer.profileUrl = BackgroundImages.GetRandomProfileImage();

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
            newNPC.profileUrl = BackgroundImages.GetRandomProfileImage();
            
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

        //save to database
        this.judgeGPTDBManager.UpdateData(this);//                           -------- Saving is currently disabled while I debug to fix other issues 3/3

        await new Promise(resolve => setTimeout(resolve, 3000 + this.activeRoles[this.turn].testimony.length*this.speechCharTime));

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

            await this.CreatePunishment();
            if(this.stop)
                return;

            await this.CreateLesson();
            if(this.stop)
                return;

            this.messagesChat.AddToChat(this.judge, "");
            for (var i = 0; i < this.activeRoles.length; i++) {
                console.log("Analyzing role:" + i);  // Add logging
                const analysisResult = await this.Analysis(i);  // Ensure this is awaited properly
                console.log(analysisResult);
                this.messagesChat.AddToChat(this.judge, analysisResult);
                if (this.stop) {
                    return;
                }
            }

        
            await new Promise(resolve => setTimeout(resolve, 40000));
            if(this.stop) //this is line 532
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
   
    PlayerIntroduction()
    {
        if(this.keyRoles[this.turn] == "Plaintiff")
            return "Plaintiff, do you have anything to add?";
        else if(this.keyRoles[this.turn] == "Defendant")
            return "Defendant, what is your response?";
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
        var prompt = this.prompts.judgeCharacter  + "You are creating a very brief story of one or two sentences, to draw your conclusion and announcing the verdict based on the following evidence.  Justify your verdict. The case is: {" + this.gameCase + "}. The "+this.activeRoles[0].role+"'s' testimony is: {" + this.activeRoles[0].testimony + "} The "+this.activeRoles[1].role+"'s' defence testimony is: {" + this.activeRoles[1].testimony + "}. Do all this in only a three or less sentences.";
        this.ruling = await AskGPT(prompt);
        if(this.stop)
            return;

        this.messagesChat.AddToChat(this.judge, this.ruling);
        this.judgeGPTDBManager.UpdateData(this);
        await new Promise(resolve => setTimeout(resolve, 3000 + this.ruling.length*this.speechCharTime));
    }

    async CreatePunishment()
    {
        var prompt =  this.prompts.punishment.replace("$", this.ruling);
        console.log(prompt);
        this.punishment = await AskGPT(prompt);
        if(this.stop)
            return;

        this.messagesChat.AddToChat(this.judge, this.punishment);
        this.judgeGPTDBManager.UpdateData(this);
        await new Promise(resolve => setTimeout(resolve, 3000 + this.punishment.length*this.speechCharTime));
    }

    async CreateLesson()
    {
        var prompt =  this.prompts.lesson.replace("$", this.ruling);
        console.log(prompt);
        this.lesson = await AskGPT(prompt);
        if(this.stop)
            return;

        this.messagesChat.AddToChat(this.judge, this.lesson);
        this.judgeGPTDBManager.UpdateData(this);
        await new Promise(resolve => setTimeout(resolve, 3000 + this.lesson.length*this.speechCharTime));
    }

    async DeclareWinner()
    {
        //LogDiscordMessages(this.messagesChat);  
        var prompt = this.prompts.winner.replace("$", this.ruling);
        this.winner = await AskGPT(prompt);
        if(this.stop)
            return;
        
        console.log(this.winner);
        this.judgeGPTDBManager.UpdateData(this);

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
        await new Promise(resolve => setTimeout(resolve, 3000 + this.activeRoles[playerid].score.length*this.speechCharTime));

        return this.activeRoles[playerid].score;
    }

    async RestartGame()
    {
        this.restartCallback();
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

    // Update GetCase to be async
    async GetCase(data) {
        if (data.id != null) {
            var res = await this.judgeGPTDBManager.GetEntryById(data.id);
            //res.max_id = await this.judgeGPTDBManager.FindLastID();
            //console.log("MaxID: " + res.max_id);
            return res;
        }
        return null;
    }

    // Update GetCase to be async
    async GetCaseMaxID() {

        var res =await this.judgeGPTDBManager.FindLastID();
        console.log("MaxID: " + res);
        return res;
        
    }

}



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



module.exports = JudgeGPTServer;