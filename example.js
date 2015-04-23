var streamArray = require("stream-array");
var intervalStream = require("interval-stream");
var stdout = require("stdout");

var streamCompute = require("./");

var greeter = make_greeter();

var messages = streamArray(["Hello", "What's up", "Greetz"]);
var names = streamArray(["Alice", "Bob", "Eve"]);

greeter.output.pipe(stdout("Output:"));

messages.pipe(intervalStream(200)).pipe(greeter.input.message);
names.pipe(intervalStream(300)).pipe(greeter.input.name);

function make_greeter() {
	return streamCompute(["message", "name"], function(data, cb) {
		var name = data.name;
		var message = data.message;
		var result = {
			message: "Hey, " + name + ": " + message
		};
		cb(null, result);
	});
}
