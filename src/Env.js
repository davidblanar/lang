const { AST_TYPES } = require("./const");

class Env {
	constructor(parent) {
		this._parent = parent;
		this._vars = new Map();
	}

	extend() {
		return new Env(this);
	}

	add(name, val) {
		this._vars.set(name, val);
	}

	// search current environment and all parent environments for the variable
	get(name) {
		let current = this;
		while (current) {
			if (current._vars.has(name)) {
				return current._vars.get(name);
			}
			current = current._parent;
		}
		throw new Error(`Undefined variable ${name}`);
	}
}

function evalOperation(expr, env) {
	const leftOperand = evalUnderEnv(expr.leftOperand, env);
	const rightOperand = evalUnderEnv(expr.rightOperand, env);
	switch (expr.val) {
		case "+": {
			return leftOperand + rightOperand;
		}
		case "-": {
			return leftOperand - rightOperand;
		}
		case "*": {
			return leftOperand * rightOperand;
		}
		case "/": {
			if (rightOperand === 0) {
				throw new Error("Cannot divide by zero");
			}
			return leftOperand / rightOperand;
		}
		case "%": {
			return leftOperand % rightOperand;
		}
		case ">": {
			return leftOperand > rightOperand;
		}
		case "<": {
			return leftOperand < rightOperand;
		}
		case ">=": {
			return leftOperand >= rightOperand;
		}
		case "<=": {
			return leftOperand <= rightOperand;
		}
		default: {
			throw new Error(`Unrecognized operation ${expr.val}`);
		}
	}
}

// TODO test
function evalUnderEnv(expr, env) {
	switch (expr.type) {
		case AST_TYPES.root: {
			let result;
			expr.val.forEach(function (expression) {
				result = evalUnderEnv(expression, env);
			});
			return result;
		}
		case AST_TYPES.number:
		case AST_TYPES.string:
		case AST_TYPES.boolean: {
			return expr.val;
		}
		case AST_TYPES.varDeclaration: {
			env.add(expr.name, evalUnderEnv(expr.val, env));
			break;
		}
		case AST_TYPES.varReference: {
			return env.get(expr.val);
		}
		case AST_TYPES.operation: {
			return evalOperation(expr, env);
		}
		case AST_TYPES.fnCall: {
			const args = expr.args.map(function (arg) {
				return evalUnderEnv(arg, env);
			});
			const fn = evalUnderEnv(expr.name, env);
			return fn.apply(null, args);
		}
		case AST_TYPES.fnDeclaration: {
			const fn = function () {
				const nestedEnv = env.extend();
				if (expr.args.length !== arguments.length) {
					throw new Error(
						`Incorrect number of arguments supplied to function ${expr.name}, expected ${expr.args.length}, got ${arguments.length}`
					);
				}
				const fnArguments = arguments;
				expr.args.forEach(function (arg, index) {
					nestedEnv.add(arg, fnArguments[index]);
				});
				return evalUnderEnv(expr.body, nestedEnv);
			};
			env.add(expr.name, fn);
			break;
		}
		default: {
			throw new Error(`Unrecognized expression of type ${expr.type}`);
		}
	}
}

module.exports = { Env, evalUnderEnv };
