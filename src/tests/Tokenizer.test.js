const ReadStream = require("../ReadStream");
const Tokenizer = require("../Tokenizer");
const { TOKEN_TYPES } = require("../const");

describe("Tokenizer", () => {
	it("should correctly tokenize 1", () => {
		const input = `
      (var a 1)
      (var b "str")
    `;
		const readStream = new ReadStream(input);
		const tokenizer = new Tokenizer(readStream);
		const tokens = tokenizer.generateTokens().getTokens();
		expect(tokens).toEqual([
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.identifier, val: "var" },
			{ type: TOKEN_TYPES.identifier, val: "a" },
			{ type: TOKEN_TYPES.number, val: 1 },
			{ type: TOKEN_TYPES.symbol, val: ")" },
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.identifier, val: "var" },
			{ type: TOKEN_TYPES.identifier, val: "b" },
			{ type: TOKEN_TYPES.string, val: "str" },
			{ type: TOKEN_TYPES.symbol, val: ")" }
		]);
	});

	it("should correctly tokenize 2", () => {
		const input = `
      # a simple program
      (var a 12)
      
      
      
      (var b 2.5)
      (call print (+ a b)) # should print 14.5 to console

    `;
		const readStream = new ReadStream(input);
		const tokenizer = new Tokenizer(readStream);
		const tokens = tokenizer.generateTokens().getTokens();
		expect(tokens).toEqual([
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.identifier, val: "var" },
			{ type: TOKEN_TYPES.identifier, val: "a" },
			{ type: TOKEN_TYPES.number, val: 12 },
			{ type: TOKEN_TYPES.symbol, val: ")" },
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.identifier, val: "var" },
			{ type: TOKEN_TYPES.identifier, val: "b" },
			{ type: TOKEN_TYPES.number, val: 2.5 },
			{ type: TOKEN_TYPES.symbol, val: ")" },
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.identifier, val: "call" },
			{ type: TOKEN_TYPES.identifier, val: "print" },
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.symbol, val: "+" },
			{ type: TOKEN_TYPES.identifier, val: "a" },
			{ type: TOKEN_TYPES.identifier, val: "b" },
			{ type: TOKEN_TYPES.symbol, val: ")" },
			{ type: TOKEN_TYPES.symbol, val: ")" }
		]);
	});

	it("should correctly tokenize 3", () => {
		const input = `
      # comment line
      (fn my_func1 a b (* a b)) # inline comment
      # (var a 1)
      (call my_func1 2 3)
    `;
		const readStream = new ReadStream(input);
		const tokenizer = new Tokenizer(readStream);
		const tokens = tokenizer.generateTokens().getTokens();
		expect(tokens).toEqual([
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.identifier, val: "fn" },
			{ type: TOKEN_TYPES.identifier, val: "my_func1" },
			{ type: TOKEN_TYPES.identifier, val: "a" },
			{ type: TOKEN_TYPES.identifier, val: "b" },
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.symbol, val: "*" },
			{ type: TOKEN_TYPES.identifier, val: "a" },
			{ type: TOKEN_TYPES.identifier, val: "b" },
			{ type: TOKEN_TYPES.symbol, val: ")" },
			{ type: TOKEN_TYPES.symbol, val: ")" },
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.identifier, val: "call" },
			{ type: TOKEN_TYPES.identifier, val: "my_func1" },
			{ type: TOKEN_TYPES.number, val: 2 },
			{ type: TOKEN_TYPES.number, val: 3 },
			{ type: TOKEN_TYPES.symbol, val: ")" }
		]);
	});

	it("should correctly tokenize 4", () => {
		const input = `
      (var a 1)
      (var b a)
    `;
		const readStream = new ReadStream(input);
		const tokenizer = new Tokenizer(readStream);
		const tokens = tokenizer.generateTokens().getTokens();
		expect(tokens).toEqual([
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.identifier, val: "var" },
			{ type: TOKEN_TYPES.identifier, val: "a" },
			{ type: TOKEN_TYPES.number, val: 1 },
			{ type: TOKEN_TYPES.symbol, val: ")" },
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.identifier, val: "var" },
			{ type: TOKEN_TYPES.identifier, val: "b" },
			{ type: TOKEN_TYPES.identifier, val: "a" },
			{ type: TOKEN_TYPES.symbol, val: ")" }
		]);
	});

	it("should correctly tokenize 5", () => {
		const input = `
      (fn no_args_func (5))
      (call print (call no_args_func))
    `;
		const readStream = new ReadStream(input);
		const tokenizer = new Tokenizer(readStream);
		const tokens = tokenizer.generateTokens().getTokens();
		expect(tokens).toEqual([
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.identifier, val: "fn" },
			{ type: TOKEN_TYPES.identifier, val: "no_args_func" },
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.number, val: 5 },
			{ type: TOKEN_TYPES.symbol, val: ")" },
			{ type: TOKEN_TYPES.symbol, val: ")" },
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.identifier, val: "call" },
			{ type: TOKEN_TYPES.identifier, val: "print" },
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.identifier, val: "call" },
			{ type: TOKEN_TYPES.identifier, val: "no_args_func" },
			{ type: TOKEN_TYPES.symbol, val: ")" },
			{ type: TOKEN_TYPES.symbol, val: ")" }
		]);
	});

	it("should correctly tokenize 6", () => {
		const input = `
      (var x true)
      (var y false)
    `;
		const readStream = new ReadStream(input);
		const tokenizer = new Tokenizer(readStream);
		const tokens = tokenizer.generateTokens().getTokens();
		expect(tokens).toEqual([
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.identifier, val: "var" },
			{ type: TOKEN_TYPES.identifier, val: "x" },
			{ type: TOKEN_TYPES.identifier, val: "true" },
			{ type: TOKEN_TYPES.symbol, val: ")" },
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.identifier, val: "var" },
			{ type: TOKEN_TYPES.identifier, val: "y" },
			{ type: TOKEN_TYPES.identifier, val: "false" },
			{ type: TOKEN_TYPES.symbol, val: ")" }
		]);
	});
});
