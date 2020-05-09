class ReadStream {
  constructor(input) {
    this._input = input;
    this._pos = 0;
  }

  next() {
    return this._input[this._pos++];
  }

  hasNext() {
    return this._input[this._pos] !== undefined;
  }

  peek() {
    return this._input[this._pos];
  }
}

module.exports = ReadStream;
