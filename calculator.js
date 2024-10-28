const PRE_UNARY_POS = 0;
const OPERAND_POS = 1;
const POST_UNARY_POS = 2;
const BINARY_POS = 3;

const calculator = {
  operatorFunctions: {
    "+": (num1, num2 = 0) => num1 + num2,
    "-": (num1, num2) => (num2 == undefined ? -num1 : num1 - num2),
    "*": (num1, num2 = 1) => num1 * num2,
    "/": (num1, num2 = 1) => num1 / num2,
    "%": (num = 0) => num / 100,
  },

  preUnaryOperators: ["+", "-"],
  postUnaryOperators: ["%"],
  // By default, preUnary operators are evaluated before postUnary operators.
  // Any postUnary operator inside this array will be evaluated before preUnary operators
  postUnaryPrecedence: [],
  binaryOperators: [
    ["*", "/"],
    ["+", "-"],
  ],
  /* How the algorithm works: 
  A token is the smallest unit in an expression eg +, 1, 50, %, **
  Expressions are stored as an array of tokens in the following format:
    [
      preUnaryOperator, operand, postUnaryOperator, binaryOperator,
      preUnaryOperator, operand, postUnaryOperator, binaryOperator...
    ]
    where preUnary (eg +) and postUnary (eg % i.e percentage) are optional

  POSITION MATTERS! all token must be stored in the same repeating position in the array
    preUnaryOperators must be in 0 index position OR in expression.length % 4 == 0 index position
    operands must be in 1 index position OR in expression.length % 4 == 1 index position
    and so on...

    that means:
      a preUnary must follow a binary or nothing (at the beginning of the expression array)
      an operand must follow a preunary or binary (if following a binary, preunary becomes empty)
      a postUnary must follow an operand
      an binary must follow a postunary or operand (if following an operand, postunary becomes empty)

    if a token is optional (ie preUnary and postUnary), an empty string ("") should be placed in its position
  */
  expression: [],
  history: [],

  isOperand(token) {
    return /^\d*\.?\d*$/.test(token);
  },
  isPreUnary(token) {
    return this.preUnaryOperators.includes(token);
  },
  isPostUnary(token) {
    return this.postUnaryOperators.includes(token);
  },
  isBinary(token) {
    return this.binaryOperators.flat().includes(token);
  },
  isToken(token) {
    return (
      this.isOperand(token) ||
      this.isPreUnary(token) ||
      this.isPostUnary(token) ||
      this.isBinary(token)
    );
  },

  addToken(token) {
    if (this.isPreUnary(token)) this.addPreUnary(token);
    if (this.isOperand(token)) this.addOperand(token);
    if (this.isPostUnary(token)) this.addPostUnary(token);
    if (this.isBinary(token)) this.addBinary(token);
  },

  addPreUnary(token) {
    const nextPosition = this.expression.length % 4;

    if (nextPosition == PRE_UNARY_POS) {
      this.expression.push(token);
    } else if (nextPosition == OPERAND_POS) {
      this.expression[this.expression.length - 1] = token;
    }
  },

  addOperand(token) {
    const nextPosition = this.expression.length % 4;

    if (token == "." && !this.expression.at(-1)) token = "0.";
    if (token == "." && this.expression.at(-1).includes(".")) return;

    if (nextPosition == PRE_UNARY_POS) {
      this.addPreUnary("");
      this.expression.push(token);
    } else if (nextPosition == OPERAND_POS) {
      this.expression.push(token);
    } else if (nextPosition == POST_UNARY_POS) {
      this.expression[this.expression.length - 1] += token;
    }
  },

  addPostUnary(token) {
    const nextPosition = this.expression.length % 4;

    if (nextPosition == POST_UNARY_POS) {
      this.expression.push(token);
    } else if (nextPosition == BINARY_POS) {
      this.expression[this.expression.length - 1] = token;
    }
  },

  addBinary(token) {
    const nextPosition = this.expression.length % 4;

    if (nextPosition == POST_UNARY_POS) {
      this.addPostUnary("");
      this.expression.push(token);
    } else if (nextPosition == BINARY_POS) {
      this.expression.push(token);
    } else if (nextPosition == PRE_UNARY_POS) {
      this.expression[this.expression.length - 1] = token;
    }
  },

  deleteExpression() {
    if (this.expression.length == 0) return;
    let lastToken = this.expression.pop();

    if (lastToken == "") return this.deleteExpression();

    this.expression.push(lastToken.slice(0, -1));
    while (this.expression.at(-1) == "") this.expression.pop();
  },

  clearExpression() {
    this.history.push(this.expression);
    this.expression = [];
  },

  evaluateUnaryOperators(expressionArray) {
    const result = [];

    for (let i = 0; i < expressionArray.length; i += 4) {
      let preUnaryFunc = this.operatorFunctions[expressionArray[i]];
      let operand = Number(expressionArray[i + 1]);
      let postUnaryFunc = this.operatorFunctions[expressionArray[i + 2]];

      const evalPostUnaryFirst = this.postUnaryPrecedence.includes(
        expressionArray[i + 2]
      );

      if (preUnaryFunc && !evalPostUnaryFirst) operand = preUnaryFunc(operand);
      if (postUnaryFunc) operand = postUnaryFunc(operand);
      if (preUnaryFunc && evalPostUnaryFirst) operand = preUnaryFunc(operand);

      result.push(operand, expressionArray[i + 3]);
    }

    return result;
  },

  evaluateBinaryOperators(expressionArray) {
    const result = [...expressionArray];

    this.binaryOperators.forEach((operators) => {
      for (let i = 0; i < result.length; ) {
        let binaryFunc = this.operatorFunctions[result[i + 1]];

        if (operators.includes(result[i + 1]) && binaryFunc) {
          let [operand1, operator, operand2] = result.splice(i, 3);
          result.splice(i, 0, binaryFunc(operand1, operand2));
        } else i += 2;
      }
    });

    return result;
  },

  calcExpression(decimalPlaces = 4) {
    if (this.expression.length == 0) return 0;

    // reducedExpression becomes in the format [operand, binaryOpertor, operand, ...]
    let reducedExpression = this.evaluateUnaryOperators(this.expression);

    let result = this.evaluateBinaryOperators(reducedExpression);

    const roundedOffResult = result[0].toFixed(decimalPlaces);
    return roundedOffResult.length > String(result[0]).length
      ? result[0]
      : result[0].toFixed(decimalPlaces);
  },
};

function updateDisplay() {
  document.querySelector(".expression").textContent =
    calculator.expression.join("");

  document.querySelector(".history").textContent = calculator.history
    .at(-1)
    ?.join("");
}

document.querySelector(".calculator").addEventListener("click", (e) => {
  if (e.target.nodeName !== "BUTTON") return;

  const btnValue = e.target.dataset.value;

  if (calculator.isToken(btnValue)) {
    calculator.addToken(btnValue);
  }

  if (btnValue == "=") {
    const result = calculator.calcExpression();
    calculator.clearExpression();
    calculator.addToken(String(result));
  }

  if (btnValue == "del") {
    calculator.deleteExpression();
  }

  if (btnValue == "clear") {
    calculator.clearExpression();
  }

  updateDisplay();
});

document.querySelector(".history").addEventListener("click", () => {
  if (calculator.history.length == 0) return;

  calculator.expression = calculator.history.pop();
  updateDisplay();
});
