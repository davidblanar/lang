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

module.exports = Env;
