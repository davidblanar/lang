class Tokenizer {
  constructor(readStream) {
    this.readStream = readStream;
    // this.symbols = new Set(["(", ")", "=", "+", "-", "*", "/", "%"]);
    // this.keywords = new Set(["var", "fn"]);
    this.identifierChars = /[_A-Za-z]/;
    // this.numberChars = /[0-9]/;
    this.whiteSpaceRe = /\s/;
    this.tokens = [];
  }

  getTokens() {
    while (this.readStream.hasNext()) {
      const current = this.readStream.peek();
      if (current === "#") {
        this._skipComment();
      }
      if (this.identifierChars.test(current)) {
        this._readWhileIdentifier();
      }
      this._readToken();
    }
    console.log(this.tokens);
  }

  _skipComment() {
    while (this.readStream.hasNext() && this.readStream.next() !== "\n") {}
  }

  _readWhileIdentifier() {
    let identifier = "";
    while (this.readStream.hasNext()) {
      const current = this.readStream.next();
      if (this.whiteSpaceRe.test(current)) {
        break;
      }
      identifier += current;
    }
    this.tokens.push(identifier);
  }

  _readToken() {
    const current = this.readStream.next();
    if (this.readStream.hasNext() && !this.whiteSpaceRe.test(current)) {
      this.tokens.push(current);
    }
  }
}

module.exports = Tokenizer;
