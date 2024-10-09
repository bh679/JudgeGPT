# JudgeGPT
<a href="https://brennan.games/JudgeGPT/">Play at ``brennan.games/JudgeGPT``</a><br />

JudgeGPT, the game where ai decides you or your friends fate in courtroom. 
It also decides well as what you are been accused of. 
You each have one chance to prove your innocence. 
Convince the ai judge you are innocent. 
Efficient and succinct justice with all the bias and inaccuracy of ai.
Who is better at convincing the Judge they are innocent?

## Setup 
### Server Setup

AWS Lightsail NodeJS<br />
#### Setup Security
IPv4 Firewall: Custom	TCP	3000 Any IPv4 address<br />
IPv6 firewall: Custom	TCP	3000 Any IPv6 address<br />

### Installing Requirements 

Replace the ``/opt/bitnami/apache/conf/bitnami/bitnami-ssl.conf``<br />
``sudo /opt/bitnami/ctlscript.sh restart apache``<br />
<br />
````npm install -g pm2````<br />
``npm installc cors``<br />
``npm install express``<br />
``npm install axios``<br />
``npm install elevenlabs-node``<br />
``npm install play-sound``<br />
``npm install sqlite3``<br />
``npm install dotenv``//cant tell if I am using this<br /> 
``npm install multer``
``npm install form-data``
Put evnionment variables into ``env.js``
Looking like this
```const ENV = {};
ENV.TNL_API_KEY = 'XXXX';
ENV.OPENAI_API_KEY = 'XXXX';
ENV.ELEVENLABS_API_KEY = 'XXXX';

module.exports = ENV;
```

Public Client Setup
``npm i bootstrap@5.3.0``<br />

## Run
Move into the server folder.
Run ``pm2 start ecosystem.config.js``
Check status ``pm2 status``
Check log ``pm2 log``

## Update

### V8 Oct 9, 24
Case Archives Update
 - Searchable Case Archives
 - Cases saved to database
 - Saerch Filter (stage of completion, humans involved)
<img width="1359" alt="Screenshot 2024-10-09 at 7 32 50 pm" src="https://github.com/user-attachments/assets/1d7d5498-0983-447d-b669-d5ae2ec72be4">
<img width="634" alt="Screenshot 2024-10-09 at 7 32 26 pm" src="https://github.com/user-attachments/assets/82e1a340-c1aa-41f7-be3c-4354a75eb643">

### V7 Oct 2, 24
Chatroom now has better css, <br />
Chatroom logs when people join the game.<br />
Added footger back to game<br />
<img width="1278" alt="Screenshot 2024-10-02 at 12 52 10 pm" src="https://github.com/user-attachments/assets/40b8e930-29a2-4fb8-9c29-cb14e290a73e">


### V6 Oct 2, 24
Change footer to heading<br />
Made cleaner, less links<br />
Added about page, with links from preivous footer<br />
Added about details<br />
<img width="1335" alt="Screenshot 2024-10-02 at 12 14 54 pm" src="https://github.com/user-attachments/assets/72f2ea5f-0963-4950-8ba2-16472ec0b701">

### V5 Oct 1, 24
Music hasbeen added (by Dale)
Volume controls, and set default leveling of volume
Live chat for people not playing (and current players)
Restored the most recent version that has a chatroom for spectators
Shorter conclusions 
Fixed a lot of bugs.
Ohhh.. and the game is live again after 6 months of being down.
<img width="1422" alt="Screenshot 2024-10-01 at 11 11 50 pm" src="https://github.com/user-attachments/assets/858e4079-ac3f-4d6c-85dc-b2e87f8540d0">


### V4 Aug 6, 23
JudgeGPT is now voiced by ai, and live at https://brennan.games/JudgeGPT👩‍⚖️🧑‍⚖️👨‍⚖️
V4 now has the option to turn on voices! They are fantastic,  hilarious an shockingly human for ai generated voices. Make sure you turn it on first thing when loading up the game.
The game exists as a single multiplayer courtroom. Join in on the action, or watch the current hearing and wait your turn to be served justice!
Whiles it’s v4, it’s still buggy. If it gets stuck, there is a restart server button at the bottom! 😅
[![Watch the video](https://img.youtube.com/vi/Jq2GZEuAnx4/maxresdefault.jpg)](https://www.youtube.com/watch?v=Jq2GZEuAnx4)

#### V4.00.01
New look!
![Screenshot 2023-08-06 at 11 29 35 pm](https://github.com/bh679/JudgeGPT/assets/2542558/797498d0-bbf0-4060-87cc-13b623da904f)
![Screenshot 2023-08-06 at 11 29 29 pm](https://github.com/bh679/JudgeGPT/assets/2542558/5bc7ad53-da88-4ad6-beb9-398512c89627)


### V3 July 29, 23
JudgeGPT, the game where ai decides you or your friends fate in courtroom. 
It also decides well as what you are been accused of. 
You each have one chance to prove your innocence. 
Convince the ai judge you are innocent. 
Efficient and succinct justice with all the bias and inaccuracy of ai.
Who is better at convincing the Judge they are innocent?
Note: Game is still in development. There is only one courtroom, so if you aren't in the hearing you are in the audience. If it seems stuck, there is a restart button at the bottom. 
![image](https://github.com/bh679/JudgeGPT/assets/2542558/c6cc44ad-0fbb-467b-8675-2707bf52d5dc)
![image](https://github.com/bh679/JudgeGPT/assets/2542558/46f70cea-d8c4-4e4d-9108-60c1fecd3699)


### V2 July 24, 23
Latest version of JudgeGPT is looking great!

Now runs as a single session, that is networked mutliplayer using sockets. So everyone will be connected to the same live-case, and be able to join and participate as it comes up with new cases.

UI has been improved a lot, and has better mobile support.
![image](https://github.com/bh679/JudgeGPT/assets/2542558/306a5d75-6059-4788-9964-9d73a1944dee)


### V1 — 07/17/2023 1:11 PM
Its come a long way in the last day, now has random graphics, improved UI for each game, and an analysis mode!
![image](https://github.com/bh679/JudgeGPT/assets/2542558/317e7c29-f3f6-4339-b542-5b95b8f44644)

### V0  — 07/16/2023 1:43 PM
So I am working on this game called JudgeGPT. 

Its a game based in a futuristic small claims court room, where ai has replaced the lawyers & judges in the legal system. You and another player fight it out in the court room to see who wins the case.

It is early stages, proof of concept prototype. What do you think?
I am looking for feedback on what the UI could look like. I was originally thinking a simple chatbot, but I want to make it more legally / court-y. Any thoughts? What does a the future of virtual court rooms look like?

~~http://3.24.141.2/JudgeGPT/~~
https://brennan.games/JudgeGPT/

Notes
So far its only 2 player 
![image](https://github.com/bh679/JudgeGPT/assets/2542558/c8b25c85-067a-48c1-86b8-ad05154fe6ca)

