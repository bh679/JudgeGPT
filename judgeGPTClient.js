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

        this.uniqueID = this.generateID();

    }

    generateID() {
        return Math.floor(Math.random() * Date.now()).toString();
    }


    async Start()
    {
        this.gameOverUI.group.hidden = true;
        this.userInput.group.hidden = true;
        this.analysis.group.hidden = true;

        this.server.Join(this.uniqueID);

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
            await new Promise(resolve => setTimeout(resolve, 1000));

            this.messageUI.UpdateChat(this.server.messagesChat.messages);

            //is it my turn?
            if(this.server.player[this.server.turn].clientID == this.uniqueID && this.server.aiTurn == false)
            {
                this.MyTurn(this.server.player[this.server.turn]);

                return;
            }
        }

    }

    TypeIntoInput()
    {
        this.userInput.aiRespondButton.disabled = this.userInput.inputFeild.value.length > 0;
    }

    SubmitTestimony()
    {

        this.userInput.submitButton.disabled = true;
        this.userInput.group.hidden = true;

        this.server.SubmitTestimony(userInput.inputFeild.value);
        this.GetGameState();

        this.userInput.aiRespondButton.disabled = false;
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

        for(var i = 0; i < messages.count; i++)
        {
            var consecutive = (i >= 1 && messages[i-1].sender == messages[i].sender);

            this.messagesDivs[i] = new ChatLineUI(messages[i], (i % 2 == 0), consecutive);

            this.chatDiv.appendChild(this.messagesDivs[i].groupDiv);
        }

    }
}