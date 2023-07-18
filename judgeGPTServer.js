
let progressInterval = {};

class JudgeGPTServer {

    constructor() {
        this.init();
    }

    init()
    {
        this.judge = new Player("GPT", "Judge", "", "judge", "ai");

        this.player = [
            //this.judge,
            new Player("","Plaintiff","Plaintiff, do you have anything to add?","plaintiff", ""),
            new Player("","Defendant","Defendant, what is your repsonse?","defendant", "")
        ];

        this.turn = 0;

        this.gameCase = "undefined";
        this.ruling = "";
        this.punishment = "";

        this.messagesChat = new MessageBackEnd();
        this.prompts = new Prompts(this.player);

        this.running = false;
        this.aiTurn = true;
        this.courtEmpty = true;
    }

    // Start the game
    async Start() {

        this.running = true;
        this.aiTurn = true;

       //* 
        this.gameCase = await AskGPT(this.prompts.cases[Math.floor(Math.random() * 3)]);
        this.messagesChat.AddToChat(this.judge, this.gameCase);
        await new Promise(resolve => setTimeout(resolve, 3000));

        if(this.courtEmpty)
            this.messagesChat.AddToChat(this.judge, "The court is waiting for the Plaintiff & Defendant to arrive.");

        while(this.courtEmpty)
        {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        this.NextPlayer();

        LogDiscordMessages(this.messagesChat);/*

        var imageUrl = GetImage(gameCase);
        console.log(imageUrl);
        const  img = document.createElement('img');
        img.src = imageUrl;
        inputGroup.appendChild(img);//*/

    }

    JoinHearing(playerData)
    {
        console.log(playerData.clientID);
        for(var i = 0; i < this.player.length; i++)
        {
            if(this.player[i].clientID == "")
            {
                this.player[i].clientID = playerData.clientID;
                this.player[i].name = playerData.name;
                this.player[i].profileUrl = playerData.profileUrl;

                this.messagesChat.AddToChat(this.judge, "The " + this.player[i].role + " " + this.player[i].name + " entered the courtroom.");

                this.courtEmpty = false;

                return this.player[i];
            }
        }

        console.log("is not joining");
        return null;
    }
   

    async NextPlayer()
    {
        console.log(this.turn);
        this.messagesChat.AddToChat(this.judge, this.player[this.turn].instruction);

        if(this.turn >= this.player.length)
        {
            return;
        }

        if(this.player[this.turn].clientID == "")
        {
            this.player[this.turn].clientID = "AI";  
            this.player[this.turn].name = RandomLines.GetRandomName() + " ai"; 
            this.messagesChat.AddToChat(this.judge, "The " + this.player[this.turn].role + " " + this.player[this.turn].name + " entered the courtroom.");
            await this.SubmitTestimony(await this.AiRespond());
        }
        
        this.aiTurn = false;
        //send message to clients

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

            LogDiscordMessages(this.messagesChat);
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
    }

    async CreatePunsihment()
    {

        prompt =  this.prompts.punishment.replace("$", this.ruling);
        console.log(prompt);
        this.punishment = await AskGPT(prompt);
        this.messagesChat.AddToChat(this.judge, this.punishment);
    }

    async DeclareWinner()
    {
        LogDiscordMessages(this.messagesChat);  
        prompt = this.prompts.winner.replace("$", this.ruling);
        var winner = await AskGPT(prompt);
        
        if(winner.toLowerCase().includes(this.player[1].role.toLowerCase()))
        {
            return this.player[1];
        }

        this.running = false;
    }

    async Analysis(playerid)
    {
        prompt =  this.prompts.scoring.replace("$", this.player[playerid].testimony).replace("%", this.player[playerid].role);
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
        console.log(this.messages.length);
        this.messages[this.messages.length] = {};
        this.messages[this.messages.length].sender = playerSpeaking;
        this.messages[this.messages.length].message = chat;
        this.messages[this.messages.length].discord = false;
        this.messages.length++;
    }
}

class Player {
    constructor(name, role, instruction, styleClass, clientID) {
        this.name = name;
        this.role = role;
        this.instruction = instruction;
        this.testimony = "";
        this.class = styleClass;
        this.score;
        this.clientID = clientID;
    }
}

class Prompts {
    constructor(player) {

        this.player = player;

        this.judgeCharacter = "You are JudgeGPT, a judge in a televised small claims court TV show. You are similar to Judge Judy.";
        this.cases = [ "Come up with an absurd and/or hilarious accusation to be argued in small claims court between two parties.",
            "Come up with an absurd and/or hilarious accusation to be argued in court between two parties.",
            "Come up with a ridiculous and hilarious accusation to be argued in court between two parties."];
        this.punishment = "Provide a funny, absurd and unfitting punishment and lesson to be learnt for the following court ruling:{$}";
        this.winner = "A judge ruled the following: {$} Give a single word response of who is the winner, " + player[0].role + ", " + player[1].role + " or neither. ";
        this.scoring = "You are scoring the result of a text based improv game, by %. Score the sentence on each of the four metrics, creativity, intelligence, humor and provide explanations on each. The sentence to be scored is {$}. At the end, provide a total score.";
    }
}


//var players = 0;
function SwitchHuman(playerId)
{
    player[playerId].human = !player[playerId].human;

    if(player[playerId].human)
        playerTypeButton[playerId].innerText = "Human";
    else
        playerTypeButton[playerId].innerText = "AI";
}



async function AskGPT(input)
{

    // Set interval for progress updates
    AskingGPTInterval = setInterval(async function(){

        typingDiv.innerText += ".";

        if(typingDiv.innerText == ".....")
        {
            typingDiv.innerText = ".";
        }

        //interval
    }, 250);  // Interval of 2 seconds

    try {
        console.log("progressInterval = setInterval(async function(){\n                try {");

        // Make POST request to updateUnFake
        const response = await fetch('https://brennan.games:3000/AskGPT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: input }),
        });
        
        // Parse response data
        const data = await response.json();
        clearInterval(AskingGPTInterval);
        typingDiv.innerText="";
       return data.generatedText;

        //ReadText(data.generatedText);

    } catch(error) {
        // If an error occurs, log it and update loading element
        console.error("Error fetching update: ", error);
        clearInterval(AskingGPTInterval);
        typingDiv.innerText="";
        return "Server unresponsive...";
    }
}



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
    }*/
}

async function SendMessage(input) {
  const response = await fetch('https://brennan.games:3000/DiscrdWebHook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: input }),
        });
}