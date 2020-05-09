const ReadStream = require("../ReadStream");

describe("ReadStream", () => {
	const input = "abc";
	let readStream;
	beforeEach(() => {
		readStream = new ReadStream(input);
	});

	it("should peek on next character without discarding it", () => {
		const peek = readStream.peek();
		const next = readStream.next();
		expect(peek).toBe("a");
		expect(next).toBe("a");
	});

	it("should get next character and discard it", () => {
		const next = readStream.next();
		const peek = readStream.peek();
		expect(next).toBe("a");
		expect(peek).toBe("b");
	});

	it("should return true if characters remaining", () => {
		const hasNext = readStream.hasNext();
		expect(hasNext).toBe(true);
	});

	it("should return false if no characters remaining", () => {
		readStream.next();
		readStream.next();
		readStream.next();
		const hasNext = readStream.hasNext();
		expect(hasNext).toBe(false);
	});
});
