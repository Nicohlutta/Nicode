// Calculator State Variables
let currentNumber = '0';
let previousNumber = null;
let selectedOperation = null;
let waitingForOperand = false;
let justCalculated = false;

// Get display element
const display = document.getElementById('display');

// Update display function
function updateDisplay() {
    display.textContent = currentNumber;
}

// Clear all function
function clearAll() {
    currentNumber = '0';
    previousNumber = null;
    selectedOperation = null;
    waitingForOperand = false;
    justCalculated = false;
    updateDisplay();
}

// Input number function
function inputNumber(num) {
    if (waitingForOperand) {
        currentNumber = num;
        waitingForOperand = false;
    } else {
        if (justCalculated) {
            currentNumber = num;
            justCalculated = false;
        } else {
            currentNumber = currentNumber === '0' ? num : currentNumber + num;
        }
    }
    updateDisplay();
}

// Input decimal function with validation
function inputDecimal() {
    if (waitingForOperand) {
        currentNumber = '0.';
        waitingForOperand = false;
    } else if (justCalculated) {
        currentNumber = '0.';
        justCalculated = false;
    } else if (currentNumber.indexOf('.') === -1) {
        currentNumber += '.';
    }
    updateDisplay();
}

// Arithmetic operation functions
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        throw new Error('Division by zero');
    }
    return a / b;
}

// Calculate function with error handling
function calculate(firstOperand, secondOperand, operation) {
    try {
        let result;
        switch (operation) {
            case '+':
                result = add(firstOperand, secondOperand);
                break;
            case '-':
                result = subtract(firstOperand, secondOperand);
                break;
            case '*':
                result = multiply(firstOperand, secondOperand);
                break;
            case '/':
                result = divide(firstOperand, secondOperand);
                break;
            default:
                throw new Error('Invalid operation');
        }
        
        // Handle very large or very small numbers
        if (!isFinite(result)) {
            throw new Error('Result is too large');
        }
        
        // Round to prevent floating point precision issues
        result = Math.round(result * 100000000) / 100000000;
        
        return result.toString();
    } catch (error) {
        return 'Error';
    }
}

// Perform calculation
function performCalculation() {
    const prev = parseFloat(previousNumber);
    const current = parseFloat(currentNumber);
    
    if (isNaN(prev) || isNaN(current)) {
        return;
    }
    
    currentNumber = calculate(prev, current, selectedOperation);
    selectedOperation = null;
    previousNumber = null;
    waitingForOperand = true;
    justCalculated = true;
    updateDisplay();
}

// Handle operation input
function inputOperation(nextOperation) {
    const inputValue = parseFloat(currentNumber);
    
    if (previousNumber === null) {
        previousNumber = inputValue;
    } else if (selectedOperation) {
        const currentValue = previousNumber || 0;
        const newValue = calculate(currentValue, inputValue, selectedOperation);
        
        currentNumber = newValue;
        previousNumber = parseFloat(newValue);
        updateDisplay();
    }
    
    waitingForOperand = true;
    selectedOperation = nextOperation;
    justCalculated = false;
}

// Event listeners for number buttons
document.getElementById('zero').addEventListener('click', () => inputNumber('0'));
document.getElementById('one').addEventListener('click', () => inputNumber('1'));
document.getElementById('two').addEventListener('click', () => inputNumber('2'));
document.getElementById('three').addEventListener('click', () => inputNumber('3'));
document.getElementById('four').addEventListener('click', () => inputNumber('4'));
document.getElementById('five').addEventListener('click', () => inputNumber('5'));
document.getElementById('six').addEventListener('click', () => inputNumber('6'));
document.getElementById('seven').addEventListener('click', () => inputNumber('7'));
document.getElementById('eight').addEventListener('click', () => inputNumber('8'));
document.getElementById('nine').addEventListener('click', () => inputNumber('9'));

// Event listeners for operation buttons
document.getElementById('add').addEventListener('click', () => inputOperation('+'));
document.getElementById('subtract').addEventListener('click', () => inputOperation('-'));
document.getElementById('multiply').addEventListener('click', () => inputOperation('*'));
document.getElementById('divide').addEventListener('click', () => inputOperation('/'));

// Event listener for equals button
document.getElementById('equals').addEventListener('click', performCalculation);

// Event listener for clear button
document.getElementById('clear').addEventListener('click', clearAll);

// Event listener for decimal button
document.getElementById('decimal').addEventListener('click', inputDecimal);

// Keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    // Prevent default behavior for calculator keys
    if ('0123456789+-*/.=cC'.includes(key) || key === 'Enter' || key === 'Escape') {
        event.preventDefault();
    }
    
    // Handle number keys
    if (key >= '0' && key <= '9') {
        inputNumber(key);
    }
    
    // Handle operation keys
    switch (key) {
        case '+':
            inputOperation('+');
            break;
        case '-':
            inputOperation('-');
            break;
        case '*':
            inputOperation('*');
            break;
        case '/':
            inputOperation('/');
            break;
        case '=':
        case 'Enter':
            performCalculation();
            break;
        case '.':
            inputDecimal();
            break;
        case 'c':
        case 'C':
        case 'Escape':
            clearAll();
            break;
    }
});

// Visual feedback for button presses
function addButtonFeedback() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mousedown', () => {
            button.style.transform = 'translateY(2px)';
            button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = '';
            button.style.boxShadow = '';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
            button.style.boxShadow = '';
        });
    });
}

// Initialize the calculator
function initCalculator() {
    updateDisplay();
    addButtonFeedback();
    
    // Add visual indicator for active operation
    const operationButtons = document.querySelectorAll('.btn-operation');
    
    operationButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all operation buttons
            operationButtons.forEach(btn => btn.classList.remove('active-operation'));
            
            // Add active class to clicked button if an operation is selected
            if (selectedOperation) {
                button.classList.add('active-operation');
            }
        });
    });
    
    // Remove active operation styling when equals or clear is pressed
    document.getElementById('equals').addEventListener('click', () => {
        operationButtons.forEach(btn => btn.classList.remove('active-operation'));
    });
    
    document.getElementById('clear').addEventListener('click', () => {
        operationButtons.forEach(btn => btn.classList.remove('active-operation'));
    });
}

// Add CSS for active operation styling
const style = document.createElement('style');
style.textContent = `
    .active-operation {
        background: #f39c12 !important;
        transform: translateY(-1px) !important;
    }
`;
document.head.appendChild(style);

// Start the calculator when the page loads
document.addEventListener('DOMContentLoaded', initCalculator);

// Error handling for unexpected errors
window.addEventListener('error', (event) => {
    console.error('Calculator error:', event.error);
    currentNumber = 'Error';
    updateDisplay();
    setTimeout(() => {
        clearAll();
    }, 2000);
});
