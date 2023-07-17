
let progressInterval = {};

class JudgeGPT {
    constructor() {
        this.name = name;
        this.age = age;
    }

    greet() {
        console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
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

let player = [
    new Player("","Plaintiff","Plaintiff, do you have anything to add?","plaintiff"),
    new Player("","Defendant","Defendant, what is your repsonse?","defendant"),
    ];

let judge = new Player("GPT", "Judge", "", "judge");

var turn = 0;

var gameCase = "undefined";

var prompts = {};
prompts.judgeCharacter = "You are JudgeGPT, a judge in a televised small claims court TV show. You are similar to Judge Judy.";
prompts.cases = [ "Come up with an abusrd and/or hilarious accursation to be argued in small claims court between two parties.",//" ("+player[0].role + "&" +player[1].role+ ")",
"Come up with an abusrd and/or hilarious accursation to be argued in court between two parties.",
"Come up with a rediculous and hilarious accursation to be argued in court between two parties."];
prompts.punishment = "Provide a funny, absurd and unfitting punishment and lesson to be learnt for the following court ruling:{$}";
prompts.winner = "A judge rulled the following: {$} Give a single word repsonse of who is the winner, "+player[0].role +", "+player[1].role +" or neither. ";
prompts.scoring = "You are scoring the result of a text based improve game, by %. Score the setence on each of the four metrics, creativity, intelligence, humor and provide explinations on each. The sentence to be scored is {$}. At the end, provide a total score.";

let messages = {};
messages.count = 0;

var ruling = "";


// Define asynchronous function to send data
async function Start() {

   //* 
    endButtons.hidden = true;
    inputGroup.hidden = true;
    analysisGroup.hidden = true;
    gameCase = await AskGPT(prompts.cases[Math.floor(Math.random() * 3)]);
    AddToChat(judge, gameCase);
    UpdateGameState();
    inputGroup.hidden = false;

    LogDiscordMessages();/*

    var imageUrl = GetImage(gameCase);
    console.log(imageUrl);
    const  img = document.createElement('img');
    img.src = imageUrl;
    inputGroup.appendChild(img);//*/

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

function AddToChat(playerSpeaking, chat)
{
    messages[messages.count] = {};
    messages[messages.count].sender = playerSpeaking;
    messages[messages.count].message = chat;
    messages[messages.count].discord = false;
    messages.count++;

    const newChat = document.createElement('div');
    newChat.classList.add("row");
    newChat.classList.add("message");
    newChat.classList.add(playerSpeaking.class);

    if(messages.count % 2 == 0)
        newChat.classList.add("alt");


    const messageContents = document.createElement('div');
    messageContents.classList.add("col");
    //messageContents.classList.add("messageContents");
    messageContents.classList.add("rounded-3");
    messageContents.innerText = chat;
    

    const sender = document.createElement('div');
    sender.classList.add("col-2");
    sender.classList.add("sender");

    if(messages.count <= 1 || messages[messages.count-2].sender != playerSpeaking)
    {
        sender.innerText = playerSpeaking.role + " "+ playerSpeaking.name+": ";
    }

    newChat.appendChild(sender);
    newChat.appendChild(messageContents);
    chatDiv.appendChild(newChat);
}

function UpdateGameState()
{

    AddToChat(judge, player[turn].instruction);
    userInputFeild.value = "";
    userInputFeild.placeholder = player[turn].role + " " + player[turn].name;

}

async function AiRespond()
{
    aiRespondButton.disabled = true;
    console.log(turn);
    console.log(player[turn].role);
    prompt =  "You are " + player[turn].role + player[turn].name + " in court case " + gameCase + ". Make a very breif testimonal, of one or two sentences and include some suprising, abusrd and/or funny new information.";//prompts.punishment.replace("$", ruling);
    console.log(prompt);
    var testimonial = await AskGPT(prompt);
    userInputFeild.value = testimonial;
    aiRespondButton.disabled = false;
    //AddToChat(player[turn], testimonial);

    //Next();
}



// Define asynchronous function to send data
async function Next() {

    //GlitchBackground();

    player[turn].testimony = userInputFeild.value;

    AddToChat(player[turn], player[turn].testimony);

    if(turn == 0)
    {
        turn++;
        UpdateGameState();

        LogDiscordMessages();
    }else
        DrawConclusion();

    aiRespondButton.disabled = false;

}

function TypeIntoInput()
{
    aiRespondButton.disabled = userInputFeild.value.length > 0;
}

async function DrawConclusion() 
{
    // Disable the submit button
    submitButton.disabled = true;
    inputGroup.hidden = true;

    var prompt = prompts.judgeCharacter  + "You are creating a story and drawing your conclusion and announcing the verdict based on the following evidence.  Justify your verdict. The case is: {" + gameCase + "}. The "+player[0].role+"'s' testimony is: {" + player[0].testimony + "} The "+player[1].role+"'s' defence testimony is: {" + player[1].testimony + "}";
    ruling = await AskGPT(prompt);
    AddToChat(judge, ruling);

    prompt =  prompts.punishment.replace("$", ruling);
    console.log(prompt);
    var punishment = await AskGPT(prompt);
    AddToChat(judge, punishment);

    prompt = prompts.winner.replace("$", ruling);
    var winner = await AskGPT(prompt);
    winnerDiv.innerText = "Winner: " + winner;
   if(winner.toLowerCase().includes(player[1].role.toLowerCase()))
        winnerDiv.classList.add(player[1].class);
    else
        winnerDiv.classList.add(player[0].class);

    LogDiscordMessages();  


    analysisGroup.hidden = false;
    endButtons.hidden = false;
    restartButton.onclick = function() {
      location.reload();
    };

}

async function Analysis()
{
    analysisGroup.hidden = false;
    analysisButton.hidden = true;
    prompt =  prompts.scoring.replace("$", player[0].testimony).replace("%", player[0].role);
    console.log(prompt);
    var p0Score = await AskGPT(prompt);
    analysis[0].innerText = player[0].role +"\n"+player[0].testimony + "\n\n" + p0Score;


    prompt =  prompts.scoring.replace("$", player[1].testimony).replace("%", player[1].role);
    console.log(prompt);
    var p1Score = await AskGPT(prompt);
    analysis[1].innerText = player[1].role +"\n"+player[1].testimony+ "\n\n" + p1Score;
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


async function LogDiscordMessages()
{
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