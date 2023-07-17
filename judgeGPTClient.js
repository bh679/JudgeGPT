class JudgeGPTClient
{
    constructor(chatDiv, winnerDiv, subheading, gameOverUI, userInput, typingDiv, server) {
        // Define global variables
        this.chatDiv = chatDiv;
        this.winnerDiv = winnerDiv;
        this.subheading = subheading;
        
        this.gameOverUI = gameOverUI;
        this.analysis = analysis;
        this.userInput = userInput;

        this.typingDiv = typingDiv;

        this.server = server;// = new JudgeGPT();

        this.messageUI = new MessageUI(chatDiv);

    }

    async Start()
    {
        this.gameOverUI.group.hidden = true;
        this.userInput.group.hidden = true;
        this.analysis.group.hidden = true;

        server.Join();

        this.GetGameState();
    }

    MyTurn(player)
    {
        this.userInput.group.hidden = false;
        this.userInput.inputFeild.value = "";
        this.userInput.inputFeild.placeholder = player.role + " " + player.name;
    }

    async GetGameState()
    {
        while(this.server.running) 
        {
            console.log("await new Promise(resolve => setTimeout(resolve, 1000));");
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log(this.server);
            console.log(this.server.messagesChat);
            this.messageUI.UpdateChat(this.server.messagesChat.messages);
        }

    }

    TypeIntoInput()
    {
        this.userInput.aiRespondButton.disabled = this.userInput.inputFeild.value.length > 0;
    }

    SubmitTestimony()
    {
        this.judegGPT.SubmitTestimony(userInput.inputFeild.value);
    }

    async AiRespond()
    {
        this.userInput.aiRespondButton.disabled = true;
        
        testimonial = await this.judegGPT.AiRespond();

        this.userInput.inputFeild.value = testimonial;
        this.userInput.aiRespondButton.disabled = false;
    }

    async Analysis()
    {
        this.analysis.group.hidden = false;
        this.analysis.button.hidden = true;

        for(var i = 0; i < 2; i++)
        {
            player = await this.server.Analysis(i);
            this.analysis.player[i].innerText = player.role +"\n"+player.testimony + "\n\n" + player.score;
        }

    }

    async DrawConclusion()
    {
        // Disable the submit button
        this.userInput.submitButton.disabled = true;
        this.userInput.group.hidden = true;

        this.server.CreateRuling(); 

        this.server.CreatePunsihment();

        var winner = this.server.DeclareWinner();

        this.winnerDiv.innerText = "Winner: " + winner.role;
        this.winnerDiv.classList.add(winner.class);

        this.analysis.group.hidden = false;
        this.gameOverUI.group.hidden = false;
    }

    UpdateChat()
    {

    }
}

class ChatLineUI
{
    constructor(message, alt, consecutive) {

        this.message = message;

        this.groupDiv = document.createElement('div');
        this.groupDiv.classList.add("row");
        this.groupDiv.classList.add("message");
        this.groupDiv.classList.add(this.message.sender.class);
        if(alt)
            this.groupDiv.classList.add("alt");

        this.messageContentsDiv = document.createElement('div');
        this.messageContentsDiv.classList.add("col");
        this.messageContentsDiv.classList.add("rounded-3");
        this.messageContentsDiv.innerText = this.message.message;

        this.senderDiv = document.createElement('div');
        this.senderDiv.classList.add("col-2");
        this.senderDiv.classList.add("sender");

        if(!consecutive)
        {
            this.senderDiv.innerText = this.message.sender.role + " "+ this.message.sender.name+": ";
        }

        this.groupDiv.appendChild(this.senderDiv);
        this.groupDiv.appendChild(this.messageContentsDiv);
    }

    GetDiv()
    {
        return groupDiv;
    }
}

class MessageUI
{
    constructor(chatDiv) {
        this.chatDiv = chatDiv;

        this.messagesDivs = {};
    }

    UpdateChat(messages)
    {
        this.chatDiv.innerHTML = '';

        console.log("UpdateChat() messages.count:" + messages.count);

        for(var i = 0; i < messages.count; i++)
        {
            console.log(messages[i].messages);
            var consecutive = (i > 1 && messages[i-1].sender != messages[i].sender);

            this.messagesDivs[i] = new ChatLineUI(messages[i], (i % 2 == 0), consecutive);

            this.chatDiv.appendChild(this.messagesDivs[i].groupDiv);
        }

    }
}