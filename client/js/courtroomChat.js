class MessageUI
{
    constructor(chatDiv) {
        this.chatDiv = chatDiv;

        this.messagesDivs = {};
        this.messages = [];

        this.UpdateChat = this.UpdateChat.bind(this);
    }

    UpdateChat(messages, force)
    {
        if(this.messages.length == messages.length && force != true)
            return;

        this.messages = messages;

        this.chatDiv.innerHTML = '';

        for(var i = 0; i < messages.length; i++)
        {
            var consecutive = (i >= 1 && messages[i-1].sender.role == messages[i].sender.role);

            this.messagesDivs[i] = new ChatLineUI(messages[i], (i % 2 == 0), consecutive);

            this.chatDiv.appendChild(this.messagesDivs[i].groupDiv);
        }

        if(this.messages.length <= 8)
            SpeakMessage(this.messages[this.messages.length-1]);
    }

    AddMessage(sender, message)
    {
        var newMessage = {};
        newMessage.sender = sender;
        newMessage.message = message;

        this.messages[this.messages.length] = newMessage;

        this.UpdateChat(this.messages, true);
    }

    async ToggleVoices(toggleOn)
    {
        await buttonPressHandler();

        if(toggleOn)
        {
            speechManager.ResumeSpeaking();

            if(this.messages.length <= 8)
            {
                if(this.messages.length > 1)
                    await SpeakMessage(this.messages[this.messages.length-2]);
                
                await SpeakMessage(this.messages[this.messages.length-1]);
            }
            else
                SpeakMessage(this.messages[7]);

        }
        else
            speechManager.StopSpeaking();
        
    }
}

async function SpeakMessage(message)
{
    return await speechManager.Speak(message.message, message.sender.voiceId);
}


class ChatLineUI
{
    constructor(message, alt, consecutive) {

        this.message = message;

        this.groupDiv = document.createElement('div');
        this.groupDiv.classList.add("message");
        this.groupDiv.classList.add("row");


        this.messageNameGroup = document.createElement('div');
        this.messageNameGroup.classList.add("col");

        this.messageContentsDiv = document.createElement('div');
        this.messageContentsDiv.classList.add("messageContents");

        this.messageNameGroup.appendChild(this.messageContentsDiv);

        if(alt)
           this.messageContentsDiv.classList.add("alt");

        if(this.message.sender.class != null && this.message.sender.class != "")
        {
            this.groupDiv.classList.add(this.message.sender.class);
            this.messageContentsDiv.classList.add(this.message.sender.class);
        }

        this.senderIconDiv = document.createElement('div');
        this.senderIconDiv.classList.add("col-1");
        this.senderIconDiv.classList.add("col-xxs-2");

        this.senderIconDiv.classList.add("sender");
        if(!consecutive)
        {
            this.profileImg = document.createElement('img');
            this.profileImg.classList.add("rounded-circle");
            this.profileImg.classList.add("profilePicture");
            this.profileImg.style = "";
            this.profileImg.src = this.message.sender.profileUrl;
            this.senderIconDiv.appendChild(this.profileImg);

            this.senderNameDiv = document.createElement('div');
            //this.senderNameDiv.classList.add("row");
            this.senderNameDiv.innerText = this.message.sender.role + " "+ this.message.sender.name+": ";
            this.senderNameDiv.style = "";
            this.senderNameDiv.classList.add("senderName");
            this.senderNameDiv.classList.add("rounded-top");

            this.messageNameGroup.insertBefore(this.senderNameDiv, this.messageNameGroup.firstChild);
            
            this.messageContentsDiv.classList.add("rounded-but-top-left");

        }else
        this.messageContentsDiv.classList.add("rounded-3");


        this.messageContentsDiv.innerHTML += this.message.message;

        this.groupDiv.appendChild(this.senderIconDiv);
        this.groupDiv.appendChild(this.messageNameGroup);
    }

    GetDiv()
    {
        return this.groupDiv;
    }
}
