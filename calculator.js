const operators = {
  '+': add,
  '-': subtract,
  '*': multiply,
  '/': divide,
}

function add(...numbers)  {
  return numbers.reduce((sum, number) => sum + number, 0);
}

function subtract(...numbers)  {
  if (numbers.length == 0) return 0;
  return numbers.reduce((difference, number) => difference - number);
}

function multiply(...numbers) {
  return numbers.reduce((product, number) => product * number, 1);
}

function divide(...numbers) {
  if (numbers.length == 0) return 0;
  return numbers.reduce((quotient, number) => quotient / number);
}

function operate(operator, ...numbers) {
  return operators[operator]?.(...numbers)
}
