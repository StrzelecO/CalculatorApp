let equalBtn;
let resetBtn;
let undoBtn;
let numberBtns;
let operatorBtns;
let errorMsg;
let display;

let isPreviousOperator = false;

const main = () => {
	prepareDOMElements();
	prepareDOMEvents();
};

const prepareDOMElements = () => {
	equalBtn = document.querySelector('.equal');
	resetBtn = document.querySelector('.reset');
	undoBtn = document.querySelector('.undo');
	errorMsg = document.querySelector('.error-info');
	display = document.querySelector('.display');
	btns = document.querySelectorAll('button:not(.reset):not(.equal):not(.undo)');
};

const prepareDOMEvents = () => {
	resetBtn.addEventListener('click', resetAll);
	equalBtn.addEventListener('click', calculate);
	undoBtn.addEventListener('click', undo);
	btns.forEach(btn => {
		btn.addEventListener('click', chceckIfValid);
	});
};

const chceckIfValid = e => {
	if (display.textContent.length == 16) return;

	let lastChar = display.textContent.slice(-1);
	const clickedChar = e.target.textContent;

	if (
		(lastChar == '.' || isPreviousOperator) &&
		(e.target.classList.contains('operator') || clickedChar == '.')
	)
		return;

	addToDisplay(e);
};

const addToDisplay = e => {
	if (display.textContent == '0 =') {
		e.target.classList.contains('operator')
			? (display.textContent = '0')
			: (display.textContent = '');
	}
	if (display.textContent.slice(-1) == '=') {
		if (e.target.classList.contains('operator'))
			display.textContent = display.textContent.slice(0, -2);
		else return;
	}

	errorMsg.style.visibility = 'hidden';
	display.textContent += e.target.textContent;

	e.target.classList.contains('operator')
		? (isPreviousOperator = true)
		: (isPreviousOperator = false);
};

const calculate = () => {
	if (
		display.textContent.slice(-1) != '=' &&
		display.textContent.slice(-1) != 'x'
	) {
		let unchenagedDisplay = display.textContent;
		display.textContent = display.textContent.replace(/x/g, '*');
		display.textContent = math.evaluate(display.textContent);

		if (display.textContent == 'Infinity' || display.textContent == 'NaN') {
			errorMsg.style.visibility = 'visible';
			display.textContent = unchenagedDisplay;
			return;
		}

		if (display.textContent.includes('.'))
			display.textContent = Number(parseFloat(display.textContent).toFixed(9));
		display.textContent += ' =';
	}
};

const undo = () => {
	const operators = ['/', 'x', '+', '-'];
	if (display.textContent.slice(-1) == '=') return;

	if (operators.includes(display.textContent.slice(-2)))
		isPreviousOperator = true;
	else isPreviousOperator = false;

	display.textContent = display.textContent.slice(0, -1);
	if (display.textContent.length == 0) display.textContent = '0 =';
};

const resetAll = () => {
	isPreviousOperator = false;
	display.textContent = '0 =';
	errorMsg.style.visibility = 'hidden';
};

document.addEventListener('DOMContentLoaded', main);
