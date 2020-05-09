const fs = require("fs");
const path = require("path");
const ReadStream = require("./ReadStream");
const Tokenizer = require("./Tokenizer");

const input = fs.readFileSync(path.resolve(__dirname, "./file.l")).toString();
console.log(input)
const readStream = new ReadStream(input);
const tokenizer = new Tokenizer(readStream);
tokenizer.getTokens();
