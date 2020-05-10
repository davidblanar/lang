const { TOKEN_TYPES } = require("./const");

class Tokenizer {
	constructor(readStream) {
		this._readStream = readStream;
		this._symbols = new Set([
			"(",
			")",
			"=",
			"+",
			"-",
			"*",
			"/",
			"%",
			">",
			"<"
		]);
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
			} else if (this._isWhiteSpace(current)) {
				this._skip();
			} else if (this._identifierCharsRe.test(current)) {
				// either a keyword, function name or var name
				this._readIdentifier();
			} else if (this._symbols.has(current)) {
				this._readSymbol();
			} else if (this._numberCharsRe.test(current)) {
				this._readNumber();
			} else if (current === '"') {
				// if an opening double quote is encountered, read string
				this._readString();
			} else {
				throw new Error(`Unrecognized character ${current}`);
			}
		}
		return this;
	}

	_skipComment() {
		// skip to the end of line
		while (
			this._readStream.hasNext() &&
			this._readStream.next() !== "\n"
		) {}
	}

	_readIdentifier() {
		let identifier = "";
		while (this._readStream.hasNext()) {
			const current = this._readStream.peek();
			// read until whitespace is encountered or end of expression
			if (this._isWhiteSpace(current) || current === ")") {
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
			// read number while the next character is a digit or "." (decimal)
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
			// read until we encounter a closing double quote
			if (current === '"') {
				// skip closing double quote
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

	_skip() {
		// skip a single character
		this._readStream.next();
	}
}

module.exports = Tokenizer;
