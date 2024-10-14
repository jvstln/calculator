const operatorFunctions = {
  "+": (num1 = 0, num2 = 0) => num1 + num2,
  "-": (num1 = 0, num2 = 0) => num1 - num2,
  "*": (num1 = 0, num2 = 1) => num1 * num2,
  "/": (num1 = 0, num2 = 1) => num1 / num2,
};

let numbers = [];
let operators = [];
let history = { numbers: [], operators: [] };

function addNumber(number) {
  if (numbers.length == operators.length) {
    numbers.push("");
  }

  // Filters and checks before adding number to entry
  const currentNumberToken = numbers[number.length - 1];
  if (
    number === "." &&
    (currentNumberToken.includes(".") || currentNumberToken == "")
  ) {
    return;
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

function reduceExpression() {
  const operator = operators.shift();
  const number1 = numbers.shift();
  const number2 = numbers.shift();
  const operatorFunc = operatorFunctions[operator];

  const reducedToken = operatorFunc(Number(number1), Number(number2));
  numbers.unshift(reducedToken);
}

function calculateExpression() {
  const numbersCopy = [...numbers];
  const operatorsCopy = [...operators];

  while (operators.length) reduceExpression();

  if (isNaN(numbers[0])) {
    alert("Invalid Expression!");
    numbers = numbersCopy;
    operators = operatorsCopy;
  } else {
    history = { numbers: numbersCopy, operators: operatorsCopy };
    updateHistory();
  }
}

function deleteExpression() {
  const longestArr = numbers.length > operators.length ? numbers : operators;

  const token = String(longestArr.pop() ?? "");
  const slicedToken =
    token == "Infinity" || token == "-Infinity" ? "" : token.slice(0, -1);

  if (slicedToken) longestArr.push(slicedToken);
}

function clearExpression() {
  numbers = [];
  operators = [];
}

function getExpression(numbers, operators) {
  let expression = "";

  for (let i = 0; i < numbers.length; i++) {
    expression += `${numbers[i] ?? ""}${operators[i] ?? ""}`;
  }

  return expression;
}

function updateDisplay() {
  document.querySelector("#display").value = getExpression(numbers, operators);
}

function updateHistory() {
  document.querySelector("#history").textContent = getExpression(
    history.numbers,
    history.operators
  );
}

function restoreHistory() {
  if (history.numbers.length == 0) return;

  numbers = history.numbers;
  operators = history.operators;
  updateDisplay();
}

document.querySelector(".digits").addEventListener("click", (e) => {
  if (e.target.nodeName !== "BUTTON") return;

  addNumber(e.target.dataset.value);
  updateDisplay();
});

document.querySelector(".operators").addEventListener("click", (e) => {
  if (e.target.nodeName !== "BUTTON") return;

  if (e.target.id === "equal") {
    calculateExpression();
  } else if (e.target.id === "clear") {
    clearExpression();
  } else if (e.target.id === "delete") {
    deleteExpression();
  } else {
    addOperator(e.target.dataset.value);
  }

  updateDisplay();
});

document.querySelector("#history").addEventListener("click", restoreHistory);
