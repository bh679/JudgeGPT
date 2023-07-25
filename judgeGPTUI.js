class JudgeGPTUI
{
    constructor(hero, chatDiv, winnerDiv, subheading, gameOverUI, userInput, courtRoomIdentityGroup, joinHearingButton, audienceDiv, playerListDiv, typingDiv, client) {
        

        // Define global variables
        this.heroDiv = hero;
        this.chatDiv = chatDiv;
        this.winnerDiv = winnerDiv;
        this.subheading = subheading;
        
        this.gameOverUI = gameOverUI;
        this.analysis = analysis;
        this.userInput = userInput;

        this.typingDiv = typingDiv;

        this.messageUI = new MessageUI(chatDiv);
        this.courtRoomIdentity = new CourtRoomIdentity(courtRoomIdentityGroup, joinHearingButton);


        this.playerListUI = new PlayerList(audienceDiv, playerListDiv);

        this.joinNextHearing = false;

        this.judgeImageURL = GetRandomJudgeProfileImage();


        this.client = client;// = new JudgeGPT();
        this.client.onStateChange.AddListener(this.messageUI.UpdateChat);
        this.UpdateChat = this.UpdateChat.bind(this);
        this.client.onStateChange.AddListener(this.UpdateChat);

        this.OnMyTurn = this.OnMyTurn.bind(this);
        this.client.onMyTurn.AddListener(this.OnMyTurn);

        this.OnNotMyTurn = this.OnNotMyTurn.bind(this);
        this.client.onNotMyTurn.AddListener(this.OnNotMyTurn);

        this.OnJoinHearing = this.OnJoinHearing.bind(this);
        this.client.onJoinHearing.AddListener(this.OnJoinHearing);

        this.OnNewHearing = this.OnNewHearing.bind(this);
        this.client.onNewHearing.AddListener(this.OnNewHearing);

        this.UpdatePlayerList = this.UpdatePlayerList.bind(this);
        this.client.onUpdatePlayerList.AddListener(this.UpdatePlayerList);

        this.GetNameFromUI = this.GetNameFromUI.bind(this);
        this.courtRoomIdentity.onSetupComplete.AddListener(this.GetNameFromUI);


        this.winner = "";
        this.aiRespondingInterval;
        this.typingContent = "";
    }

    GetNameFromUI()
    {
        this.client.player.name = this.courtRoomIdentity.playerData.name;
        this.client.player.profileUrl = this.courtRoomIdentity.playerData.profileUrl;
    }


    async Start()
    {

        this.winner = "";
        this.winnerDiv.src="";
        this.gameOverUI.group.hidden = true;
        this.userInput.group.hidden = true;
        this.analysis.group.hidden = true;
        this.userInput.submitButton.disabled = false;

        this.userInput.timer.setAttribute("data-value", 0);

        this.courtRoomIdentity.Reset();

        //if(this.joinNextHearing)
        //{
            //this.TryJoinHearing();
        //}
    }

    OnNewHearing()
    {
        this.Start();
    }

    OnMyTurn(player)
    {
        this.userInput.group.hidden = false;
        //this.userInput.inputFeild.value = "";
        this.userInput.inputFeild.placeholder = player.role + " " + player.name;
        typingDiv.innerText = "";

        console.log(player.timeLeft);

        this.userInput.timer.innerText = player.role + ": " + player.timeLeft + " sec";
/*
        this.userInput.timer.setAttribute("data-value", player.timeLeft);

        const containers = document.getElementsByClassName("chart");
        this.userInput.timer.innerHTML = "";
        const dial = new Dial(containers[0]);
        dial.animateStart();*/

    }

    OnNotMyTurn(player)
    {
        this.userInput.group.hidden = true;
        console.log(player);

        var chatline;
        this.typingContent += ".";

        if(this.typingContent == "....")
        this.typingContent = "";

        var message = "<i>Typing: " + player.testimony + this.typingContent + "</i>";

        if(player.testimony == null)
            message = "<i>Typing: " + this.typingContent + "</i>";

        chatline = new ChatLineUI({message: message, sender: player},(this.messageUI.messages.length % 2 == 0), false);

        console.log(chatline);

        typingDiv.innerHTML = "";
        typingDiv.appendChild(chatline.GetDiv());
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
        this.userInput.aiRespondButton.disabled = (this.userInput.inputFeild.value.length > 0);
    }

    SubmitTestimony()
    {

        this.userInput.submitButton.disabled = true;
        this.userInput.group.hidden = true;

        //this.client.SubmitTestimony(userInput.inputFeild.value);

        this.userInput.aiRespondButton.disabled = false;
        this.userInput.inputFeild.value = "";
    }


    AiResponding()
    {
        this.userInput.aiRespondButton.disabled = true;
        this.userInput.inputFeild.disabled = true;
        this.userInput.submitButton.disabled = true;

        this.aiRespondingInterval = setInterval(() => {
            this.userInput.inputFeild.value += ".";

            if(this.userInput.inputFeild.value.length > 4)
                this.userInput.inputFeild.value = "";

        }, 500); // 500 milliseconds (0.5 seconds) 
        
        //testimonial = await this.judegGPT.AiRespond();

        //this.userInput.inputFeild.value = testimonial;
        //this.userInput.aiRespondButton.disabled = false;
    }

    AiResponded(response)
    {
        this.userInput.inputFeild.value = response;
        this.userInput.aiRespondButton.disabled = false;
        this.userInput.inputFeild.disabled = false;
        this.userInput.submitButton.disabled = false;

        clearInterval(this.aiRespondingInterval);

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

    /*async DrawConclusion()
    {
        // Disable the submit button
        this.userInput.submitButton.disabled = true;
        this.userInput.group.hidden = true;

        this.server.CreateRuling(); 

        this.server.CreatePunsihment();

        var winner = this.server.DeclareWinner();

        //this.winnerDiv.innerText = "Winner: " + winner.role;
        //this.winnerDiv.classList.add(winner.class);

        this.analysis.group.hidden = false;
        this.gameOverUI.group.hidden = false;
    }*/

    UpdatePlayerList(playerList)
    {
        this.playerListUI.CreateAudience(playerList);

        playerList[0].profileUrl = this.judgeImageURL;
        this.playerListUI.CreatePlayerList(playerList)
    }

    UpdateChat(messages)
    {
        var percent = 20-messages.length;
        if(percent < 5) percent = 5;

        this.heroDiv.style="padding-top: "+percent + "%;"
    }


     SetWinner(winner)
     {
        if (this.winner != "")
            return;

        this.winner = winner;

        if(this.winner.toLowerCase() == "plaintiff")
            this.winnerDiv.src="./images/guilty.png";
        else
            this.winnerDiv.src="./images/notguilty.png";
     }
}

class PlayerList
{
    constructor(audienceDiv, playerListDiv)
    {
        this.audienceDiv = audienceDiv;
        this.playerListDiv = playerListDiv;
    }

    CreateAudience(playerList)
    {
        //console.log(audienceList);
        this.audienceDiv.innerText = "Audience: " + (playerList.length-1);

    }
        /*this.audienceDiv.innerHTML = "";

        for (var key in audienceList) {
            if (audienceList.hasOwnProperty(key)) {
                this.audienceDiv.appendChild(this.CreateAudienceMember(audienceList[key]));
            }
        }

    }

    CreateAudienceMember(audienceMember)
    {
        var profileImg = document.createElement('img');
        profileImg.classList.add("rounded-circle");
        profileImg.style = "width:80%; margin:0%";
        profileImg.src = audienceMember.profileUrl;


        var nameDiv = document.createElement('div');
        nameDiv.style = "font-size:10px"
        nameDiv.innerText = audienceMember.name;

        var center = document.createElement('center');
        center.style = "margin:5px;";
        center.appendChild(profileImg);
        center.appendChild(nameDiv);

        var card = document.createElement('div');
        card.classList.add("card");
        card.style = "margin:1px";
        card.appendChild(center);

        var groupDiv = document.createElement('div');
        groupDiv.classList.add("col-3");
        groupDiv.style = "padding:0";
        groupDiv.appendChild(card);

        return groupDiv;
    }*/

    CreatePlayerList(playerList)
    {
        
        this.playerListDiv.innerHTML = "";

        for (var key in playerList) {

            if (playerList.hasOwnProperty(key) && playerList[key].clientID != "") {
                this.playerListDiv.appendChild(this.CreatePlayerListMember(playerList[key]));
            }
        }

    }

    CreatePlayerListMember(playerMember)
    {
        var profileImg = document.createElement('img');
        profileImg.classList.add("rounded-circle");
        profileImg.style = "width:80%; margin:0%";
        profileImg.src = playerMember.profileUrl;



        var roleDiv = document.createElement('div');
        roleDiv.style = "font-size:10px"
        roleDiv.innerText = playerMember.role;

        var nameDiv = document.createElement('div');
        nameDiv.style = "font-size:10px"
        nameDiv.innerText = playerMember.name;

        var center = document.createElement('center');
        center.style = "margin:5px;";
        center.appendChild(profileImg);
        center.appendChild(roleDiv);
        center.appendChild(nameDiv);

        var card = document.createElement('div');
        card.classList.add("card");
        if(playerMember.isMe)
        {
           card.classList.add("text-white");
            card.classList.add("bg-primary");
        }
        card.style = "margin:3px";
        card.appendChild(center);

        var groupDiv = document.createElement('div');
        groupDiv.classList.add("col-4");
        groupDiv.classList.add("col-s-4");
        groupDiv.classList.add("col-xs-3");
        groupDiv.classList.add("col-xxs-2");
        groupDiv.style = "padding:0";
        groupDiv.appendChild(card);

        return groupDiv;
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

        this.onSetupComplete = new CallBack();
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
        this.messages = [];

        this.UpdateChat = this.UpdateChat.bind(this);
    }

    UpdateChat(messages)
    {
        this.messages = messages;

        this.chatDiv.innerHTML = '';

        for(var i = 0; i < messages.length; i++)
        {
            var consecutive = (i >= 1 && messages[i-1].sender.role == messages[i].sender.role);

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
        this.groupDiv.classList.add("message");
        
        //this.groupDiv.classList.add("message");
        this.groupDiv.classList.add("row");
        //this.messageContentsDiv.classList.add("messageContents");
        //console.log(this.message.sender.class);
        if(this.message.sender.class != null && this.message.sender.class != "")
            this.groupDiv.classList.add(this.message.sender.class);
        //if(alt)
        //    this.groupDiv.classList.add("alt");

        this.messageContentsDiv = document.createElement('div');
        this.messageContentsDiv.classList.add("col");
        //this.messageContentsDiv.classList.add("card");
        this.messageContentsDiv.classList.add("messageContents");
        this.messageContentsDiv.classList.add("rounded-3");
        this.messageContentsDiv.innerHTML = this.message.message;

        if(alt)
           this.messageContentsDiv.classList.add("alt");


        this.senderDiv = document.createElement('div');
        this.senderDiv.classList.add("col-4");
        this.senderDiv.classList.add("col-s-3");
        this.senderDiv.classList.add("col-xxs-2");
        this.senderDiv.classList.add("sender");
        if(!consecutive)
        {
            this.senderDiv.style = "";
            this.senderDiv.innerText = this.message.sender.role + " "+ this.message.sender.name+": ";
        }
            this.groupDiv.appendChild(this.senderDiv);
        this.groupDiv.appendChild(this.messageContentsDiv);
    }

    GetDiv()
    {
        return this.groupDiv;
    }
}



