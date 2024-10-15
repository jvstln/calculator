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
};
