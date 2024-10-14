const operatorFunctions = {
  "+": (num1 = 0, num2 = 0) => num1 + num2,
  "-": (num1 = 0, num2 = 0) => num1 - num2,
  "*": (num1 = 0, num2 = 1) => num1 * num2,
  "/": (num1 = 0, num2 = 1) => num1 / num2,
};

let numbers = [];
let operators = [];

function operate() {
  while (operators.length) {
    const operator = operators.shift();
    const number1 = numbers.shift();
    const number2 = numbers.shift();
    const operatorFunc = operatorFunctions[operator];

    if (operatorFunc == undefined) {
      return alert("Unsupported operator " + operator);
    }

    const result = operatorFunc(Number(number1), Number(number2));
    numbers.unshift(result);
  }
}

function addNumber(number) {
  if (numbers.length == operators.length) {
    numbers.push("");
  }

  numbers[numbers.length - 1] += number;
}

function addOperator(operator) {
  if (operator == "" || numbers.length == 0) return;

  if (operators.length < numbers.length) {
    operators.push("");
  }

  operators[operators.length - 1] = operator;
}

function deleteExpression() {
  const longestArr = numbers.length > operators.length ? numbers : operators;
  const slicedToken = String(longestArr.pop() ?? "").slice(0, -1);

  if (slicedToken) longestArr.push(slicedToken);
}

function updateDisplay() {
  let expression = "";

  for (let i = 0; i < numbers.length; i++) {
    expression += `${numbers[i] ?? ""}${operators[i] ?? ""}`;
  }

  document.querySelector("#display").value = expression;
}

document.querySelector(".digits").addEventListener("click", (e) => {
  if (e.target.nodeName !== "BUTTON") return;

  addNumber(e.target.dataset.value);
  updateDisplay();
});

document.querySelector(".operators").addEventListener("click", (e) => {
  if (e.target.nodeName !== "BUTTON") return;

  if (e.target.id === "equal") {
    operate();
  } else if (e.target.id === "clear") {
    numbers = [];
    operators = [];
  } else if (e.target.id === "delete") {
    deleteExpression();
  } else {
    addOperator(e.target.dataset.value);
  }

  updateDisplay();
});
