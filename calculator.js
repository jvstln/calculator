const operators = {
  "+": (num1 = 0, num2 = 0) => num1 + num2,
  "-": (num1 = 0, num2 = 0) => num1 - num2,
  "*": (num1 = 0, num2 = 1) => num1 * num2,
  "/": (num1 = 0, num2 = 1) => num1 / num2,
};

function operate(operator, ...numbers) {
  return operators[operator]?.(...numbers);
}

document.querySelector("digits");
