
const PromptGPT = require('./PromptGPT');
const RandomLines = require('./RandomLines');


class JudgeGPTServer {

    constructor() {
        this.init();
    }

    init()
    {
        this.judge = new Player("GPT", "Judge", "ai");
        this.narrator = new Player("","", "system");

        this.players = {};//[
            //this.judge,
            //new Player("","Plaintiff", ""),
            //new Player("","Defendant", "")
        //];

        this.audience = {};

        this.roles = [
            "Plaintiff",
            "Defendant"
            ];

        this.turn = 0;

        this.gameCase = "undefined";
        this.ruling = "";
        this.punishment = "";

        this.messagesChat = new MessageBackEnd();
        this.prompts = new Prompts();

        this.running = false;
        this.aiTurn = true;
        this.courtEmpty = true;
    }

    // Start the game
    async Start() {

        this.running = true;
        this.aiTurn = true;

        this.gameCase = await AskGPT(this.prompts.cases[Math.floor(Math.random() * this.prompts.cases.length)]);
        this.messagesChat.AddToChat(this.judge, this.gameCase);
        await new Promise(resolve => setTimeout(resolve, 3000));

        if(this.courtEmpty)
            this.messagesChat.AddToChat(this.narrator, "The court will begin when the members arrive.");

        while(this.courtEmpty)
        {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        this.NextPlayer();

        //LogDiscordMessages(this.messagesChat);/*
        /*
        var imageUrl = GetImage(gameCase);
        console.log(imageUrl);
        const  img = document.createElement('img');
        img.src = imageUrl;
        inputGroup.appendChild(img);//*/

    }

    OnPlayerConnected(ClientID)
    {
        if(this.players.hasOwnProperty(ClientID))
            return this.players[ClientID];

        return this.AddNewPlayerToAudience(ClientID);
        
    }

    AddNewPlayerToAudience(ClientID)
    {
            var newPlayer = new Player(RandomLines.GetRandomName(), "Audience", ClientID);

            //Genearte ProfileURL
            newPlayer.profileUrl = GetRandomProfileImage();

            this.players[ClientID] = newPlayer;
            
            return newPlayer;
    }

    InAudience(playerData)
    {
        playerData.lastHeard = new Date();

        if(this.CheckPlayerInGame(playerData.clientID))
            this.audience[playerData.clientID] = playerData;
    }

    CheckPlayerInGame(clientID)
    {
        for(var i = 0; i < this.player.length; i++)
        {
            if(this.player[i].clientID != clientID)
                return true;
        }

        return false;
    }

    GetPlayers()
    {
        var playerlist = {};
        playerlist.players = this.player;
        playerlist.judge = this.judge;

        this.CleanAudience(this.audience);
        playerlist.audience = this.audience;

        return playerlist;
    }

    PlayersInGame()
    {
        var count = 0;

        for(var i = 0; i < this.player.length; i++)
        {
            if(this.player[i].clientID != "")
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

    

    JoinHearing(playerData)
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

        console.log("is not joining");
        return null;
    }
   
    PlayerIntroduction()
    {
        switch(this.player[this.turn].role)
        {
            case "Plaintiff":
                return "Plaintiff, do you have anything to add?";
            case "Defendant":
                return "Defendant, what is your repsonse?";
            default:
                return "Does anyon else have anything to say?";
        }
    }

    async NextPlayer()
    {
        console.log(this.turn);

        await new Promise(resolve => setTimeout(resolve, 1000));
        this.messagesChat.AddToChat(this.judge, this.PlayerIntroduction(this.player[this.turn]));

        if(this.turn >= this.player.length)
        {
            return;
        }

        console.log(this.player[this.turn].clientID);
        if(this.player[this.turn].clientID == "" || this.player[this.turn].clientID == null)
        {
            this.player[this.turn].clientID = "AI";  
            this.player[this.turn].name = RandomLines.GetRandomName() + " ai"; 
            this.messagesChat.AddToChat(this.narrator, "The " + this.player[this.turn].role + " " + this.player[this.turn].name + " entered the courtroom.");
            await this.SubmitTestimony(await this.AiRespond());
            return;
        }
        
        this.aiTurn = false;
        //send message to clients


        //if there are multiple players, they have a time limit to respond.
        if(this.PlayersInGame() > 1)
        {
            await new Promise(resolve => setTimeout(resolve, 60000));

            if(this.player[this.turn].testimony == null)
            {
                //this.player[this.turn].clientID = "AI";  
                this.player[this.turn].name = RandomLines.GetRandomName() + " ai"; 
                await this.SubmitTestimony(await this.AiRespond());
            }
        }

    }

    async AiRespond()
    {
        var prompt =  "You are " + this.player[this.turn].role + this.player[this.turn].name + " in court case " + this.gameCase + ". Make a very breif testimonal, of one or two sentences and include some suprising, abusrd and/or funny new information.";//prompts.punishment.replace("$", ruling);
        var testimonial = await AskGPT(prompt);
        return testimonial;
        
    }

    // Define asynchronous function to send data
    async SubmitTestimony(testimony) {

        //GlitchBackground();

        console.log(testimony);

        this.aiTurn = true;

        this.player[this.turn].testimony = testimony;//this.UI.userInput.inputFeild.value;

        this.messagesChat.AddToChat(this.player[this.turn], this.player[this.turn].testimony);

        if(this.turn < this.player.length-1)
        {
            this.turn++;
            this.NextPlayer();

            //LogDiscordMessages(this.messagesChat);
        }else
        {
            await this.CreateRuling();
            await this.CreatePunsihment();
            await this.DeclareWinner();
            for(var i = 0 ; i < this.player.length; i++)
                await this.Analysis(i);
            await this.RestartGame();

        }

    }

    async CreateRuling() 
    {
        var prompt = this.prompts.judgeCharacter  + "You are creating a story and drawing your conclusion and announcing the verdict based on the following evidence.  Justify your verdict. The case is: {" + this.gameCase + "}. The "+this.player[0].role+"'s' testimony is: {" + this.player[0].testimony + "} The "+this.player[1].role+"'s' defence testimony is: {" + this.player[1].testimony + "}";
        this.ruling = await AskGPT(prompt);
        this.messagesChat.AddToChat(this.judge, this.ruling);
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    async CreatePunsihment()
    {
        var prompt =  this.prompts.punishment.replace("$", this.ruling);
        console.log(prompt);
        this.punishment = await AskGPT(prompt);
        this.messagesChat.AddToChat(this.judge, this.punishment);
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    async DeclareWinner()
    {
        //LogDiscordMessages(this.messagesChat);  
        var prompt = this.prompts.winner.replace("$", this.ruling);
        var winner = await AskGPT(prompt);
        
        if(winner.toLowerCase().includes(this.player[1].role.toLowerCase()))
        {
            return this.player[1];
        }

        this.running = false;
    }

    async Analysis(playerid)
    {
        var prompt =  this.prompts.scoring.replace("$", this.player[playerid].testimony).replace("%", this.player[playerid].role);
        console.log(prompt);
        this.player[playerid].score = await AskGPT(prompt);

        return this.player[playerid];
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

        return this.player[this.turn];
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
        this.class = role.toLowerCase();
        this.score;
        this.clientID = clientID;
        this.profileUrl = "";
    }
}

class Prompts {
    constructor() {

        this.judgeCharacter = "You are JudgeGPT, a judge in a televised small claims court TV show. You are similar to Judge Judy.";
        this.cases = [ "Come up with an absurd and/or hilarious accusation to be argued in small claims court between two parties.",
            "Come up with an absurd and/or hilarious accusation to be argued in court between two parties.",
            "Come up with a ridiculous and hilarious accusation to be argued in court between two parties."];
        this.punishment = "Provide a funny, absurd and unfitting punishment and lesson to be learnt for the following court ruling:{$}";
        this.winner = "A judge ruled the following: {$} Give a single word response of who is the winner, Plaintiff, Defendant or neither. ";
        this.scoring = "You are scoring the result of a text based improv game, by %. Score the sentence on each of the four metrics, creativity, intelligence, humor and provide explanations on each. The sentence to be scored is {$}. At the end, provide a total score.";
    }
}


module.exports = JudgeGPTServer;

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
    return './images/profiles/' + profileImages[Math.floor(Math.random() * profileImages.length)];
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