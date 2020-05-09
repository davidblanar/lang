class Parser {
  constructor(tokens) {
    this._tokens = tokens;
    this._pos = 0;
  }

  parse() {
    while (this._hasNext()) {
      const current = this._peek();
      // if ()
      this._next();
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
