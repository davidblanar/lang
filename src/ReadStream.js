class ReadStream {
	constructor(input) {
		this._input = input;
		this._pos = 0;
	}

	// get the next character and discard it
	next() {
		return this._input[this._pos++];
	}

	hasNext() {
		return this._input[this._pos] !== undefined;
	}

	// get the next character without discarding it
	peek() {
		return this._input[this._pos];
	}
}

module.exports = ReadStream;
