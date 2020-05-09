const ReadStream = require("../ReadStream");
const Tokenizer = require("../Tokenizer");
const { TYPES } = require("../const");

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
			{ type: TYPES.symbol, val: "(" },
			{ type: TYPES.identifier, val: "var" },
			{ type: TYPES.identifier, val: "a" },
			{ type: TYPES.number, val: "1" },
			{ type: TYPES.symbol, val: ")" },
			{ type: TYPES.symbol, val: "(" },
			{ type: TYPES.identifier, val: "var" },
			{ type: TYPES.identifier, val: "b" },
			{ type: TYPES.string, val: "str" },
			{ type: TYPES.symbol, val: ")" }
		]);
	});

	it("should correctly tokenize 2", () => {
		const input = `
      # a simple program
      (var a 12)
      (var b 2.5)
      (print (+ a b)) # should print 14.5 to console

    `;
		const readStream = new ReadStream(input);
		const tokenizer = new Tokenizer(readStream);
		const tokens = tokenizer.generateTokens().getTokens();
		expect(tokens).toEqual([
			{ type: TYPES.symbol, val: "(" },
			{ type: TYPES.identifier, val: "var" },
			{ type: TYPES.identifier, val: "a" },
			{ type: TYPES.number, val: "12" },
			{ type: TYPES.symbol, val: ")" },
			{ type: TYPES.symbol, val: "(" },
			{ type: TYPES.identifier, val: "var" },
			{ type: TYPES.identifier, val: "b" },
			{ type: TYPES.number, val: "2.5" },
			{ type: TYPES.symbol, val: ")" },
			{ type: TYPES.symbol, val: "(" },
			{ type: TYPES.identifier, val: "print" },
			{ type: TYPES.symbol, val: "(" },
			{ type: TYPES.symbol, val: "+" },
			{ type: TYPES.identifier, val: "a" },
			{ type: TYPES.identifier, val: "b" },
			{ type: TYPES.symbol, val: ")" },
			{ type: TYPES.symbol, val: ")" }
		]);
	});

	it("should correctly tokenize 3", () => {
		const input = `
      # comment line
      (fn my_func a b (* a b)) # inline comment
      # (var a 1)
    `;
		const readStream = new ReadStream(input);
		const tokenizer = new Tokenizer(readStream);
		const tokens = tokenizer.generateTokens().getTokens();
		expect(tokens).toEqual([
			{ type: TYPES.symbol, val: "(" },
			{ type: TYPES.identifier, val: "fn" },
			{ type: TYPES.identifier, val: "my_func" },
			{ type: TYPES.identifier, val: "a" },
			{ type: TYPES.identifier, val: "b" },
			{ type: TYPES.symbol, val: "(" },
			{ type: TYPES.symbol, val: "*" },
			{ type: TYPES.identifier, val: "a" },
			{ type: TYPES.identifier, val: "b" },
			{ type: TYPES.symbol, val: ")" },
			{ type: TYPES.symbol, val: ")" }
		]);
	});
});
