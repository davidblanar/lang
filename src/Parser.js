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
		return { type: AST_TYPES.sequence, val: this._ast };
	}

	_parseExpression() {
		this._requireVal("(");
		// skip "("
		this._next();
		let expr;
		while (!this._isEndOfExpression()) {
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
					if (val === "call") {
						expr = this._parseFnCall();
						break;
					}
					if (this._isBoolean(val)) {
						expr = this._parseBoolean();
						break;
					}
					if (this._isNull(val)) {
						expr = this._parseNull();
						break;
					}
					if (val === "if") {
						expr = this._parseIfCondition();
						break;
					}
					if (val === "seq") {
						expr = this._parseSequence();
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
					throw new Error(
						`Unrecognized token type ${type}, value ${val}`
					);
				}
			}
		}
		this._requireVal(")");
		// skip ")"
		this._next();
		return expr;
	}

	_parseNumber() {
		return { type: AST_TYPES.number, val: parseFloat(this._next().val) };
	}

	_parseString() {
		return { type: AST_TYPES.string, val: this._next().val };
	}

	_parseBoolean() {
		return { type: AST_TYPES.boolean, val: this._next().val === "true" };
	}

	_parseNull() {
		this._next();
		return { type: AST_TYPES.null, val: null };
	}

	_parseIfCondition() {
		// skip "if" keyword
		this._next();
		const condition = this._parseExpression();
		const leftOperand = this._parseExpression();
		const rightOperand = this._parseExpression();
		return {
			type: AST_TYPES.ifCondition,
			val: condition,
			leftOperand,
			rightOperand
		};
	}

	_parseVarDeclaration() {
		// skip "var" keyword
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
		if (this._isBeginningOfExpression()) {
			return this._parseExpression();
		}
		const { val, type } = this._next();
		switch (type) {
			case TOKEN_TYPES.number: {
				return { type: AST_TYPES.number, val };
			}
			case TOKEN_TYPES.string: {
				return { type: AST_TYPES.string, val };
			}
			case TOKEN_TYPES.identifier: {
				if (this._isBoolean(val)) {
					return { type: AST_TYPES.boolean, val: val === "true" };
				}
				if (this._isNull(val)) {
					return { type: AST_TYPES.null, val: null };
				}
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
		let operation = this._next().val;
		if (operation === ">" || operation === "<") {
			if (this._peek().val === "=") {
				operation += this._next().val;
			}
		}
		return {
			type: AST_TYPES.operation,
			val: operation,
			leftOperand: this._parseVarValue(),
			rightOperand: this._parseVarValue()
		};
	}

	_parseFnDeclaration() {
		// skip "fn" keyword
		this._next();
		this._requireType(TOKEN_TYPES.identifier);
		let isFnName = true;
		let fnName;
		let body;
		const args = [];
		while (!this._isEndOfExpression()) {
			// first token is function name
			if (isFnName) {
				isFnName = false;
				fnName = this._next().val;
			}
			// then parse function parameters and body
			if (this._isBeginningOfExpression()) {
				// the body of a function is an expression
				body = this._parseExpression();
			} else {
				// an identifier, e.g a parameter
				args.push(this._next().val);
			}
		}
		return { type: AST_TYPES.fnDeclaration, name: fnName, args, body };
	}

	_parseFnCall() {
		// skip "call" keyword
		this._next();
		this._requireType(TOKEN_TYPES.identifier);
		let isFnName = true;
		let fnName;
		const args = [];
		while (!this._isEndOfExpression()) {
			// first token is function name, which is a var reference
			if (isFnName) {
				isFnName = false;
				fnName = this._parseVarReference();
				continue;
			}
			if (this._isBeginningOfExpression()) {
				// if the argument provided is an expression, parse it
				args.push(this._parseExpression());
			} else {
				// otherwise parse the value of the argument
				args.push(this._parseVarValue());
			}
		}
		return {
			type: AST_TYPES.fnCall,
			name: fnName,
			args
		};
	}

	_parseSequence() {
		// skip "seq" keyword
		this._next();
		this._requireVal("[");
		// skip "["
		this._next();
		const sequence = [];
		while (this._peek().val !== "]") {
			sequence.push(this._parseExpression());
		}
		// skip "]"
		this._next();
		return {
			type: AST_TYPES.sequence,
			val: sequence
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

	_isBoolean(token) {
		return token === "true" || token === "false";
	}

	_isNull(token) {
		return token === "null";
	}

	_isBeginningOfExpression() {
		return this._peek().val === "(";
	}

	_isEndOfExpression() {
		return this._peek().val === ")";
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
