FROM node:10.19.0-stretch
MAINTAINER gerardo.v.flores@gmail.com
RUN git clone https://github.com/gerardofb/front-edgewaters.git
WORKDIR front-edgewaters/chat-stockquotes
RUN git checkout colasmensajes
RUN npm install 
EXPOSE 3000
