#Use ubuntu as base
FROM ubuntu

#update 
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update

#Install npm
RUN apt-get install npm -y

#Install nodemon 
RUN npm i nodemon -g

#Copy everything inside app directory
COPY . /app

#Install dependencies in server
WORKDIR /app/server
RUN npm i

#Expose port to the world
EXPOSE 3000

#start
CMD ["npm", "start"]
