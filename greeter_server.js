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

