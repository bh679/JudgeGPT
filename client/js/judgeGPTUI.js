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
        this.audioManager = new AudioManager(this.messageUI);
        this.courtRoomIdentity = new CourtRoomIdentity(courtRoomIdentityGroup, joinHearingButton);


        this.playerListUI = new PlayerList(audienceDiv, playerListDiv);

        this.joinNextHearing = false;

        //this.judgeImageURL = GetRandomJudgeProfileImage();


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

        this.audioSettingsButton = document.getElementById('audioSettingsButton');
        this.audioSettings = document.getElementById('audioSettings');
        this.audioSettingsEnabled = false;

        this.musicVolumeSider = document.getElementById('musicVolumeSlider');
        this.musicVolumeSider.value = this.audioManager.musicVolume*100;

        this.voiceVolumeSider = document.getElementById('voiceVolumeSlider');
        this.voiceVolumeSider.value = this.audioManager.voiceVolume*100;

        this.masterVolumeSlider = document.getElementById('masterVolumeSlider');
        this.masterVolumeSlider.value = this.audioManager.masterVolume*100;

    
    }

    GetNameFromUI()
    {
        this.client.player.name = this.courtRoomIdentity.playerData.name;
        this.client.player.profileUrl = this.courtRoomIdentity.playerData.profileUrl;
    }


    async Start()
    {

        console.log("restarting");
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
        this.userInput.profile.src = player.profileUrl;
        this.userInput.group.hidden = false;
        //this.userInput.inputFeild.value = "";
        this.userInput.inputFeild.placeholder = player.role + " " + player.name;
        typingDiv.innerText = "";

        
        this.userInput.timer.innerText = player.role + ": " + player.timeLeft + " sec";

    }

    OnNotMyTurn(player)
    {
        this.userInput.group.hidden = true;

        var chatline;
        this.typingContent += ".";

        if(this.typingContent == "....")
        this.typingContent = "";

        var message = "<i>Typing: " + player.typing + this.typingContent + "</i>";

        if(player.typing == null)
            message = "<i>Typing: " + this.typingContent + "</i>";

        chatline = new ChatLineUI({message: message, sender: player},(this.messageUI.messages.length % 2 == 0), false);

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
//console.log(playerList);

        this.playerListUI.CreateAudience(playerList.audience);

        //playerList.activeRoles[0].profileUrl = this.judgeImageURL;

        this.playerListUI.CreatePlayerList(playerList.activeRoles)

        this.playerListUI.FullPlayerList(playerList.players);
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

        console.log(winner);
        this.winner = winner;

        if(this.winner.toLowerCase() == "guilty")
            this.winnerDiv.src="./images/guilty.png";
        else
            this.winnerDiv.src="./images/notguilty.png";
     }

     ToggleAudio(toggle)
     {
        this.audioManager.toggleAudio(toggle);

        if(toggle)
            this.audioSettingsButton.style.display = 'inline';
        else
            this.audioSettingsButton.style.display = 'none';
     }

     ToggleAudioSettings()
     {
        console.log(this.audioSettings);

        this.audioSettingsEnabled = !this.audioSettingsEnabled;

        if(this.audioSettingsEnabled)
            this.audioSettings.style.display = 'inline';
        else
        {
            this.audioSettings.style.display = 'none';
            this.audioSettingsButton.classList.remove('pressed');
        }



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
        //console.log(role);
        this.roleDiv.innerText = role;
    }
}

