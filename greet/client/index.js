const grpc = require("@grpc/grpc-js");
const fs = require("fs");
const { GreetServiceClient } = require("../proto/greet_grpc_pb");
const { GreetRequest } = require("../proto/greet_pb");

function doGreet(client) {
  console.log("doGreet was invoked");

  const req = new GreetRequest().setFirstName("Hooray");
  console.log(req);

  client.greet(req, (err, res) => {
    if (err) {
      return console.log(err);
    }
    console.log(res);
    console.log(`Greet: ${res.getResult()}`);
  });
}

function doGreetManyTimes(client) {
  console.log("doGreetManyTimes was invoked");

  const req = new GreetRequest().setFirstName("Abobus");
  const call = client.greetManyTimes(req);

  call.on("data", (res) => {
    console.log(`GreetManyTimes: ${res.getResult()}`);
  });
}

function doLongGreet(client) {
  console.log("doLongGreet was invoked");

  const names = ["Audi", "BMW", "LANOS WROOM_WROOM"];
  const call = client.longGreet((err, res) => {
    if (err) {
      return console.log(err);
    }

    console.log(`LongGreet: ${res.getResult()}`);
  });

  names
    .map((name) => {
      return new GreetRequest().setFirstName(name);
    })
    .forEach((req) => call.write(req));
  call.end();
}

function doGreetEveryone(client) {
  console.log("doGreetEveryone was invoked");

  const names = ["Audi", "BMW", "LANOS WROOM_WROOM"];
  const call = client.greetEveryone();

  call.on("data", (res) => {
    console.log(`GreetEveryone: ${res.getResult()}`);
  });

  names
    .map((name) => {
      return new GreetRequest().setFirstName(name);
    })
    .forEach((req) => call.write(req));
  call.end();
}

function doGreetWithDeadline(client, ms) {
  console.log("doGreetWithDeadline was invoked");

  const req = new GreetRequest().setFirstName("Ahhoy");

  client.greetWithDeadline(
    req,
    {
      deadline: new Date(Date.now() + ms),
    },
    (err, res) => {
      if (err) {
        return console.log(err);
      }

      console.log(`GreetWithDeadline: ${res.getResult()}`);
    }
  );
}

function main() {
  const tsl = false;
  let creds;

  if (tsl) {
    const rootCert = fs.readFileSync("./ssl/ca.crt");
    creds = grpc.ChannelCredentials.createSsl(rootCert);
  } else {
    creds = grpc.ChannelCredentials.createInsecure();
  }
  const client = new GreetServiceClient("localhost:50051", creds);

  doGreet(client);
  // doGreetManyTimes(client);
  // doLongGreet(client);
  // doGreetEveryone(client);
  // doGreetWithDeadline(client, 5000);
  client.close();
}

main();
