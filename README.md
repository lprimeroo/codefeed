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

Next , you need to install the project dependencies . Navigate to the root folder and run ,
```
sudo npm install .
```
Run,
```
node server
```
to launch the website .

Some words of caution ,
* Make sure you have stable internet connection while setting up the Dockerfile .
* Make sure your `vm_name ` in the file `server.js` matches with the Docker image name .
* If your code doesn't compile and return the result , there's a 90% chance that you have a slow internet connection . To tackle that, increase the `timeout_value` in `server.js` .
* For Linux distro users , replace `gtimeout` in `DockerTimeout.sh` with `timeout` . `gtimeout` is only supported for OSX platform .
* Do not touch the `Payload` folder while setting up .


## Features

* Supports `Python`, `Ruby`, `C++`, `C` and `Java` .
* Rankings of users .
* Ability for the user to add problems .
* Detecting redundant submissions .
* Facebook login .
* View all solved problems .
* Profiles .

P.s : Still has a lot of room for improvements .


## Notes

* To add more languages, fiddle with `compilers.js` and add its dependency to `Dockerfile` and update the image .
* To play around with the website UI, use templates in the `view`folder .
* To play around with the existing schema or FB authentication , checkout `config` folder .


##Authors
[Sarthak Munshi](https://github.com/saru95)

[Shivani Singh](https://github.com/shivani258)

## A later stage P.S.
We wrote this when we were in our sophomore year . Hence, the scarcity of tests , style guide and modularity . This project works just fine but isn't maintained anymmore as it was done as a learning project .

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)