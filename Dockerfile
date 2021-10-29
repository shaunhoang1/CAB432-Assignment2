#Use ubuntu as base
FROM node:14-alpine

#Copy everything inside app directory
COPY /client/build /client/build
COPY /server /server
#Install dependencies in server
WORKDIR /server
RUN npm i

#Expose port to the world
EXPOSE 3000

#start
CMD ["npm", "start"]
