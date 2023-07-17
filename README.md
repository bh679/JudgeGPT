# JudgeGPT-Node

## Setup 
Server Setup
````npm install -g pm2````<br />
``npm installc cors``<br />
``npm install express``<br />
``npm install axios``<br />
``npm install elevenlabs-node``<br />
``npm install play-sound``<br />
``npm install dotenv``//cant tell if I am using this<br /> 
Put evnionment variables into ``/opt/bitnami/scripts/bitnami-env.sh``
``export TNL_API_KEY=XXXXXXXXXXXXXXX``
``sudo /opt/bitnami/ctlscript.sh restart``


Public Client Setup
``npm i bootstrap@5.3.0``<br />

## Run
Move into the server folder.
Run ``pm2 start ecosystem.config.js``
