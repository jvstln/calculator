const calculator = {
  operatorFunctions: {
    "+": (num1, num2 = 0) => num1 + num2,
    "-": (num1, num2) => (num2 == undefined ? -num1 : num1 - num2),
    "*": (num1, num2 = 1) => num1 * num2,
    "/": (num1, num2 = 1) => num1 / num2,
    "%": (num = 0) => num / 100,
  },
  tokenTypes: {
    preUnary: ["+", "-"],
    postUnary: ["%"],
    binary: ["+", "-", "*", "/"],
    binaryPrecedence: [
      ["*", "/"],
      ["+", "-"],
    ],
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
    } else if (position == 0) {
      this.expression[this.expression.length - 1] = token;
    }
  },

  getExpressionString() {
    return this.expression.join("");
  },

  calcExpression() {
    let result = [];

    // Evaluate the unary operators first
    for (let i = 0; i < this.expression.length; i += 4) {
      let preUnaryFunc = this.operatorFunctions[this.expression[i]];
      let operand = Number(this.expression[i + 1] ?? 0);
      let postUnaryFunc = this.operatorFunctions[this.expression[i + 2]];

      if (preUnaryFunc) operand = preUnaryFunc(operand);
      if (postUnaryFunc) operand = postUnaryFunc(operand);

      result.push(operand, this.expression[i + 3]);
    }

    // Evaluate binary operators by precedence
    this.tokenTypes.binaryPrecedence.forEach((operators) => {
      for (let i = 0; i < result.length; ) {
        let binaryFunc = this.operatorFunctions[result[i + 1]];

        if (operators.includes(result[i + 1]) && binaryFunc) {
          let [operand1, operator, operand2] = result.splice(i, 3);
          result.splice(i, 0, binaryFunc(operand1, operand2));
        } else i += 2;
      }
    });

    return result[0];
  },
};
