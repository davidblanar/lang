const ReadStream = require("../ReadStream");
const Tokenizer = require("../Tokenizer");
const { TOKEN_TYPES } = require("../const");

describe("Tokenizer", () => {
	it("should correctly tokenize variable declarations and ignore comments", () => {
		const input = `
      # variable declaration
      (var a true) # inline comment
      (var b 2.5)
      (var c "str")
      (var d null)
    `;
		const readStream = new ReadStream(input);
		const tokenizer = new Tokenizer(readStream);
		const tokens = tokenizer.generateTokens().getTokens();
		expect(tokens).toEqual([
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.identifier, val: "var" },
			{ type: TOKEN_TYPES.identifier, val: "a" },
			{ type: TOKEN_TYPES.identifier, val: "true" },
			{ type: TOKEN_TYPES.symbol, val: ")" },
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.identifier, val: "var" },
			{ type: TOKEN_TYPES.identifier, val: "b" },
			{ type: TOKEN_TYPES.number, val: 2.5 },
			{ type: TOKEN_TYPES.symbol, val: ")" },
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.identifier, val: "var" },
			{ type: TOKEN_TYPES.identifier, val: "c" },
			{ type: TOKEN_TYPES.string, val: "str" },
			{ type: TOKEN_TYPES.symbol, val: ")" },
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.identifier, val: "var" },
			{ type: TOKEN_TYPES.identifier, val: "d" },
			{ type: TOKEN_TYPES.identifier, val: "null" },
			{ type: TOKEN_TYPES.symbol, val: ")" }
		]);
	});

	it("should correctly tokenize variable reference and ignore whitespace", () => {
		const input = `
		
		
		      (var a 1)
          (var x a)
      

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
			{ type: TOKEN_TYPES.identifier, val: "x" },
			{ type: TOKEN_TYPES.identifier, val: "a" },
			{ type: TOKEN_TYPES.symbol, val: ")" }
		]);
	});

	it("should correctly tokenize comparisons", () => {
		const input = `
      (= "A" "B")
      (>= 2 0)
    `;
		const readStream = new ReadStream(input);
		const tokenizer = new Tokenizer(readStream);
		const tokens = tokenizer.generateTokens().getTokens();
		expect(tokens).toEqual([
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.symbol, val: "=" },
			{ type: TOKEN_TYPES.string, val: "A" },
			{ type: TOKEN_TYPES.string, val: "B" },
			{ type: TOKEN_TYPES.symbol, val: ")" },
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.symbol, val: ">" },
			{ type: TOKEN_TYPES.symbol, val: "=" },
			{ type: TOKEN_TYPES.number, val: 2 },
			{ type: TOKEN_TYPES.number, val: 0 },
			{ type: TOKEN_TYPES.symbol, val: ")" }
		]);
	});

	it("should correctly tokenize conditional", () => {
		const input = `
      (if (< 2 3) (5) (6))
    `;
		const readStream = new ReadStream(input);
		const tokenizer = new Tokenizer(readStream);
		const tokens = tokenizer.generateTokens().getTokens();
		expect(tokens).toEqual([
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.identifier, val: "if" },
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.symbol, val: "<" },
			{ type: TOKEN_TYPES.number, val: 2 },
			{ type: TOKEN_TYPES.number, val: 3 },
			{ type: TOKEN_TYPES.symbol, val: ")" },
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.number, val: 5 },
			{ type: TOKEN_TYPES.symbol, val: ")" },
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.number, val: 6 },
			{ type: TOKEN_TYPES.symbol, val: ")" },
			{ type: TOKEN_TYPES.symbol, val: ")" }
		]);
	});

	it("should correctly tokenize basic arithmetic", () => {
		const input = `
      (+ 5 4)
      (- 5 4)
    `;
		const readStream = new ReadStream(input);
		const tokenizer = new Tokenizer(readStream);
		const tokens = tokenizer.generateTokens().getTokens();
		expect(tokens).toEqual([
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.symbol, val: "+" },
			{ type: TOKEN_TYPES.number, val: 5 },
			{ type: TOKEN_TYPES.number, val: 4 },
			{ type: TOKEN_TYPES.symbol, val: ")" },
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.symbol, val: "-" },
			{ type: TOKEN_TYPES.number, val: 5 },
			{ type: TOKEN_TYPES.number, val: 4 },
			{ type: TOKEN_TYPES.symbol, val: ")" }
		]);
	});

	it("should correctly tokenize function declaration", () => {
		const input = `
      (fn mult a b (* a b))
    `;
		const readStream = new ReadStream(input);
		const tokenizer = new Tokenizer(readStream);
		const tokens = tokenizer.generateTokens().getTokens();
		expect(tokens).toEqual([
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.identifier, val: "fn" },
			{ type: TOKEN_TYPES.identifier, val: "mult" },
			{ type: TOKEN_TYPES.identifier, val: "a" },
			{ type: TOKEN_TYPES.identifier, val: "b" },
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.symbol, val: "*" },
			{ type: TOKEN_TYPES.identifier, val: "a" },
			{ type: TOKEN_TYPES.identifier, val: "b" },
			{ type: TOKEN_TYPES.symbol, val: ")" },
			{ type: TOKEN_TYPES.symbol, val: ")" }
		]);
	});

	it("should correctly tokenize function call", () => {
		const input = `
      (call mult 10 20)
    `;
		const readStream = new ReadStream(input);
		const tokenizer = new Tokenizer(readStream);
		const tokens = tokenizer.generateTokens().getTokens();
		expect(tokens).toEqual([
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.identifier, val: "call" },
			{ type: TOKEN_TYPES.identifier, val: "mult" },
			{ type: TOKEN_TYPES.number, val: 10 },
			{ type: TOKEN_TYPES.number, val: 20 },
			{ type: TOKEN_TYPES.symbol, val: ")" }
		]);
	});

	it("should correctly tokenize sequence", () => {
		const input = `
      (seq [(call print "a") (call print "b") (call print "c")])
    `;
		const readStream = new ReadStream(input);
		const tokenizer = new Tokenizer(readStream);
		const tokens = tokenizer.generateTokens().getTokens();
		expect(tokens).toEqual([
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.identifier, val: "seq" },
			{ type: TOKEN_TYPES.symbol, val: "[" },
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.identifier, val: "call" },
			{ type: TOKEN_TYPES.identifier, val: "print" },
			{ type: TOKEN_TYPES.string, val: "a" },
			{ type: TOKEN_TYPES.symbol, val: ")" },
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.identifier, val: "call" },
			{ type: TOKEN_TYPES.identifier, val: "print" },
			{ type: TOKEN_TYPES.string, val: "b" },
			{ type: TOKEN_TYPES.symbol, val: ")" },
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.identifier, val: "call" },
			{ type: TOKEN_TYPES.identifier, val: "print" },
			{ type: TOKEN_TYPES.string, val: "c" },
			{ type: TOKEN_TYPES.symbol, val: ")" },
			{ type: TOKEN_TYPES.symbol, val: "]" },
			{ type: TOKEN_TYPES.symbol, val: ")" }
		]);
	});
});
