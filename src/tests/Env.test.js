const { Env, evalUnderEnv } = require("../Env");
const { AST_TYPES } = require("../const");

describe("Env", () => {
	it("should store and get variable", () => {
		const env = new Env();
		env.add("a", 10);
		expect(env._parent).toBe(undefined);
		expect(env.get("a")).toBe(10);
	});

	it("should store and get nested variable", () => {
		const env = new Env();
		const nested = env.extend();
		nested.add("a", 10);
		expect(nested._parent).not.toBe(undefined);
		expect(nested.get("a")).toBe(10);
	});

	it("should store and get top variable from nested env", () => {
		const env = new Env();
		env.add("a", 10);
		const nested = env.extend();
		expect(nested.get("a")).toBe(10);
	});

	it("should store and get lowest level variable from nested env", () => {
		const env = new Env();
		env.add("a", 10);
		const nested = env.extend();
		nested.add("a", 20);
		expect(env.get("a")).toBe(10);
		expect(nested.get("a")).toBe(20);
	});

	it("should throw error if variable not found", () => {
		const env = new Env();
		env.add("a", 10);
		const nested = env.extend();
		nested.add("b", 20);
		expect(() => nested.get("c")).toThrow("Undefined variable c");
	});

	it("should return value for primitive types", () => {
		const env = new Env();
		const numExpr = { type: AST_TYPES.number, val: 5 };
		const strExpr = { type: AST_TYPES.string, val: "abc" };
		const boolExpr = { type: AST_TYPES.boolean, val: false };
		const nullExpr = { type: AST_TYPES.null, val: null };
		expect(evalUnderEnv(numExpr, env)).toBe(5);
		expect(evalUnderEnv(strExpr, env)).toBe("abc");
		expect(evalUnderEnv(boolExpr, env)).toBe(false);
		expect(evalUnderEnv(nullExpr, env)).toBe(null);
	});

	it("should declare variable in env", () => {
		const env = new Env();
		const expr = {
			type: AST_TYPES.varDeclaration,
			name: "my_var",
			val: { type: AST_TYPES.number, val: 3 }
		};
		evalUnderEnv(expr, env);
		expect(env.get("my_var")).toBe(3);
	});

	it("should reference variable in env", () => {
		const env = new Env();
		env.add("my_var", "abc");
		const expr = { type: AST_TYPES.varReference, val: "my_var" };
		expect(evalUnderEnv(expr, env)).toBe("abc");
	});

	it("should perform operation", () => {
		const env = new Env();
		const expr = {
			type: AST_TYPES.operation,
			val: "*",
			leftOperand: {
				type: AST_TYPES.number,
				val: 10
			},
			rightOperand: { type: AST_TYPES.number, val: 20 }
		};
		expect(evalUnderEnv(expr, env)).toBe(200);
	});

	it("should evaluate function call", () => {
		const env = new Env();
		const myFunc = jest.fn();
		env.add("a", 2);
		env.add("b", true);
		env.add("my_func", myFunc);
		const expr = {
			type: AST_TYPES.fnCall,
			args: [
				{ type: AST_TYPES.varReference, val: "a" },
				{ type: AST_TYPES.varReference, val: "b" }
			],
			name: { type: AST_TYPES.varReference, val: "my_func" }
		};
		evalUnderEnv(expr, env);
		expect(myFunc).toHaveBeenCalledWith(2, true);
	});

	it("should declare function", () => {
		const env = new Env();
		const expr = {
			type: AST_TYPES.fnDeclaration,
			name: "my_func",
			args: ["x", "y"],
			body: {
				type: AST_TYPES.operation,
				val: "+",
				leftOperand: { type: AST_TYPES.varReference, val: "x" },
				rightOperand: { type: AST_TYPES.varReference, val: "y" }
			}
		};
		expect(evalUnderEnv(expr, env)).not.toBe(undefined);
		expect(env.get("my_func")).not.toBe(undefined);
	});

	it("should evaluate if condition", () => {
		const env = new Env();
		const expr = {
			type: AST_TYPES.ifCondition,
			val: { type: AST_TYPES.boolean, val: true },
			leftOperand: { type: AST_TYPES.number, val: 12 },
			rightOperand: { type: AST_TYPES.number, val: 21 }
		};
		expect(evalUnderEnv(expr, env)).toBe(12);
	});

	it("should throw error if expression type not recognized", () => {
		const env = new Env();
		const expr = { type: "whatever" };
		expect(() => evalUnderEnv(expr, env)).toThrow(
			"Unrecognized expression of type whatever"
		);
	});
});
