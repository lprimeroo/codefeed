
FROM chug/ubuntu14.04x64 
MAINTAINER SARTHAK MUNSHI

# Update the repository sources list

RUN echo "deb http://archive.ubuntu.com/ubuntu trusty main universe" > /etc/apt/sources.list
RUN apt-get update



# Install all the languages/compilers we are supporting

RUN apt-get install -y gcc
RUN apt-get install -y g++
RUN apt-get install -y ruby
RUN apt-get install -y python
RUN apt-get install -y nodejs 
RUN apt-get install -y npm
RUN apt-get install -y git
RUN npm install -g underscore request express jade shelljs passport http sys jquery lodash async mocha moment connect validator restify ejs ws co when helmet wrench brain mustache should backbone forever  debug && export NODE_PATH=/usr/local/lib/node_modules/

#prepare for Java download

RUN apt-get install -y python-software-properties
RUN apt-get install -y software-properties-common



# grab oracle java (auto accept licence)

RUN add-apt-repository -y ppa:webupd8team/java
RUN apt-get update
RUN echo oracle-java7-installer shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections
RUN apt-get install -y oracle-java7-installer

RUN apt-get install -y mysql-server
RUN apt-get install -y sudo
RUN apt-get install -y bc

RUN echo "mysql ALL = NOPASSWD: /usr/sbin/service mysql start" | cat >> /etc/sudoers

