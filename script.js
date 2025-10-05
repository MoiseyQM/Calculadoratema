import {
  createState,
  inputDigit,
  inputDecimal,
  toggleSign,
  percent,
  clear,
  backspace,
  setOperator,
  evaluate,
  getHistory,
} from "./calculator-core.js";

const keypad = document.querySelector(".keypad");
const output = document.getElementById("output");
const displayTrail = document.getElementById("history");
const themeSelect = document.getElementById("theme-select");
const historyList = document.getElementById("history-list");
const historyEmpty = document.getElementById("history-empty");
const clearHistoryButton = document.getElementById("clear-history");

const THEME_STORAGE_KEY = "calculator-theme";
let state = createState();
let operations = [];

initialize();

function initialize() {
  applyStoredTheme();
  updateDisplay();
  renderHistory();

  keypad?.addEventListener("click", handleKeypadClick);
  document.addEventListener("keydown", handleKeydown);
  themeSelect?.addEventListener("change", (event) => {
    applyTheme(event.target.value);
  });
  clearHistoryButton?.addEventListener("click", () => {
    operations = [];
    renderHistory();
  });
}

function handleKeypadClick(event) {
  const target = event.target;
  if (!target.closest(".key")) {
    return;
  }

  event.preventDefault();

  const action = target.dataset.action;
  const value = target.dataset.value;

  if (action === "clear") {
    state = clear();
    updateDisplay();
    return;
  }

  if (action === "backspace") {
    state = backspace(state);
    updateDisplay();
    return;
  }

  if (action === "sign") {
    state = toggleSign(state);
    updateDisplay();
    return;
  }

  if (action === "percent") {
    state = percent(state);
    updateDisplay();
    return;
  }

  if (action === "operator" && value) {
    state = setOperator(state, value);
    updateDisplay();
    return;
  }

  if (action === "evaluate") {
    handleEvaluate();
    return;
  }

  if (value === ".") {
    state = inputDecimal(state);
    updateDisplay();
    return;
  }

  if (value && /[0-9]/.test(value)) {
    state = inputDigit(state, value);
    updateDisplay();
  }
}

function handleKeydown(event) {
  const { key } = event;

  if (/[0-9]/.test(key)) {
    event.preventDefault();
    state = inputDigit(state, key);
    updateDisplay();
    animateKey(key);
    return;
  }

  if (key === "." || key === ",") {
    event.preventDefault();
    state = inputDecimal(state);
    updateDisplay();
    animateKey(".");
    return;
  }

  if (key === "Enter" || key === "=") {
    event.preventDefault();
    handleEvaluate();
    animateAction("evaluate");
    return;
  }

  if (key === "Backspace") {
    event.preventDefault();
    state = backspace(state);
    updateDisplay();
    animateAction("backspace");
    return;
  }

  if (key === "%") {
    event.preventDefault();
    state = percent(state);
    updateDisplay();
    animateAction("percent");
    return;
  }

  if (key === "-" && !event.shiftKey) {
    event.preventDefault();
    state = setOperator(state, "-");
    updateDisplay();
    animateOperator("-");
    return;
  }

  if ((key === "+" && event.shiftKey) || key === "+") {
    event.preventDefault();
    state = setOperator(state, "+");
    updateDisplay();
    animateOperator("+");
    return;
  }

  if (key === "*" || (key === "x" && event.shiftKey)) {
    event.preventDefault();
    state = setOperator(state, "*");
    updateDisplay();
    animateOperator("*");
    return;
  }

  if (key === "/") {
    event.preventDefault();
    state = setOperator(state, "/");
    updateDisplay();
    animateOperator("/");
    return;
  }

  if (key === "F9") {
    event.preventDefault();
    state = toggleSign(state);
    updateDisplay();
    animateAction("sign");
  }
}

function handleEvaluate() {
  const snapshot = state;
  state = evaluate(state);
  updateDisplay();
  recordOperation(snapshot, state.current);
}

function updateDisplay() {
  output.textContent = state.current;
  const trail = getHistory(state);
  displayTrail.textContent = trail;
  displayTrail.hidden = trail.length === 0;
}

function recordOperation(previousState, result) {
  const trail = getHistory(previousState).trim();
  if (!trail) {
    return;
  }

  const expression = `${trail} ${previousState.current}`.trim();
  operations = [
    {
      expression,
      result,
      timestamp: Date.now(),
    },
    ...operations,
  ].slice(0, 20);

  renderHistory();
}

function renderHistory() {
  if (!historyList || !historyEmpty) {
    return;
  }

  if (operations.length === 0) {
    historyEmpty.hidden = false;
    historyList.hidden = true;
    historyList.innerHTML = "";
    return;
  }

  historyEmpty.hidden = true;
  historyList.hidden = false;
  historyList.innerHTML = operations
    .map(
      (entry) =>
        `<li><span>${entry.expression}</span><strong>${entry.result}</strong></li>`
    )
    .join("");
}

function animateKey(value) {
  const button = keypad?.querySelector(`.key[data-value="${value}"]`);
  if (!button) return;
  button.classList.add("key--active");
  setTimeout(() => button.classList.remove("key--active"), 120);
}

function animateAction(action) {
  const button = keypad?.querySelector(`.key[data-action="${action}"]`);
  if (!button) return;
  button.classList.add("key--active");
  setTimeout(() => button.classList.remove("key--active"), 120);
}

function animateOperator(operator) {
  const button = keypad?.querySelector(
    `.key[data-action="operator"][data-value="${operator}"]`
  );
  if (!button) return;
  button.classList.add("key--active");
  setTimeout(() => button.classList.remove("key--active"), 120);
}

function applyStoredTheme() {
  const preferred = getStoredTheme() || themeSelect?.value || "ocean";
  applyTheme(preferred);
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  if (themeSelect) {
    themeSelect.value = theme;
  }
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    // ignore storage errors (e.g., privacy mode)
  }
}

function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch (error) {
    return null;
  }
}
