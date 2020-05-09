class ReadStream {
  constructor(input) {
    this.input = input;
    this.pos = 0;
  }

  next() {
    return this.input[this.pos++];
  }

  hasNext() {
    return this.input[this.pos] !== undefined;
  }

  peek() {
    return this.input[this.pos];
  }
}

module.exports = ReadStream;
