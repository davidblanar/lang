const TOKEN_TYPES = {
	identifier: "identifier",
	symbol: "symbol",
	number: "number",
	string: "string"
};

const AST_TYPES = {
	number: "number",
	string: "string",
	varDeclaration: "varDeclaration",
	varReference: "varReference",
	operation: "operation",
	fnDeclaration: "fnDeclaration",
	fnCall: "fnCall"
};

module.exports = {
	TOKEN_TYPES,
	AST_TYPES
};
