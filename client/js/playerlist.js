class PlayerList
{
    constructor(audienceDiv, playerListDiv)
    {
        this.audienceDiv = audienceDiv;
        this.playerListDiv = playerListDiv;

        this.toolTips = {};//A dictionary for all tooltips, 
        //this may need to be reset better in the future
        //-- perhaps just keep a reference to the currently active tooltip, 
        //only one should be active at anytime anyway
    }

    CreateAudience(audienceList)
    {
        this.audienceDiv.innerHTML = "";
        //console.log(audienceList);
        var audeinceHeader = document.createElement('h5');
        audeinceHeader.innerText = "Audience: " + audienceList.length;
        this.audienceDiv.appendChild(audeinceHeader); 


        /*var audienceIcons = document.createElement('div');

        for (var key in audienceList) {

            if (audienceList.hasOwnProperty(key)) {
                this.audienceIcons.appendChild(this.CreatePlayerListMember(playerList[key]));//make smaller
            }
        }*/

    }

    RefreshToolTip(div, id)
    {
        var showing = false;

        //check if this existed previously
        if(this.toolTips[id] != null)
        {
            //check if this is showing
            showing = this.toolTips[id]._active;

            /*if(showing)
                this.toolTips[id].hide();*/

            //remove the old one
            this.toolTips[id].dispose();
        }

        // If you are using Bootstrap 5 without jQuery:
        this.toolTips[id] = new bootstrap.Tooltip(div);

        //re-enable the tooltip if currently in use
        if(showing)
        {
            this.toolTips[id].show();
        }
    }

    FullPlayerList(playerList)
    {
        
        // Set tooltip the attributes
        this.audienceDiv.dataset.toggle = "tooltip";
        this.audienceDiv.dataset.html = "true";


        var output = "";
        for(var i = 0; i < playerList.length; i++)
        {
            output += playerList[i].name + " " + playerList[i].clientID + "\n";
        }

        if(playerList != null)
        this.audienceDiv.title = output;
        //    this.audienceDiv.setAttribute("title", );//JSON.stringify(playerList, null, 2));

        this.RefreshToolTip(this.audienceDiv, "audienceDiv");

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

            if (playerList.hasOwnProperty(key)/* && playerList[key].clientID != ""*/) {
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
        nameDiv.style = "font-size:10px";
        nameDiv.innerText = playerMember.name;


        var center = document.createElement('center');
        //center.classList.add("card-body");
        center.style = "margin:5px;";
        center.appendChild(profileImg);
        center.appendChild(roleDiv);
        center.appendChild(nameDiv);

        var card = document.createElement('div');
        card.classList.add("card");

        // Set tooltip the attributes
        card.dataset.toggle = "tooltip";
        card.dataset.html = "true";
        card.title = playerMember.clientID;

        var id = playerMember.clientID;

        card.appendChild(center);

        if(id == "ai")
        {
           id = "ai " + playerMember.name;
           card.classList.add("bg-secondary");
           card.classList.add("text-white");
        }else if(playerMember.isMe)
        {
            card.classList.add("text-white");
            card.classList.add("bg-info");

            var you = document.createElement('center');
            you.style="font-size:10px";

            if(playerMember.myTurn)
                you.innerText = "Your Turn";
            else
                you.innerText = "You";

            
            var cardHeader = document.createElement("center");
            cardHeader.classList.add("card-header");
            cardHeader.style="padding:0";
            cardHeader.appendChild(you);
            card.appendChild(cardHeader);
        }

        card.classList.add("border");
        card.classList.add("border-5");
        if(playerMember.myTurn)
        {
            card.classList.add("border-dark");
        }else
            card.classList.add("border-transparent");


        this.RefreshToolTip(card, id);
        card.style = "margin:3px";


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