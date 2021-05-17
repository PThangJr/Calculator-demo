const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const numberButtons = $$("button[data-number]");
const operationButtons = $$("button[data-operation]");
const equalButton = $("button[data-equal]");
const deleteButton = $("button[data-delete]");
const allClearButton = $("button[data-all-clear]");
const previousOperandTextElem = $("[data-previous-operand]");
const currentOperandTextElem = $("[data-current-operand]");
class Calculator {
  constructor(options) {
    if (options) {
      var {
        previousOperandTextElem,
        currentOperandTextElem,
        numberButtons,
        operationButtons,
        equalButton,
        deleteButton,
        allClearButton,
      } = options;
    }
    this.currentOperandTextElem =
      currentOperandTextElem || $("[data-current-operand]");
    this.previousOperandTextElem =
      previousOperandTextElem || $("[data-previous-operand]");
    this.numberButtons = numberButtons || $$("button[data-number]");
    this.operationButtons = operationButtons || $$("button[data-operation]");
    this.equalButton = equalButton || $("button[data-equal]");
    this.deleteButton = deleteButton || $("button[data-delete]");
    this.allClearButton = allClearButton || $("button[data-all-clear]");
    this.isCompleteCompute = false;
    this.clear();
    this.start();
  }
  // Hàm chạy
  start() {
    this.numberButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.appendNumber(btn.innerText);
      });
    });
    this.operationButtons.forEach((operationBtn) => {
      operationBtn.addEventListener("click", () => {
        this.chooseOperation(operationBtn.innerText);
      });
    });
    this.equalButton.addEventListener("click", () => {
      this.compute();
    });
    this.allClearButton.addEventListener("click", () => {
      this.clear();
    });
    this.deleteButton.addEventListener("click", () => {
      this.delete();
    });
    this.handleKeyDown();
  }
  // Hàm bắt sự kiện keydown trên bàn phím
  handleKeyDown() {
    document.addEventListener("keydown", (e) => {
      const number = parseInt(e.key);
      //   if (!isNaN(number)) this.appendNumber(number);
      //   this.updateDisplay();
      switch (e.key) {
        case "+":
        case "-":
        case "*":
        case "/":
          this.isCompleteCompute = false;
          this.chooseOperation(e.key);
          break;
        case ".":
          this.appendNumber(e.key);
          break;
        case "Enter":
          this.compute();
          break;
        case "Backspace":
        case "Delete":
          this.delete();
          break;
        case "Escape":
          this.clear();
          break;
      }
      if (!isNaN(number)) {
        this.appendNumber(number);
      } else {
        return;
      }
    });
  }
  // Hàm xóa tất cả
  clear() {
    this.previousOperand = ""; // Giá trị trước khi thực hiện phép tính
    this.currentOperand = "0"; // Giá trị hiện tại
    this.operation = undefined; // Phép tính
    this.updateDisplay();
  }
  // Hàm xóa 1 phần tử cuối
  delete() {
    if (this.currentOperand === "0") return;
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
    this.updateDisplay();
  }
  //Hàm nhập số
  appendNumber(number) {
    // console.log(number);
    if (this.isCompleteCompute && !this.operation) {
      this.clear();
      this.isCompleteCompute = false;
      if (number === "." && this.currentOperand.includes(".")) return;
      this.currentOperand = this.currentOperand.toString() + number;
      this.updateDisplay();
    } else {
      if (number === "." && this.currentOperand.includes(".")) return;
      this.currentOperand = this.currentOperand.toString() + number;
      this.updateDisplay();
    }
  }
  // Hàm chọn phép tính
  chooseOperation(operation) {
    if (this.currentOperand === "") return;
    if (this.previousOperand !== "") {
      this.compute();
    }
    this.previousOperand = this.deleteZerosNumberEnd(this.currentOperand);
    this.operation = operation;
    this.currentOperand = "";
    this.updateDisplay();
  }
  //Hàm tính toán
  compute() {
    // console.log("computing...");
    let result;
    const prevNumber = parseFloat(this.previousOperand);
    const currentNumber = parseFloat(this.currentOperand);

    if (isNaN(prevNumber) || isNaN(currentNumber)) return;
    if (!this.operation) return;
    switch (this.operation) {
      case "+":
        result = prevNumber + currentNumber;
        break;
      case "-":
        result = prevNumber - currentNumber;
        break;
      case "*":
        result = prevNumber * currentNumber;
        break;
      case "/":
        result = prevNumber / currentNumber;
        break;
      default:
        return;
    }
    this.currentOperand = result;
    this.previousOperand = "";
    this.operation = undefined;
    this.updateDisplay();
    this.isCompleteCompute = true;
  }
  // Format định dạng số 1000 => 1,000 || 100000 => 100,000
  formatNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]); // Tách phần số nguyên
    const decimalDigits = stringNumber.split(".")[1]; // Tách phần số thập phân
    let result;
    if (isNaN(integerDigits)) {
      result = "";
    } else {
      result = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }
    if (decimalDigits != null) {
      //   const isHaveZeroNumberEnd = /0+$/.test(decimalDigits);
      //   console.log(isHaveZeroNumberEnd);
      //   if (isHaveZeroNumberEnd) {
      //     decimalDigits.replace(/0+$/, "");
      //   }
      //   console.log(decimalDigits);
      return `${result}.${decimalDigits}`;
    } else {
      return result;
    }
  }
  //Xóa số 0 ở cuối nếu số đó là số thập phân
  deleteZerosNumberEnd(number) {
    if (/\.0+$/.test(number)) {
      return number.replace(/\.0+$/, "");
    }
    return number;
  }
  //Cập nhật hiển thị giá trị của các số
  updateDisplay() {
    // console.log("updating...", this.currentOperand);
    this.currentOperandTextElem.innerText = this.formatNumber(
      this.currentOperand
    );
    if (this.operation) {
      this.previousOperandTextElem.innerText = `${this.formatNumber(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.previousOperandTextElem.innerText = this.formatNumber(
        this.previousOperand
      );
    }
  }
}

// const calculator = new Calculator({
//   previousOperandTextElem,
//   currentOperandTextElem,
//   numberButtons,
//   operationButtons,
//   equalButton,
//   deleteButton,
//   allClearButton,
// });
const cal = new Calculator();
