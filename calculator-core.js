const MAX_LENGTH = 12;

export const initialState = Object.freeze({
  current: "0",
  previous: null,
  operator: null,
  overwrite: false,
});

export function createState(overrides = {}) {
  return { ...initialState, ...overrides };
}

export function inputDigit(state, digit) {
  if (!/[0-9]/.test(digit)) {
    return state;
  }

  if (state.overwrite) {
    return {
      ...state,
      current: digit,
      overwrite: false,
    };
  }

  if (state.current === "0") {
    return {
      ...state,
      current: digit,
    };
  }

  if (state.current.replace("-", "").length >= MAX_LENGTH) {
    return state;
  }

  return {
    ...state,
    current: state.current + digit,
  };
}

export function inputDecimal(state) {
  if (state.overwrite) {
    return {
      ...state,
      current: "0.",
      overwrite: false,
    };
  }

  if (state.current.includes(".")) {
    return state;
  }

  return {
    ...state,
    current: `${state.current}.`,
  };
}

export function toggleSign(state) {
  if (state.current === "0") {
    return state;
  }

  const next = state.current.startsWith("-")
    ? state.current.slice(1)
    : `-${state.current}`;

  return {
    ...state,
    current: next,
  };
}

export function percent(state) {
  const value = parseFloat(state.current);
  const next = formatNumber(value / 100);

  return {
    ...state,
    current: next,
    overwrite: true,
  };
}

export function clear() {
  return { ...initialState };
}

export function backspace(state) {
  if (state.overwrite) {
    return {
      ...state,
      current: "0",
      overwrite: false,
    };
  }

  const next =
    state.current.length <= 1 ||
    (state.current.startsWith("-") && state.current.length === 2)
      ? "0"
      : state.current.slice(0, -1);

  return {
    ...state,
    current: next,
  };
}

export function setOperator(state, operator) {
  if (!isOperator(operator)) {
    return state;
  }

  if (state.operator && !state.overwrite) {
    const interim = evaluate(state);
    return {
      ...interim,
      operator,
      previous: interim.current,
      current: "0",
      overwrite: true,
    };
  }

  return {
    ...state,
    operator,
    previous: state.current,
    current: "0",
    overwrite: true,
  };
}

export function evaluate(state) {
  if (!state.operator || state.previous === null) {
    return state;
  }

  const a = parseFloat(state.previous);
  const b = parseFloat(state.current);
  let result;

  switch (state.operator) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "*":
      result = a * b;
      break;
    case "/":
      if (b === 0) {
        result = NaN;
        break;
      }
      result = a / b;
      break;
    default:
      return state;
  }

  return {
    current: formatNumber(result),
    previous: null,
    operator: null,
    overwrite: true,
  };
}

export function getHistory(state) {
  if (!state.operator || state.previous === null) {
    return "";
  }

  return `${state.previous} ${operatorSymbol(state.operator)}`;
}

export function isOperator(value) {
  return value === "+" || value === "-" || value === "*" || value === "/";
}

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  const str = value.toPrecision(12);
  const normalized = parseFloat(str).toString();

  if (normalized.replace("-", "").replace(".", "").length > MAX_LENGTH) {
    return value.toExponential(6).replace(/\.0+/, "");
  }

  return normalized;
}

function operatorSymbol(operator) {
  switch (operator) {
    case "+":
      return "+";
    case "-":
      return "−";
    case "*":
      return "×";
    case "/":
      return "÷";
    default:
      return operator;
  }
}
