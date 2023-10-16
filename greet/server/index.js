const grpc = require("@grpc/grpc-js");
const serviceImpl = require("./service_impl");
const { GreetServiceService } = require("../proto/greet_grpc_pb");

const URL = "localhost:50051";

const cleanup = (server) => {
  console.log("Cleanup");

  if (server) {
    server.forceShutdown();
  }
};

const main = () => {
  const server = new grpc.Server();
  const creds = grpc.ServerCredentials.createInsecure();

  process.on("SIGINT", () => {
    console.log("Caught interrupt signal");
    cleanup(server);
  });

  server.addService(GreetServiceService, serviceImpl);
  server.bindAsync(URL, creds, (err, _) => {
    if (err) {
      console.log(err);
      return cleanup(server);
    }

    server.start();
  });

  console.log(`Listening on: ${URL}`);
};

main();
