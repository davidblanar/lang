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

const env = new Env();
// setup global env
env.add("print", console.log);
evalUnderEnv(ast, env);
