const Env = require("../Env");

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
});
