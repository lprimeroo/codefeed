# Codefeed

Codefeed is a source code judge that can be used for programming competitions, recruitement , etc .
It is enclosed in a Docker Ubuntu Sandbox that enables it to compile the user submitted code within itself instead
of using an external API .

## Installation 
 First clone the repository ,
 ```
 git clone https://github.com/saru95/codefeed
 ```
 Navigate to the `Setup` folder . It contains `Dockerfile` , which consists of the Sandbox dependencies . Run the Dockerfile 
 as you like or just execute ,
 ```
 ./UpdateDocker.sh
 ```
 It will create a Docker image with the name `virtual_machine_codefeed` which should be over 1GB in size .
 
 For the next step, navigate to `config/database.js` and replace the existing DB URL with your cloud hosted URL . 
* MongoDB is used here . 

