const operatorFunctions = {
  "+": (num1 = 0, num2 = 0) => num1 + num2,
  "-": (num1 = 0, num2 = 0) => num1 - num2,
  "*": (num1 = 0, num2 = 1) => num1 * num2,
  "/": (num1 = 0, num2 = 1) => num1 / num2,
};

let numbers = [];
let operators = [];
let history = [];

function operate() {
  history = [[...numbers], [...operators]];
  updateHistory();

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

  if (isNaN(numbers[0])) {
    alert(`Invalid result, check your expression`);
  } else if (!Number.isInteger(numbers[0])) {
    numbers[0] = numbers[0].toFixed(3);
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

  const token = String(longestArr.pop() ?? "");
  const slicedToken =
    token == "Infinity" || token == "-Infinity" ? "" : token.slice(0, -1);

  if (slicedToken) longestArr.push(slicedToken);
}

function clearExpression() {
  numbers = [];
  operators = [];
}

function getExpression() {
  let expression = "";

  for (let i = 0; i < numbers.length; i++) {
    expression += `${numbers[i] ?? ""}${operators[i] ?? ""}`;
  }

  return expression;
}

function updateDisplay() {
  document.querySelector("#display").value = getExpression();
}

function updateHistory() {
  document.querySelector("#history").value = getExpression();
  document.querySelector("#history").style.borderColor = "gray";
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
    clearExpression();
  } else if (e.target.id === "delete") {
    deleteExpression();
  } else {
    addOperator(e.target.dataset.value);
  }

  updateDisplay();
});
