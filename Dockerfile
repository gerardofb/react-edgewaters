FROM node:10.19.0-stretch
MAINTAINER gerardo.v.flores@gmail.com
RUN git clone https://github.com/gerardofb/react-edgewaters.git
WORKDIR react-edgewaters
RUN npm install 
EXPOSE 3000
