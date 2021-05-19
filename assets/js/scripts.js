const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const numberButtons = $$("button[data-number]");
const operationButtons = $$("button[data-operation]");
const equalButton = $("button[data-equal]");
const deleteButton = $("button[data-delete]");
const allClearButton = $("button[data-all-clear]");
const currentClearButton = $("button[data-current-clear]");
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
        currentClearButton,
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
    this.currentClearButton =
      currentClearButton || $("button[data-current-clear]");
    this.isCompleteCompute = false;
    this.isNegative = false;
    this.count = 0;
    this.previousCalculation = "";
    this.currentCalculation = "";
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
        this.compute(false);
      });
    });
    this.equalButton.addEventListener("click", () => {
      this.compute(true);
    });
    this.allClearButton.addEventListener("click", () => {
      this.clear();
    });
    this.deleteButton.addEventListener("click", () => {
      this.delete();
    });
    this.currentClearButton.addEventListener("click", () => {
      this.clearCurrent();
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
          const keyOperation = e.key === "/" ? "÷" : e.key;
          this.chooseOperation(keyOperation);
          this.compute(false);
          break;
        case "`":
          this.appendNumber("+/-");
          break;
        case ".":
          this.appendNumber(e.key);
          break;
        case "Enter":
          this.compute(true);
          break;
        case "Backspace":
        case "Delete":
          this.delete();
          break;
        case " ":
          this.clearCurrent();

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
    this.previousCalculation = "";
    this.currentCalculation = "";
    this.isCompleteCompute = false;
    this.count = 0;
    this.updateDisplay();
  }
  //Hàm xóa giá trị hiện tại khi đang thực hiện phép tính
  clearCurrent() {
    if (this.isCompleteCompute) {
      this.previousCalculation = "";
      this.currentCalculation = "";
      this.isCompleteCompute = false;
    }
    this.currentOperand = "0";
    this.count = 0;
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
    // console.log(this.currentOperand);
    // this.previousCalculation;
    if (
      number === "+/-" &&
      !!parseFloat(this.currentOperand) &&
      !this.isCompleteCompute
    ) {
      // console.log(this.currentOperand, this.count);

      this.count += 1;
      this.isNegative = true;
      // console.log(this.currentOperand);
      if (this.count % 2 === 1) {
        // console.log("Negative");
        this.currentOperand = `-${this.currentOperand.toString()}`;
      } else {
        // console.log("Positive");
        this.currentOperand.includes("-")
          ? (this.currentOperand = this.currentOperand.slice(1))
          : (this.currentOperand = this.currentOperand);
      }
      if (number === "." && this.currentOperand.includes(".")) return;
      this.currentOperand = this.currentOperand.toString();
      this.updateDisplay();
    } else if (number !== "+/-") {
      if (this.isCompleteCompute && !this.operation) {
        this.clear();
        this.isCompleteCompute = false;
        this.isNegative = false;
      }
      if (number === "." && this.currentOperand.includes(".")) return;
      this.currentOperand = this.currentOperand.toString() + number;
      // console.log(this.currentOperand);
      if (/^0+[1-9]+/.test(this.currentOperand)) {
        this.currentOperand = this.currentOperand.replace(/^0+/, "");
      }
      this.updateDisplay();
    }
  }
  // Hàm chọn phép tính
  chooseOperation(operation) {
    this.count = 0;
    // if (this.currentOperand === "") {
    //   console.log(operation);
    //   // this.operation = this.operation;
    // }
    if (this.previousOperand !== "") {
      this.compute(false);
    }
    this.previousOperand = this.operation
      ? this.previousOperand
      : this.currentOperand;

    this.operation = operation;
    if (this.operation) {
      this.currentOperand = "";
    }
    this.updateDisplay();
  }
  //Hàm tính toán
  compute(isCompleteCompute) {
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
      case "÷":
        result = prevNumber / currentNumber;
        break;
      default:
        return;
    }
    if (!this.previousCalculation) {
      this.previousCalculation += `${parseFloat(this.previousOperand)} ${
        this.operation
      } ${parseFloat(this.currentOperand)}`;
    } else {
      this.previousCalculation += ` ${this.operation} ${parseFloat(
        this.currentOperand
      )}`;
    }
    this.currentOperand = result;
    this.currentCalculation = result;
    this.previousOperand = "";
    this.operation = undefined;
    this.isCompleteCompute = isCompleteCompute;
    this.updateDisplay();
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
      return `${result}.${decimalDigits}`;
    } else {
      return result;
    }
  }
  //Cập nhật hiển thị giá trị của các số
  updateDisplay() {
    // console.log("updating...", this.currentOperand);
    // console.log(
    //   this.currentCalculation,
    //   this.previousOperand,
    //   this.currentOperand,
    //   this.operation
    // );
    if (!this.currentOperand) {
      this.currentOperandTextElem.innerText = this.formatNumber(
        this.currentCalculation
      );
    } else {
      if (this.isCompleteCompute) {
        this.currentOperandTextElem.innerText = `= ${this.formatNumber(
          this.currentOperand
        )}`;
      } else {
        this.currentOperandTextElem.innerText = `${this.formatNumber(
          this.currentOperand
        )}`;
      }
    }

    if (this.previousCalculation) {
      this.previousOperandTextElem.innerText = `${this.previousCalculation} ${
        this.operation ? this.operation : ""
      }`;
    } else {
      if (this.operation) {
        this.previousOperandTextElem.innerText = `${parseFloat(
          this.formatNumber(this.previousOperand)
        )} ${this.operation}`;
      } else {
        this.previousOperandTextElem.innerText = this.formatNumber(
          this.previousOperand
        );
      }
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
