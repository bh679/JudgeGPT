class JudgeGPTClient
{
    constructor()
    {
        this.messages = {length:0};
        this.myTurn = false;

        this.uniqueID = this.GenerateID();

        this.onMyTurn = new CallBack();
        this.onStateChange = new CallBack();
        this.onJoinHearing = new CallBack();
        this.onNewHearing = new CallBack();

        this.player;
    }

    GenerateID() {
        return Math.floor(Math.random() * Date.now()).toString();
    }

    ConnectToServer()
    {
        this.GetGameState();
    }

    async GetGameState()
    {
        console.log("GetGameState");
        while(true)
        {
            try {

                // 
                const response = await fetch('https://brennan.games:3000/GetGameState', 
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                
                // Parse response data
                const data = await response.json();
                console.log(data);

                if(this.messages == null || this.messages.length != data.messages.length)
                {
                    this.UpdateState(data.messages);
                }

                console.log("if(data.playerTurn.clientId == this.uniqueID)");
                console.log(data.playerTurn.clientID + " == " +this.uniqueID);
                //is it my turn?
                if(data.playerTurn.clientID == this.uniqueID)
                {
                    this.myTurn = true;
                    this.player = data.playerTurn;

                    this.onMyTurn.Invoke(this.player);

                    return;
                }

                //ReadText(data.generatedText);

            } catch(error) {
                // If an error occurs, log it and update loading element
                console.error("Error fetching update: ", error);
                clearInterval(AskingGPTInterval);
                typingDiv.innerText="";
                return "Server unresponsive...";
            }
        }
    }

    UpdateState(newState)
    {
        this.messages = { ...newState };

        if(this.messages.length == 0)
        {
            this.onNewHearing.Invoke();
        }

        this.onStateChange.Invoke(this.messages);
    }

    async TryJoinHearing(playerData)
    {
        console.log("TryJoinHearing");
        playerData.clientID = this.uniqueID;

        console.log(playerData.clientID);

        //var playerRef = this.server.JoinHearing(playerData);

        // Make POST request to JudgeGPTServer
        var response = await fetch('https://brennan.games:3000/TryJoinHearing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ playerData: playerData }),
        });

        var data = await response.json();

        console.log("playerRef");
        console.log(data);
        console.log(data.playerRef);

        this.player = data.playerRef;
        console.log(this.player);


        this.onJoinHearing.Invoke(this.player);
    }


    async SubmitTestimony(testimony)
    {
        // Make POST request to JudgeGPTServer
        var response = await fetch('https://brennan.games:3000/SubmitTestimony', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ testimony: testimony }),
        });
        
        this.GetGameState();
    }
}

class JudgeGPTUI
{
    constructor(chatDiv, winnerDiv, subheading, gameOverUI, userInput, courtRoomIdentityGroup, joinHearingButton, client) {
        // Define global variables
        this.chatDiv = chatDiv;
        this.winnerDiv = winnerDiv;
        this.subheading = subheading;
        
        this.gameOverUI = gameOverUI;
        this.analysis = analysis;
        this.userInput = userInput;

        //this.typingDiv = typingDiv;

        this.messageUI = new MessageUI(chatDiv);
        this.courtRoomIdentity = new CourtRoomIdentity(courtRoomIdentityGroup, joinHearingButton);
        this.OnMyTurn = this.OnMyTurn.bind(this);
        this.OnJoinHearing = this.OnJoinHearing.bind(this);
        this.OnNewHearing = this.OnNewHearing.bind(this);

        this.client = client;// = new JudgeGPT();
        this.client.onStateChange.AddListener(this.messageUI.UpdateChat);
        this.client.onMyTurn.AddListener(this.OnMyTurn);
        this.client.onJoinHearing.AddListener(this.OnJoinHearing);
        this.client.onNewHearing.AddListener(this.OnNewHearing);

        this.joinNextHearing = false;
    }


    async Start()
    {
        this.gameOverUI.group.hidden = true;
        this.userInput.group.hidden = true;
        this.analysis.group.hidden = true;
        this.userInput.submitButton.disabled = false;

        this.courtRoomIdentity.Reset();

        if(this.joinNextHearing)
        {
            this.TryJoinHearing();
        }
    }

    OnNewHearing()
    {
        this.Start();
    }

