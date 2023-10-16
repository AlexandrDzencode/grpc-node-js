const grpc = require("@grpc/grpc-js");
const { CalculatorServiceClient } = require("../proto/calculator_grpc_pb");
const { SumRequest } = require("../proto/sum_pb");
const { PrimeRequest } = require("../proto/primes_pb");
const { AvgRequest } = require("../proto/avg_pb");

function doSum(client) {
  console.log("doSum was invoked");

  const req = new SumRequest().setFirstNumber(10).setSecondNumber(20);

  client.sum(req, (err, res) => {
    if (err) {
      return console.log(err);
    }
    console.log(res);
    console.log(`Sum is: ${res.getResult()}`);
  });
}

function doPrimes(client) {
  console.log("doPrimes was invoked");

  const req = new PrimeRequest().setNumber(1238901572);
  console.log(req);

  const call = client.primes(req);

  call.on("data", (res) => {
    console.log(`Primes: ${res.getResult()}`);
  });
}

function doAvg(client) {
  console.log("doAvg was invoked");

  const numbers = [...Array(11).keys()].slice(1);
  const call = client.avg((err, res) => {
    if (err) {
      console.log(err);
    }

    console.log(`Avg: ${res.getResult()}`);
  });

  numbers
    .map((number) => {
      return new AvgRequest().setNumber(number);
    })
    .forEach((req) => call.write(req));

  call.end();
}

function main() {
  const creds = grpc.ChannelCredentials.createInsecure();
  const client = new CalculatorServiceClient("localhost:50051", creds);

  // doSum(client);
  // doPrimes(client);
  doAvg(client);
  client.close();
}

main();
