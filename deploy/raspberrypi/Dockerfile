FROM resin/raspberrypi-node:latest

RUN sudo apt-get update && \
    sudo apt-get install unzip

ADD gpio-admin /usr/local/bin/gpio-admin
ADD https://github.com/HackerLoop/rotonde-gpio/archive/master.zip /tmp
RUN unzip /tmp/master.zip -d /usr/local/ && mv /usr/local/rotonde-gpio-master /usr/local/rotonde-gpio

WORKDIR "/usr/local/rotonde-gpio/"

RUN npm install

RUN sudo apt-get autoremove -y unzip && sudo apt-get purge

CMD ["/usr/local/bin/node", "index.js"]
