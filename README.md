# grpc-test-via-docker

Install Docker: If you don't already have Docker installed on your machine, download and install Docker for your operating system.

Create a gRPC service: For this example, we'll create a simple gRPC service using Node.js and the grpc package. Create a new directory for your project and create a file named greeter.proto with the following contents:

```
syntax = "proto3";

package grpc.lab;

service Greeter {
  rpc SayHello (HelloRequest) returns (HelloReply) {}
}

message HelloRequest {
  string name = 1;
}

message HelloReply {
  string message = 1;
}

Next, create a file named greeter_server.js with the following contents:

```
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(
  'greeter.proto',
  { keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });

const greeterProto = grpc.loadPackageDefinition(packageDefinition).grpc.lab;

function sayHello(call, callback) {
  callback(null, { message: 'Hello ' + call.request.name });
}

function main() {
  const server = new grpc.Server();
  server.addService(greeterProto.Greeter.service, { sayHello: sayHello });
  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
  server.start();
}

main();
```

This creates a gRPC service that responds to SayHello requests with a greeting that includes the name sent in the request.

    Write a gRPC client: Create a file named greeter_client.js with the following contents:

```
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(
  'greeter.proto',
  { keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });

const greeterProto = grpc.loadPackageDefinition(packageDefinition).grpc.lab;

const client = new greeterProto.Greeter('localhost:50051',
                                       grpc.credentials.createInsecure());

function main() {
  const name = process.argv.length >= 3 ? process.argv[2] : 'World';

  client.sayHello({ name: name }, function(err, response) {
    console.log('Greeting:', response.message);
  });
}

main();
```

This creates a gRPC client that sends a SayHello request to the gRPC service, passing in the name to greet as a command-line argument.

    Create a Dockerfile: Create a file named Dockerfile with the following contents:

```
FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install @grpc/proto-loader

COPY . .

EXPOSE 50051

CMD [ "node", "greeter_server.js" ]

```

This Dockerfile sets up a Node.js environment, copies the project files into the container, and exposes port 50051 for the gRPC service.

    Build the Docker image: Open a terminal in the project directory and run the following command to build the Docker image:

docker build -t grpc-lab .

This builds a Docker image named grpc-lab using the Dockerfile in the current directory.



    Start the Docker container: Run the following command to start the Docker container from the grpc-lab image:

css

docker run -p 50051:50051 -d --name grpc-server grpc-lab

This starts the gRPC server in the background and maps the exposed port 50051 to port 50051 on your host machine. The -d flag runs the container in detached mode, so you can continue using the terminal.

    Test the gRPC client: Open a new terminal window and run the following command to test the gRPC client:

lua

docker run --network host grpc-lab node greeter_client.js Alice

This runs the gRPC client in a separate Docker container, passing in Alice as the name to greet. The --network host flag allows the client container to communicate with the gRPC server running on the host machine. The gRPC client sends a SayHello request to the gRPC server and displays the response.

You should see the following output:

makefile

Greeting: Hello Alice

This confirms that the gRPC server and client are communicating successfully.

Note that you can also test the gRPC server using a gRPC client like grpcurl or bloomrpc. If you prefer to use a GUI-based client like BloomRPC, you can install it on your host machine and configure it to use the gRPC server running in the Docker container by setting the target address to localhost:50051.
