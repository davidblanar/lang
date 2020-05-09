const ReadStream = require("../ReadStream");
const Tokenizer = require("../Tokenizer");

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
			"(",
			"var",
			"a",
			"1",
			")",
			"(",
			"var",
			"b",
			'"str"',
			")"
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
			"(",
			"var",
			"a",
			"12",
			")",
			"(",
			"var",
			"b",
			"2.5",
			")",
			"(",
			"print",
			"(",
			"+",
			"a",
			"b",
			")",
			")"
		]);
	});
});
