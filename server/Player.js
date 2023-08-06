class Player {
    constructor(name, role, clientID) {
        this.name = name;
        this.role = role;
        this.testimony = null;
        this.typing="";
        this.class = role.toLowerCase();
        this.score;
        this.clientID = clientID;
        this.profileUrl = "";
        this.lastHeard = Date.now();
        this.timeLeft = 60;
        this.connected = true;
        this.voiceId = RandomLines.GetRandomVoiceID();

        if(role == "Judge")
            this.voiceId = '21m00Tcm4TlvDq8ikWAM';

    }

    Reset()
    {
        this.testimony = null;
        this.typing = null;
        this.score = null;
        this.timeLeft = 60;
    }

    SetRole(role)
    {
        this.role = role;
        this.class = role.toLowerCase();
    }
}


module.exports = Player;