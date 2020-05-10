const Parser = require("../Parser");
const { AST_TYPES, TOKEN_TYPES } = require("../const");

describe("Parser", () => {
	it("should correctly parse variable declarations", () => {
		/*
      (var a true)
      (var b 2.5)
      (var c "str")
    */
		const tokens = [
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
			{ type: TOKEN_TYPES.symbol, val: ")" }
		];
		const parser = new Parser(tokens);
		const ast = parser.parse().getAst();
		expect(ast).toEqual({
			type: AST_TYPES.root,
			val: [
				{
					type: AST_TYPES.varDeclaration,
					name: "a",
					val: { type: AST_TYPES.boolean, val: true }
				},
				{
					type: AST_TYPES.varDeclaration,
					name: "b",
					val: { type: AST_TYPES.number, val: 2.5 }
				},
				{
					type: AST_TYPES.varDeclaration,
					name: "c",
					val: { type: AST_TYPES.string, val: "str" }
				}
			]
		});
	});

	it("should correctly parse variable reference", () => {
		/*
      (var a 1)
      (var x a)
    */
		const tokens = [
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
		];
		const parser = new Parser(tokens);
		const ast = parser.parse().getAst();
		expect(ast).toEqual({
			type: AST_TYPES.root,
			val: [
				{
					type: AST_TYPES.varDeclaration,
					name: "a",
					val: { type: AST_TYPES.number, val: 1 }
				},
				{
					type: AST_TYPES.varDeclaration,
					name: "x",
					val: { type: AST_TYPES.varReference, val: "a" }
				}
			]
		});
	});

	it("should correctly parse comparisons", () => {
		/*
      (= "A" "B")
      (>= 2 0)
    */
		const tokens = [
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
		];
		const parser = new Parser(tokens);
		const ast = parser.parse().getAst();
		expect(ast).toEqual({
			type: AST_TYPES.root,
			val: [
				{
					type: AST_TYPES.operation,
					val: "=",
					leftOperand: { type: AST_TYPES.string, val: "A" },
					rightOperand: { type: AST_TYPES.string, val: "B" }
				},
				{
					type: AST_TYPES.operation,
					val: ">=",
					leftOperand: { type: AST_TYPES.number, val: 2 },
					rightOperand: { type: AST_TYPES.number, val: 0 }
				}
			]
		});
	});

	it("should correctly parse conditional", () => {
		/*
      (if (< 2 3) (5) (6))
    */
		const tokens = [
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
		];
		const parser = new Parser(tokens);
		const ast = parser.parse().getAst();
		expect(ast).toEqual({
			type: AST_TYPES.root,
			val: [
				{
					type: AST_TYPES.ifCondition,
					val: {
						type: AST_TYPES.operation,
						val: "<",
						leftOperand: { type: AST_TYPES.number, val: 2 },
						rightOperand: { type: AST_TYPES.number, val: 3 }
					},
					leftOperand: { type: AST_TYPES.number, val: 5 },
					rightOperand: { type: AST_TYPES.number, val: 6 }
				}
			]
		});
	});

	it("should correctly parse basic arithmetic", () => {
		/*
      (+ 5 4)
      (- 5 4)
    */
		const tokens = [
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
		];
		const parser = new Parser(tokens);
		const ast = parser.parse().getAst();
		expect(ast).toEqual({
			type: AST_TYPES.root,
			val: [
				{
					type: AST_TYPES.operation,
					val: "+",
					leftOperand: { type: AST_TYPES.number, val: 5 },
					rightOperand: { type: AST_TYPES.number, val: 4 }
				},
				{
					type: AST_TYPES.operation,
					val: "-",
					leftOperand: { type: AST_TYPES.number, val: 5 },
					rightOperand: { type: AST_TYPES.number, val: 4 }
				}
			]
		});
	});

	it("should correctly parse function declaration", () => {
		/*
       (fn mult a b (* a b))
    */
		const tokens = [
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
		];
		const parser = new Parser(tokens);
		const ast = parser.parse().getAst();
		expect(ast).toEqual({
			type: AST_TYPES.root,
			val: [
				{
					type: AST_TYPES.fnDeclaration,
					name: "mult",
					args: ["a", "b"],
					body: {
						type: AST_TYPES.operation,
						val: "*",
						leftOperand: { type: AST_TYPES.varReference, val: "a" },
						rightOperand: { type: AST_TYPES.varReference, val: "b" }
					}
				}
			]
		});
	});

	it("should correctly parse function call", () => {
		/*
      (call mult 10 20)
    */
		const tokens = [
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.identifier, val: "call" },
			{ type: TOKEN_TYPES.identifier, val: "mult" },
			{ type: TOKEN_TYPES.number, val: 10 },
			{ type: TOKEN_TYPES.number, val: 20 },
			{ type: TOKEN_TYPES.symbol, val: ")" }
		];
		const parser = new Parser(tokens);
		const ast = parser.parse().getAst();
		expect(ast).toEqual({
			type: AST_TYPES.root,
			val: [
				{
					type: AST_TYPES.fnCall,
					name: { type: AST_TYPES.varReference, val: "mult" },
					args: [
						{ type: AST_TYPES.number, val: 10 },
						{ type: AST_TYPES.number, val: 20 }
					]
				}
			]
		});
	});
});
