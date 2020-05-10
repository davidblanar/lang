const Parser = require("../Parser");
const { AST_TYPES, TOKEN_TYPES } = require("../const");

describe("Parser", () => {
	it("should parse correctly 1", () => {
		/*
      (var a 1)
      (var b "str")
    */
		const tokens = [
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
					name: "b",
					val: { type: AST_TYPES.string, val: "str" }
				}
			]
		});
	});

	it("should parse correctly 2", () => {
		/*
      (var a 12)
      (var b 2.5)
      (print (+ a b))
    */
		const tokens = [
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
		];
		const parser = new Parser(tokens);
		const ast = parser.parse().getAst();
		expect(ast).toEqual({
			type: AST_TYPES.root,
			val: [
				{
					type: AST_TYPES.varDeclaration,
					name: "a",
					val: { type: AST_TYPES.number, val: 12 }
				},
				{
					type: AST_TYPES.varDeclaration,
					name: "b",
					val: { type: AST_TYPES.number, val: 2.5 }
				},
				{
					type: AST_TYPES.fnCall,
					name: { type: AST_TYPES.varReference, val: "print" },
					args: [
						{
							type: AST_TYPES.operation,
							val: "+",
							leftOperand: {
								type: AST_TYPES.varReference,
								val: "a"
							},
							rightOperand: {
								type: AST_TYPES.varReference,
								val: "b"
							}
						}
					]
				}
			]
		});
	});

	it("should parse correctly 3", () => {
		/*
      (fn my_func a b (* a b))
      (call my_func 2 3)
    */
		const tokens = [
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.identifier, val: "fn" },
			{ type: TOKEN_TYPES.identifier, val: "my_func" },
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
			{ type: TOKEN_TYPES.identifier, val: "my_func" },
			{ type: TOKEN_TYPES.number, val: 2 },
			{ type: TOKEN_TYPES.number, val: 3 },
			{ type: TOKEN_TYPES.symbol, val: ")" }
		];
		const parser = new Parser(tokens);
		const ast = parser.parse().getAst();
		expect(ast).toEqual({
			type: AST_TYPES.root,
			val: [
				{
					type: AST_TYPES.fnDeclaration,
					name: "my_func",
					args: ["a", "b"],
					body: {
						type: AST_TYPES.operation,
						val: "*",
						leftOperand: { type: AST_TYPES.varReference, val: "a" },
						rightOperand: { type: AST_TYPES.varReference, val: "b" }
					}
				},
				{
					type: AST_TYPES.fnCall,
					name: { type: AST_TYPES.varReference, val: "my_func" },
					args: [
						{ type: AST_TYPES.number, val: 2 },
						{ type: AST_TYPES.number, val: 3 }
					]
				}
			]
		});
	});

	it("should parse correctly 4", () => {
		/*
      (var a 1)
      (var b a)
    */
		const tokens = [
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
					name: "b",
					val: {
						type: AST_TYPES.varReference,
						val: "a"
					}
				}
			]
		});
	});

	it("should parse correctly 5", () => {
		/*
      (fn no_args_func (5))
      (call no_args_func)
    */
		const tokens = [
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.identifier, val: "fn" },
			{ type: TOKEN_TYPES.identifier, val: "no_args_func" },
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.number, val: 5 },
			{ type: TOKEN_TYPES.symbol, val: ")" },
			{ type: TOKEN_TYPES.symbol, val: ")" },
			{ type: TOKEN_TYPES.symbol, val: "(" },
			{ type: TOKEN_TYPES.identifier, val: "call" },
			{ type: TOKEN_TYPES.identifier, val: "no_args_func" },
			{ type: TOKEN_TYPES.symbol, val: ")" }
		];
		const parser = new Parser(tokens);
		const ast = parser.parse().getAst();
		expect(ast).toEqual({
			type: AST_TYPES.root,
			val: [
				{
					type: AST_TYPES.fnDeclaration,
					name: "no_args_func",
					args: [],
					body: {
						type: AST_TYPES.number,
						val: 5
					}
				},
				{
					type: AST_TYPES.fnCall,
					name: { type: AST_TYPES.varReference, val: "no_args_func" },
					args: []
				}
			]
		});
	});
});
