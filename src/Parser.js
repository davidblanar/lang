const { TOKEN_TYPES, AST_TYPES } = require("./const");

class Parser {
	constructor(tokens) {
		this._tokens = tokens;
		this._pos = 0;
		this._ast = [];
	}

	parse() {
		while (this._hasNext()) {
			this._ast.push(this._parseExpression());
		}
		return this;
	}

	getAst() {
		return this._ast;
	}

	_parseExpression() {
		this._requireVal("(");
		this._next();
		let expr;
		while (this._peek().val !== ")") {
			const { type, val } = this._peek();
			switch (type) {
				case TOKEN_TYPES.number: {
					expr = this._parseNumber();
					break;
				}
				case TOKEN_TYPES.string: {
					expr = this._parseString();
					break;
				}
				case TOKEN_TYPES.identifier: {
					if (val === "var") {
						expr = this._parseVarDeclaration();
						break;
					}
					if (val === "fn") {
						expr = this._parseFnDeclaration();
						break;
					}
					// TODO move to constants
					if (val === "call") {
						expr = this._parseFnCall();
						break;
					}
					expr = this._parseVarReference();
					break;
				}
				case TOKEN_TYPES.symbol: {
					expr = this._parseSymbol();
					break;
				}
				default: {
					// TODO error
					break;
				}
			}
		}
		this._next();
		return expr;
	}

	_parseNumber() {
		return { type: AST_TYPES.number, val: parseFloat(this._next().val) };
	}

	_parseString() {
		return { type: AST_TYPES.string, val: this._next().val };
	}

	_parseVarDeclaration() {
		this._next();
		this._requireType(TOKEN_TYPES.identifier);
		const varName = this._next().val;
		return {
			type: AST_TYPES.varDeclaration,
			name: varName,
			val: this._parseVarValue()
		};
	}

	_parseVarValue() {
		const { val, type } = this._next();
		switch (type) {
			case TOKEN_TYPES.number: {
				return { type: AST_TYPES.number, val };
			}
			case TOKEN_TYPES.string: {
				return { type: AST_TYPES.string, val };
			}
			case TOKEN_TYPES.identifier: {
				return { type: AST_TYPES.varReference, val };
			}
		}
	}

	_parseVarReference() {
		return {
			type: AST_TYPES.varReference,
			val: this._next().val
		};
	}

	_parseSymbol() {
		const operation = this._next().val;
		return {
			type: AST_TYPES.operation,
			val: operation,
			leftOperand: this._parseVarValue(),
			rightOperand: this._parseVarValue()
		};
	}

	_parseFnDeclaration() {
		this._next();
		let isFnName = true;
		let fnName;
		let body;
		const args = [];
		while (this._peek().val !== ")") {
			if (isFnName) {
				isFnName = false;
				fnName = this._next().val;
			}
			if (this._peek().val === "(") {
				body = this._parseExpression();
			} else {
				args.push(this._next().val);
			}
		}
		return { type: AST_TYPES.fnDeclaration, name: fnName, args, body };
	}

	// TODO add requireTypes and requireVals
	_parseFnCall() {
		this._next();
		let isFnName = true;
		let fnName;
		const args = [];
		while (this._peek().val !== ")") {
			if (isFnName) {
				isFnName = false;
				fnName = this._parseVarReference();
			}
			if (this._peek().val === "(") {
				args.push(this._parseExpression());
			} else {
				args.push(this._parseVarValue());
			}
		}
		return {
			type: AST_TYPES.fnCall,
			name: fnName,
			args
		};
	}

	_requireType(expected) {
		const { type } = this._peek();
		if (type !== expected) {
			throw new Error(
				`Unexpected expression of type ${type}, expected ${expected}`
			);
		}
	}

	_requireVal(expected) {
		const { val } = this._peek();
		if (val !== expected) {
			throw new Error(`Unexpected token ${val}, expected ${expected}`);
		}
	}

	_hasNext() {
		return this._pos < this._tokens.length;
	}

	_next() {
		return this._tokens[this._pos++];
	}

	_peek() {
		return this._tokens[this._pos];
	}
}

module.exports = Parser;
