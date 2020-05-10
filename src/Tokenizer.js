const { TOKEN_TYPES } = require("./const");

class Tokenizer {
	constructor(readStream) {
		this._readStream = readStream;
		// TODO implement >=
		this._symbols = new Set(["(", ")", "=", "+", "-", "*", "/", "%"]);
		this._identifierCharsRe = /[_A-Za-z]/;
		this._numberCharsRe = /[0-9]/;
		this._whiteSpaceRe = /\s/;
		this._tokens = [];
	}

	getTokens() {
		return this._tokens;
	}

	generateTokens() {
		while (this._readStream.hasNext()) {
			const current = this._readStream.peek();
			if (current === "#") {
				this._skipComment();
			}
			if (this._isWhiteSpace(current)) {
				this._skip();
			}
			if (this._identifierCharsRe.test(current)) {
				this._readIdentifier();
			}
			if (this._symbols.has(current)) {
				this._readSymbol();
			}
			if (this._numberCharsRe.test(current)) {
				this._readNumber();
			}
			if (current === '"') {
				this._readString();
			}
		}
		return this;
	}

	_skipComment() {
		while (
			this._readStream.hasNext() &&
			this._readStream.next() !== "\n"
		) {}
	}

	_readIdentifier() {
		let identifier = "";
		while (this._readStream.hasNext()) {
			const current = this._readStream.peek();
			if (this._isWhiteSpace(current) || !this._isIdentifier(current)) {
				break;
			}
			identifier += this._readStream.next();
		}
		this._tokens.push({ type: TOKEN_TYPES.identifier, val: identifier });
	}

	_readSymbol() {
		const current = this._readStream.next();
		this._tokens.push({ type: TOKEN_TYPES.symbol, val: current });
	}

	_readNumber() {
		let number = "";
		while (this._readStream.hasNext()) {
			const current = this._readStream.peek();
			if (current === "." || this._numberCharsRe.test(current)) {
				number += this._readStream.next();
			} else {
				break;
			}
		}
		this._tokens.push({
			type: TOKEN_TYPES.number,
			val: parseFloat(number)
		});
	}

	_readString() {
		// skip beginning double quote
		this._readStream.next();
		let string = "";
		while (this._readStream.hasNext()) {
			const current = this._readStream.peek();
			if (current === '"') {
				// skip ending double quote
				this._readStream.next();
				break;
			} else {
				string += this._readStream.next();
			}
		}
		this._tokens.push({ type: TOKEN_TYPES.string, val: string });
	}

	_isWhiteSpace(char) {
		return this._whiteSpaceRe.test(char);
	}

	_isIdentifier(char) {
		return this._identifierCharsRe.test(char);
	}

	_skip() {
		this._readStream.next();
	}
}

module.exports = Tokenizer;
