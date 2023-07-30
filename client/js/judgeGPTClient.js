class JudgeGPTClient
{
    constructor()
    {
        this.messages = {length:0};
        this.myTurn = false;

        //this.uniqueID = this.GenerateID();

        this.onMyTurn = new CallBack();
        this.onNotMyTurn = new CallBack();
        this.onStateChange = new CallBack();
        this.onJoinHearing = new CallBack();
        this.onNewHearing = new CallBack();
        this.onUpdatePlayerList = new CallBack();


        this.playerList = [];
        this.activeRoles = [];
        this.audience = [];

        this.player = {};
        this.playerTurn = {clientID:""};
        this.spectatorFlag = false;
    }

    GenerateID() {
        return Math.floor(Math.random() * Date.now()).toString();
    }

    SetPlayersTurn(playerTurn)
    {
        if(this.player == {})
            return;

        if(playerTurn.clientID == this.player.clientID)
        {
            this.myTurn = true;
            this.onMyTurn.Invoke(playerTurn);
        }else
        {
            this.myTurn = false;
            this.onNotMyTurn.Invoke(playerTurn);
        }

        this.playerTurn = playerTurn;
    }

    FlagMeInPlayerList(playerList, turnId)
    {
        for(var i = 0; i < playerList.length; i++)
        {
            playerList[i].isMe = (playerList[i].clientID == this.player.clientID)
            playerList[i].myTurn = ((playerList[i].clientID == this.playerTurn.clientID) && (playerList[i].name == this.playerTurn.name))
        }
    }


    UpdatePlayerList(playerList)
    {

        this.FlagMeInPlayerList(playerList.players);
        this.FlagMeInPlayerList(playerList.activeRoles);
        this.FlagMeInPlayerList(playerList.audience);

        this.playerList = playerList.players;
        this.activeRoles = playerList.activeRoles;
        this.audience = playerList.audience;

        this.onUpdatePlayerList.Invoke(playerList);   
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

    OnJoinGame(playerData)
    {
        this.player = playerData;
        this.onJoinHearing.Invoke(this.player);
    }


    /*async TryJoinHearing(playerData)
    {
        console.log("TryJoinHearing");
        playerData.clientID = this.player.clientID;

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
    }*/
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