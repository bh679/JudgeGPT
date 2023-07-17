
let progressInterval = {};

class JudgeGPT {

    constructor(UI) {
        this.player = [
            new Player("","Plaintiff","Plaintiff, do you have anything to add?","plaintiff"),
            new Player("","Defendant","Defendant, what is your repsonse?","defendant"),
        ];

        this.judge = new Player("GPT", "Judge", "", "judge");

        this.turn = 0;

        this.gameCase = "undefined";
        this.ruling = "";
        this.punishment = "";

        this.UI = UI;

        this.messagesChat = new MessageChat(UI.chatDiv);
        this.prompts = new Prompts(this.player);
    }

    // Start the game
    async Start() {

       //* 
        this.UI.gameOverUI.group.hidden = true;
        this.UI.userInput.group.hidden = true;
        this.UI.analysis.group.hidden = true;
        this.gameCase = await AskGPT(this.prompts.cases[Math.floor(Math.random() * 3)]);
        this.messagesChat.AddToChat(this.judge, this.gameCase);
        this.UpdateGameState();
        this.UI.userInput.group.hidden = false;

        LogDiscordMessages(this.messagesChat);/*

        var imageUrl = GetImage(gameCase);
        console.log(imageUrl);
        const  img = document.createElement('img');
        img.src = imageUrl;
        inputGroup.appendChild(img);//*/

    }

   

    UpdateGameState()
    {
        this.messagesChat.AddToChat(this.judge, this.player[this.turn].instruction);
        this.UI.userInput.inputFeild.value = "";
        this.UI.userInput.inputFeild.placeholder = this.player[this.turn].role + " " + this.player[this.turn].name;

    }

    async AiRespond()
    {
        this.UI.userInput.aiRespondButton.disabled = true;
        console.log(this.turn);
        console.log(this.player[this.turn].role);
        var prompt =  "You are " + this.player[this.turn].role + this.player[this.turn].name + " in court case " + this.gameCase + ". Make a very breif testimonal, of one or two sentences and include some suprising, abusrd and/or funny new information.";//prompts.punishment.replace("$", ruling);
        console.log(prompt);
        var testimonial = await AskGPT(prompt);
        this.UI.userInput.inputFeild.value = testimonial;
        this.UI.userInput.aiRespondButton.disabled = false;
        //AddToChat(player[turn], testimonial);

        //Next();
    }

    // Define asynchronous function to send data
    async Next() {

        //GlitchBackground();

        this.player[this.turn].testimony = this.UI.userInput.inputFeild.value;

        this.messagesChat.AddToChat(this.player[this.turn], this.player[this.turn].testimony);

        if(this.turn == 0)
        {
            this.turn++;
            this.UpdateGameState();

            LogDiscordMessages(this.messagesChat);
        }else
            this.DrawConclusion();

        this.UI.userInput.aiRespondButton.disabled = false;

    }

    async DrawConclusion() 
    {
        // Disable the submit button
        this.UI.userInput.submitButton.disabled = true;
        this.UI.userInput.group.hidden = true;

        var prompt = this.prompts.judgeCharacter  + "You are creating a story and drawing your conclusion and announcing the verdict based on the following evidence.  Justify your verdict. The case is: {" + this.gameCase + "}. The "+this.player[0].role+"'s' testimony is: {" + this.player[0].testimony + "} The "+this.player[1].role+"'s' defence testimony is: {" + this.player[1].testimony + "}";
        this.ruling = await AskGPT(prompt);
        this.messagesChat.AddToChat(this.judge, this.ruling);

        prompt =  this.prompts.punishment.replace("$", this.ruling);
        console.log(prompt);
        this.punishment = await AskGPT(prompt);
        this.messagesChat.AddToChat(this.judge, this.punishment);

        prompt = this.prompts.winner.replace("$", this.ruling);
        var winner = await AskGPT(prompt);
        this.UI.winnerDiv.innerText = "Winner: " + winner;
        if(winner.toLowerCase().includes(this.player[1].role.toLowerCase()))
            this.UI.winnerDiv.classList.add(this.player[1].class);
        else
            this.UI.winnerDiv.classList.add(this.player[0].class);

        LogDiscordMessages(this.messagesChat);  

        this.UI.analysis.group.hidden = false;
        this.UI.gameOverUI.group.hidden = false;
        this.UI.gameOverUI.restartButton.onclick = function() {
          location.reload();
        };

    }

    async Analysis()
    {
        this.UI.analysis.group.hidden = false;
        this.UI.analysis.button.hidden = true;
        prompt =  this.prompts.scoring.replace("$", this.player[0].testimony).replace("%", this.player[0].role);
        console.log(prompt);
        var p0Score = await AskGPT(prompt);
        this.UI.analysis.player[0].innerText = this.player[0].role +"\n"+this.player[0].testimony + "\n\n" + p0Score;


        prompt =  this.prompts.scoring.replace("$", this.player[1].testimony).replace("%", this.player[1].role);
        console.log(prompt);
        var p1Score = await AskGPT(prompt);
        this.UI.analysis.player[1].innerText = this.player[1].role +"\n"+this.player[1].testimony+ "\n\n" + p1Score;
    }

}

class JudgeGPTUI
{
    constructor(chatDiv, winnerDiv, subheading, gameOverUI, userInput, typingDiv) {
        // Define global variables
        this.chatDiv = chatDiv;
        this.winnerDiv = winnerDiv;
        this.subheading = subheading;
        
        this.gameOverUI = gameOverUI;
        this.analysis = analysis;
        this.userInput = userInput;

        this.typingDiv = typingDiv;

    }

    TypeIntoInput()
    {
        this.userInput.aiRespondButton.disabled = this.userInput.inputFeild.value.length > 0;
    }
}

class MessageChat
{
    constructor(chatDiv)
    {
        this.messages = {};
        this.messages.count = 0;
        this.chatDiv = chatDiv;
    }

     //Add a message to the chat - maybe this should be in a message class
    AddToChat(playerSpeaking, chat)
    {
        this.messages[this.messages.count] = {};
        this.messages[this.messages.count].sender = playerSpeaking;
        this.messages[this.messages.count].message = chat;
        this.messages[this.messages.count].discord = false;
        this.messages.count++;

        const newChat = document.createElement('div');
        newChat.classList.add("row");
        newChat.classList.add("message");
        newChat.classList.add(playerSpeaking.class);

        if(this.messages.count % 2 == 0)
            newChat.classList.add("alt");

        const messageContents = document.createElement('div');
        messageContents.classList.add("col");
        //messageContents.classList.add("messageContents");
        messageContents.classList.add("rounded-3");
        messageContents.innerText = chat;
        
        const sender = document.createElement('div');
        sender.classList.add("col-2");
        sender.classList.add("sender");

        if(this.messages.count <= 1 || this.messages[this.messages.count-2].sender != playerSpeaking)
        {
            sender.innerText = playerSpeaking.role + " "+ playerSpeaking.name+": ";
        }

        newChat.appendChild(sender);
        newChat.appendChild(messageContents);
        this.chatDiv.appendChild(newChat);
    }
}

class Player {
    constructor(name, role, instruction, styleClass) {
        this.name = name;
        this.role = role;
        this.instruction = instruction;
        this.testimony = "";
        this.class = styleClass;
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
    var messages = msgChat.messages;

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
    }
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