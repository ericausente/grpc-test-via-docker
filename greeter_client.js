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

