document.addEventListener('DOMContentLoaded', () => {
    let currentOperand = '';
    let previousOperand = '';
    let operation = undefined;
    let shouldResetScreen = false;

    const currentOperandElement = document.querySelector('.current-operand');
    const previousOperandElement = document.querySelector('.previous-operand');
    const buttons = document.querySelectorAll('button');

    function updateDisplay() {
        currentOperandElement.textContent = formatDisplayNumber(currentOperand);
        if (operation != null) {
            previousOperandElement.textContent = `${formatDisplayNumber(previousOperand)} ${getOperationSymbol(operation)}`;
        } else {
            previousOperandElement.textContent = '';
        }
    }

    function formatDisplayNumber(number) {
        if (number === '') return '';
        const [integer, decimal] = number.split('.');
        const formattedInteger = new Intl.NumberFormat().format(integer);
        return decimal != null ? `${formattedInteger}.${decimal}` : formattedInteger;
    }

    function getOperationSymbol(operator) {
        switch (operator) {
            case '+': return '+';
            case '-': return '-';
            case '*': return '×';
            case '/': return '÷';
            default: return '';
        }
    }

    function appendNumber(number) {
        if (currentOperand === '0' || shouldResetScreen) {
            currentOperand = '';
            shouldResetScreen = false;
        }
        if (number === '.' && currentOperand.includes('.')) return;
        currentOperand += number;
    }

    function chooseOperation(op) {
        if (currentOperand === '') return;
        if (previousOperand !== '') {
            calculate();
        }
        operation = op;
        previousOperand = currentOperand;
        shouldResetScreen = true;
    }

    function calculate() {
        let computation;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    alert("Cannot divide by zero!");
                    clear();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        computation = Math.round(computation * 10000000000) / 10000000000;
        currentOperand = computation.toString();
        operation = undefined;
        previousOperand = '';
        shouldResetScreen = true;
    }

    function clear() {
        currentOperand = '0';
        previousOperand = '';
        operation = undefined;
    }

    function deleteChar() {
        currentOperand = currentOperand.toString().slice(0, -1);
        if (currentOperand === '') currentOperand = '0';
    }

    function percentage() {
        if (currentOperand === '0' || currentOperand === '') return;
        currentOperand = (parseFloat(currentOperand) / 100).toString();
    }

    function animateButton(button) {
        button.style.transform = 'scale(0.92)';
        setTimeout(() => {
            button.style.transform = '';
        }, 100);
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            animateButton(button);

            if (button.classList.contains('function')) {
                if (button.textContent === 'AC') clear();
                else if (button.textContent === 'C') deleteChar();
                else if (button.textContent === '%') percentage();
            } else if (button.classList.contains('operator')) {
                chooseOperation(button.textContent === '×' ? '*' :
                                button.textContent === '÷' ? '/' :
                                button.textContent);
            } else if (button.classList.contains('equals')) {
                calculate();
            } else {
                appendNumber(button.textContent);
            }

            updateDisplay();
        });
    });

    document.addEventListener('keydown', event => {
        if (/[0-9]/.test(event.key)) appendNumber(event.key);
        else if (event.key === '.') appendNumber('.');
        else if (event.key === '=' || event.key === 'Enter') calculate();
        else if (event.key === 'Backspace') deleteChar();
        else if (event.key === 'Escape') clear();
        else if (['+', '-', '*', '/'].includes(event.key)) chooseOperation(event.key);
        updateDisplay();
    });

    clear();
    updateDisplay();
});
