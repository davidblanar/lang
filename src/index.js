const fs = require("fs");
const path = require("path");
const ReadStream = require("./ReadStream");
const Tokenizer = require("./Tokenizer");
const Parser = require("./Parser");

const input = fs.readFileSync(path.resolve(__dirname, "./file.l")).toString();
console.log(input);
const readStream = new ReadStream(input);
const tokenizer = new Tokenizer(readStream);
const tokens = tokenizer.generateTokens().getTokens();
console.log(tokens);
const parser = new Parser(tokens);
console.log(parser.parse().getAst());
