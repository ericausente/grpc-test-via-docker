FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install 
RUN npm install @grpc/proto-loader

COPY . .

EXPOSE 50051

CMD [ "node", "greeter_server.js" ]
