# JudgeGPT-Node
Convince the ai judge you are innocent. You and another player fight it out in the court room to see who wins the case. The Judge decides your fate!

Efficient and succinct justice with all the bias and inaccuracy of ai.

## Setup 
Server Setup

AWS Lightsail NodeJS<br />
Replace the ``/opt/bitnami/apache/conf/bitnami/bitnami-ssl.conf``<br />
``sudo /opt/bitnami/ctlscript.sh restart apache``<br />
<br />
````npm install -g pm2````<br />
``npm installc cors``<br />
``npm install express``<br />
``npm install axios``<br />
``npm install elevenlabs-node``<br />
``npm install play-sound``<br />
``npm install dotenv``//cant tell if I am using this<br /> 
Put evnionment variables into ``env.js``
Looking like this
```const ENV = {};
ENV.TNL_API_KEY = 'XXXX';
ENV.OPENAI_API_KEY = 'XXXX';

module.exports = ENV;
```

Public Client Setup
``npm i bootstrap@5.3.0``<br />

## Run
Move into the server folder.
Run ``pm2 start ecosystem.config.js``


## Update

### V2 July 24, 23
Latest version of JudgeGPT is looking great!

Now runs as a single session, that is networked mutliplayer using sockets. So everyone will be connected to the same live-case, and be able to join and participate as it comes up with new cases.

UI has been improved a lot, and has better mobile support.

### V1 — 07/17/2023 1:11 PM
Its come a long way in the last day, now has random graphics, improved UI for each game, and an analysis mode!

### V0  — 07/16/2023 1:43 PM
So I am working on this game called JudgeGPT. 

Its a game based in a futuristic small claims court room, where ai has replaced the lawyers & judges in the legal system. You and another player fight it out in the court room to see who wins the case.

It is early stages, proof of concept prototype. What do you think?
I am looking for feedback on what the UI could look like. I was originally thinking a simple chatbot, but I want to make it more legally / court-y. Any thoughts? What does a the future of virtual court rooms look like?

~~http://3.24.141.2/JudgeGPT/~~
https://brennan.games/JudgeGPT/

Notes
So far its only 2 player 