    OnMyTurn(player)
    {
        this.userInput.group.hidden = false;
        this.userInput.inputFeild.value = "";
        this.userInput.inputFeild.placeholder = player.role + " " + player.name;
    }

    TryJoinHearing()
    {
        this.courtRoomIdentity.OnTryJoinHearing();
        this.client.TryJoinHearing(this.courtRoomIdentity.playerData);
    }

    OnJoinHearing(player)
    {
        console.log(player);

        if(player == null)
        {
            this.joinNextHearing = true;
        }else
        {
            this.courtRoomIdentity.OnJoinHearing(player.role);
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

        this.client.SubmitTestimony(userInput.inputFeild.value);

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

class CourtRoomIdentity
{
    constructor(courtRoomIdentity, joinHearingButton){


        this.playerData = {};

        this.playerData.profileUrl = GetRandomProfileImage();
        // = RandomLines.GetRandomName();
        this.playerData.name = "";

        this.groupDiv = courtRoomIdentity;
        this.joinHearingButton = joinHearingButton;

        this.profileImg = document.createElement('img');
        this.profileImg.classList.add("rounded-circle");
        this.profileImg.style = "width:60%;margin:20px";
        this.profileImg.src = this.playerData.profileUrl;

        this.nameInput = document.createElement('input');
        this.nameInput.type="text";
        this.nameInput.placeholder=this.playerData.name;
        this.nameInput.style = "width:60%;margin:20px";
        this.nameInput.oninput=() => {
            this.ChangeName();
        };

        this.nameDiv = document.createElement('h5');
        this.nameDiv.innerText = this.playerData.name;
        this.nameDiv.onclick = () => {
            this.EditNameMode(true);
        };


        this.roleDiv = document.createElement('h5');


        this.groupDiv.appendChild(this.profileImg);
        this.groupDiv.appendChild(this.nameInput);
        this.groupDiv.appendChild(this.nameDiv);
        this.groupDiv.appendChild(this.roleDiv);

        this.EditNameMode(false);

        this.Reset();
        this.RandomName();
    }

    async RandomName()
    {
        const response = await fetch('https://brennan.games:3000/RandomName', 
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        // Parse response data
        const data = await response.json();
        this.playerData.name = data.name;
        this.nameInput.placeholder=this.playerData.name;
        this.nameDiv.innerText = this.playerData.name;
    }

    Reset()
    {
        this.roleDiv.innerText = "Audience";
        this.joinHearingButton.disabled = false;
        this.joinHearingButton.hidden = false;
    }

    EditNameMode(isEditing)
    {
        this.nameInput.hidden = !isEditing;
        this.nameDiv.hidden = isEditing;
    }

    ChangeName()
    {
        this.playerData.name = this.nameInput.value;
        this.nameDiv.innerText = this.playerData.name;
    }

    OnTryJoinHearing()
    {
        this.roleDiv.innerText = "Joining Hearing";
    }

    OnJoinHearing(role)
    {
        this.UpdateRole(role);

    }

    UpdateRole(role)
    {
        this.joinHearingButton.hidden = true;
        console.log(role);
        this.roleDiv.innerText = role;
    }
}

class MessageUI
{
    constructor(chatDiv) {
        this.chatDiv = chatDiv;

        this.messagesDivs = {};

        this.UpdateChat = this.UpdateChat.bind(this);
    }

    UpdateChat(messages)
    {
        this.chatDiv.innerHTML = '';

        for(var i = 0; i < messages.length; i++)
        {
            var consecutive = (i >= 1 && messages[i-1].sender == messages[i].sender);

            this.messagesDivs[i] = new ChatLineUI(messages[i], (i % 2 == 0), consecutive);

            this.chatDiv.appendChild(this.messagesDivs[i].groupDiv);
        }

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



class CallBack
{
    constructor()
    {
        this.callbacks = {};
        this.count = 0;
    }

    Invoke()
    {
        for(var i = 0; i < this.count; i++)
        {
            this.callbacks[i]();
        }
    }

    Invoke(input)
    {
        for(var i = 0; i < this.count; i++)
        {
            this.callbacks[i](input);
        }
    }

    AddListener(newFunc)
    {
        if (newFunc && typeof newFunc === 'function')
        {
            this.callbacks[this.count] = newFunc;
            this.count++;
        }else
            console.error("Callback not a function");
    }
}