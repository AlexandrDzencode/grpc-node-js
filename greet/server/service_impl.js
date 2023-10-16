const pb = require("../proto/greet_pb");

exports.greet = (call, callback) => {
  console.log("Greet was invoked");
  const res = new pb.GreetResponse().setResult(
    `Hello ${call.request.getFirstName()}`
  );

  callback(null, res);
};

exports.greetManyTimes = (call, _) => {
  console.log("GreetManyTimes was invoked");
  const res = new pb.GreetResponse();

  for (let i = 0; i < 10; i++) {
    res.setResult(`Hello ${call.request.getFirstName()} - number ${i + 1}`);
    call.write(res);
  }

  call.end();
};

exports.longGreet = (call, callback) => {
  console.log("LognGreet was invoked");
  let greet = "";

  call.on("data", (req) => {
    greet += `Hello ${req.getFirstName()}\n`;
  });

  call.on("end", () => {
    const res = new pb.GreetResponse().setResult(greet);

    callback(null, res);
  });
};
