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
        if(this.messages.length == messages.length)
            return;

        this.messages = messages;

        this.chatDiv.innerHTML = '';

        for(var i = 0; i < messages.length; i++)
        {
            var consecutive = (i >= 1 && messages[i-1].sender.role == messages[i].sender.role);

            this.messagesDivs[i] = new ChatLineUI(messages[i], (i % 2 == 0), consecutive);

            this.chatDiv.appendChild(this.messagesDivs[i].groupDiv);
        }

        if(this.messages.length <= 7)
            SpeakMessage(messages[messages.length-1]);
    }

    AddMessage(sender, message)
    {
        var newMessage = {};
        newMessage.sender = sender;
        newMessage.message = message;

        this.messages[this.messages.length] = newMessage;

        this.UpdateChat(this.messages);
    }
}

var speaking = false;
var queue = []; // create a queue to store the messages

function SpeakMessage(message)
{
    queue.push(message); // add new messages to the queue
    
    // if not currently speaking, start speaking
    if (!speaking)
        processNextMessage();
}

function processNextMessage() 
{
    if (queue.length === 0) 
    {
        return; // no messages to process
    }

    // get the first message from the queue
    let currentMessage = queue.shift();
    
    speaking = true;
    Speak(currentMessage.message, currentMessage.sender.voiceId, FinishedSpeaking);
}

function FinishedSpeaking()
{
    speaking = false;
    
    // if there are still messages in the queue, speak the next message
    if (queue.length > 0)
        processNextMessage();
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
