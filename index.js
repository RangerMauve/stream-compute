var xtend = require("xtend");
var stream = require("readable-stream");
var Writable = stream.Writable;
var Readable = stream.Readable;
var noop = require("no-op");
var par = require("par");

module.exports = create;

function create(inputs, fn) {
	var input = {};
	var output = make_output();
	var data = {};

	wire_inputs();

	return {
		input: input,
		output: output
	};

	function handle_new(name, chunk, enc, cb) {
		data[name] = chunk;
		var should_compute = has_all();
		if (should_compute) process();
		cb();
		return should_compute;
	}

	function process() {
		fn(data, on_result);
	}

	function on_result(err, data) {
		if (err) return output.emit("error", err);
		output.push(xtend(data));
	}

	function wire_inputs() {
		inputs.forEach(wire_input);
	}

	function wire_input(name) {
		input[name] = make_input(par(handle_new, name));
	}

	function has_all() {
		return inputs.every(has);
	}

	function has(name) {
		return name in data;
	}
}

function make_input(fn) {
	var stream = new Writable({
		objectMode: true
	});

	stream._write = fn;

	return stream;
}

function make_output() {
	var stream = new Readable({
		objectMode: true
	});

	stream._read = noop;

	return stream;
}
