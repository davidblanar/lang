const fs = require("fs");
const path = require("path");
const ReadStream = require("./ReadStream");
const Tokenizer = require("./Tokenizer");
const Parser = require("./Parser");
const { Env, evalUnderEnv } = require("./Env");

const args = process.argv;
if (args.length !== 3) {
	throw new Error("Usage: node src/script.js <file_path>");
}

const filePath = args[args.length - 1];
const input = fs.readFileSync(path.resolve(__dirname, filePath)).toString();

const readStream = new ReadStream(input);
const tokenizer = new Tokenizer(readStream);
const tokens = tokenizer.generateTokens().getTokens();
const parser = new Parser(tokens);
const ast = parser.parse().getAst();

// setup global env
const env = new Env();
env.add("print", console.log);
env.add("to_str", function (val) {
	return val.toString();
});
env.add("str_concat", function (a, b) {
	if (typeof a !== "string" || typeof b !== "string") {
		throw new Error(
			`Cannot apply str_concat to operands of type ${typeof a} and ${typeof b}`
		);
	}
	return a + b;
});
env.add("throw_error", function (e) {
	throw new Error(e);
});
env.add("read_file", function (filePath) {
	// TODO fix "files/" - make it dynamic
	return fs
		.readFileSync(path.resolve(__dirname, "files/", filePath))
		.toString();
});
env.add("write_file", function (filePath, data) {
	// TODO fix "files/" - make it dynamic
	return fs.writeFileSync(path.resolve(__dirname, "files/", filePath), data);
});

evalUnderEnv(ast, env);
