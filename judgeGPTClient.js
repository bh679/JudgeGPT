class JudgeGPTClient
{
    constructor()
    {
        this.messages = {length:0};
        this.myTurn = false;

        //this.uniqueID = this.GenerateID();

        this.onMyTurn = new CallBack();
        this.onStateChange = new CallBack();
        this.onJoinHearing = new CallBack();
        this.onNewHearing = new CallBack();
        this.onUpdatePlayerList = new CallBack();

        this.player = {}
        this.player.clientID = this.GenerateID();
        this.playerList = {};
    }

    GenerateID() {
        return Math.floor(Math.random() * Date.now()).toString();
    }

    async ConnectToServer()
    {
        await this.GetGameState();
    }

    async GetGameState()
    {
        //console.log("GetGameState");
        while(true)
        {
            try {

                var playerData = {...this.player};

                // Make POST request to JudgeGPTServer
                var response = await fetch('https://brennan.games:3000/Update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ playerData: playerData }),
                });

                var data = await response.json();

                if(this.playerList != data.playerList)
                {
                    this.UpdatePlayerList(data.playerList);
                }

                //console.log(data);

                if(this.messages == null || this.messages.length != data.messages.length)
                {
                    this.UpdateState(data.messages);
                }

                //is it my turn?
                if(!this.myTurn && data.playerTurn.clientID == this.player.clientID)
                {
                    this.myTurn = true;
                    this.player = data.playerTurn;

                    this.onMyTurn.Invoke(this.player);
                }

                //ReadText(data.generatedText);

            } catch(error) {
                // If an error occurs, log it and update loading element
                console.error("Error fetching update: ", error);
            }
        }
    }

    UpdatePlayerList(playerList)
    {
        this.playerList = playerList;

        console.log(this.playerList);

        for(var i = 0; i < this.playerList.players.length; i++)
        {
            this.playerList.players[i].isMe = (this.playerList.players[i].clientID == this.player.clientID)
        }

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

    async TryJoinHearing(playerData)
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