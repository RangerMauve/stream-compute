# stream-compute
Combines several streams of events, and computes a value every time one changes

## Install

```
npm install --save stream-compute
```

## API

### `streamCompute(inputs, compute(data,cb))`

 - `inputs` is an array of strings that are the names of the dependencies for this computation
 - `compute(data, cb)` is the function used for performing the computation.
	- `data` An object that contains keys that correspond to the `inputs` array that was passed in. The keys contain the last known value of that dependency. Computing only starts once all inputs have sent at least one value.
	- `cb(err, result)` is the callback which should be called after the computation has finished

The function returns an object that contains the following keys:

- `input` which is a map of Writable streams which are populated by the list of `inputs`
- `output` a Readable stream which has the results of computations

## Example

``` javascript
var streamArray = require("stream-array");
var intervalStream = require("interval-stream");
var stdout = require("stdout");

var streamCompute = require("stream-compute");

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

```
