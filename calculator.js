const calculator = {
  operatorFunctions: {
    "+": (num1, num2) => (num2 == undefined ? Number(num1) : num1 + num2),
    "-": (num1, num2) => (num2 == undefined ? Number(num1) : num1 - num2),
    "*": (num1, num2 = 1) => num1 * num2,
    "/": (num1, num2 = 1) => num1 / num2,
    "%": (num = 0) => num / 100,
  },
  tokenTypes: {
    preUnary: ["+", "-"],
    postUnary: ["%"],
    binary: ["+", "-", "*", "/"],
    operand: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."],
  },

  isOperand(token) {
    return this.tokenTypes.operand.includes(token);
  },
  isPreUnary(token) {
    return this.tokenTypes.preUnary.includes(token);
  },
  isPostUnary(token) {
    return this.tokenTypes.postUnary.includes(token);
  },
  isBinary(token) {
    return this.tokenTypes.binary.includes(token);
  },

  expression: [],

  addToken(token) {
    if (this.isPreUnary(token)) this.addPreUnary(token);
    if (this.isOperand(token)) this.addOperand(token);
    if (this.isPostUnary(token)) this.addPostUnary(token);
    if (this.isBinary(token)) this.addBinary(token);
  },

  addPreUnary(token) {
    // const currentToken = this.expression.at(-1);
    const position = this.expression.length % 4;

    if (position == 0) {
      this.expression.push(token);
    } else if (position == 1) {
      this.expression[this.expression.length - 1] = token;
    }
  },

  addOperand(token) {
    const position = this.expression.length % 4;

    if (position == 0) {
      this.addPreUnary("");
      this.expression.push(token);
    } else if (position == 1) {
      this.expression.push(token);
    } else if (position == 2) {
      this.expression[this.expression.length - 1] += token;
    }
  },

  addPostUnary(token) {
    const position = this.expression.length % 4;

    if (position == 2) {
      this.expression.push(token);
    } else if (position == 3) {
      this.expression[this.expression.length - 1] = token;
    }
  },

  addBinary(token) {
    const position = this.expression.length % 4;

    if (position == 2) {
      this.addPostUnary("");
      this.expression.push(token);
    } else if (position == 3) {
      this.expression.push(token);
    } else if (position == 4) {
      this.expression[this.expression.length - 1] = token;
    }
  },
};
