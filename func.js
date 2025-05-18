document.addEventListener("DOMContentLoaded", () => {
  const prevDisplayElement = document.querySelector(".prev-display")
  const currDisplayElement = document.querySelector(".curr-display")
  const errorMessageElement = document.querySelector(".error-message")
  const calculatorElement = document.querySelector(".calculator")
  const outputElement = document.querySelector(".output")
  const numberButtons = document.querySelectorAll("[data-number]")
  const operationButtons = document.querySelectorAll("[data-operation]")
  const equalsButton = document.querySelector(".equals")
  const clearButton = document.querySelector(".clear")
  const deleteButton = document.querySelector(".delete")
  const switchModeButton = document.querySelector(".switch-mode")
  const scientificDiv = document.querySelector(".scientific")
  const themeToggleBtn = document.getElementById("theme-toggle-btn")
  const body = document.body

  let currentOperand = "0"
  let previousOperand = ""
  let operation = undefined
  let shouldResetScreen = false
  let errorTimeout = null

  function showError(message) {
    if (errorTimeout) {
      clearTimeout(errorTimeout)
    }

    
    errorMessageElement.textContent = message
    errorMessageElement.classList.add("show")

    
    calculatorElement.classList.add("shake")

   
    setTimeout(() => {
      calculatorElement.classList.remove("shake")
    }, 500)

    
    errorTimeout = setTimeout(() => {
      errorMessageElement.classList.remove("show")
      errorTimeout = null
    }, 3000)
  }

  
  function loadThemePreference() {
    const savedTheme = localStorage.getItem("calculatorTheme")
    if (savedTheme === "light") {
      body.classList.add("light-theme")
    } else {
      body.classList.remove("light-theme")
    }
  }

  
  function toggleTheme() {
    body.classList.toggle("light-theme")

    
    if (body.classList.contains("light-theme")) {
      localStorage.setItem("calculatorTheme", "light")
    } else {
      localStorage.setItem("calculatorTheme", "dark")
    }
  }

  
  function updateDisplay() {
    currDisplayElement.textContent = formatDisplayNumber(currentOperand)
    if (operation != null) {
      prevDisplayElement.textContent = `${formatDisplayNumber(previousOperand)} ${operation}`
    } else {
      prevDisplayElement.textContent = ""
    }
  }

  
  function formatDisplayNumber(number) {
    const stringNumber = number.toString()
    const integerDigits = Number.parseFloat(stringNumber.split(".")[0])
    const decimalDigits = stringNumber.split(".")[1]

    let integerDisplay
    if (isNaN(integerDigits)) {
      integerDisplay = ""
    } else {
      integerDisplay = integerDigits.toLocaleString("en", { maximumFractionDigits: 0 })
    }

    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`
    } else {
      return integerDisplay
    }
  }

  
  function appendNumber(number) {
    if (shouldResetScreen) {
      currentOperand = ""
      shouldResetScreen = false
    }

    if (number === "." && currentOperand.includes(".")) {
      showError("Cannot add multiple decimal points")
      return
    }

    if (currentOperand === "0" && number !== ".") {
      currentOperand = number
    } else {
      currentOperand += number
    }
    updateDisplay()
  }

  // Choose an operation
  function chooseOperation(op) {
    if (currentOperand === "") return

    if (previousOperand !== "") {
      compute()
    }

    operation = op
    previousOperand = currentOperand
    currentOperand = ""
    updateDisplay()
  }

  
  function compute() {
    let computation
    const prev = Number.parseFloat(previousOperand)
    const current = Number.parseFloat(currentOperand)

    if (isNaN(prev) || isNaN(current)) {
      showError("Invalid operation")
      return
    }

    try {
      switch (operation) {
        case "+":
          computation = prev + current
          break
        case "-":
          computation = prev - current
          break
        case "*":
          computation = prev * current
          break
        case "/":
          if (current === 0) {
            showError("Cannot divide by zero")
            return
          }
          computation = prev / current
          break
        case "^":
          computation = Math.pow(prev, current)
          break
        case "sin":
          computation = Math.sin(current * (Math.PI / 180))
          break
        case "cos":
          computation = Math.cos(current * (Math.PI / 180))
          break
        case "tan":
          if (Math.abs(Math.cos(current * (Math.PI / 180))) < 1e-10) {
            showError("Undefined result")
            return
          }
          computation = Math.tan(current * (Math.PI / 180))
          break
        case "log":
          if (current <= 0) {
            showError("Cannot calculate log of zero or negative number")
            return
          }
          computation = Math.log10(current)
          break
        case "ln":
          if (current <= 0) {
            showError("Cannot calculate ln of zero or negative number")
            return
          }
          computation = Math.log(current)
          break
        case "sqrt":
          if (current < 0) {
            showError("Cannot calculate square root of negative number")
            return
          }
          computation = Math.sqrt(current)
          break
        case "exp":
          computation = Math.exp(current)
          break
        default:
          return
      }

      
      if (!isFinite(computation)) {
        showError("Result is too large or undefined")
        clear()
        return
      }

      currentOperand = computation.toString()
      operation = undefined
      previousOperand = ""
      shouldResetScreen = true
      updateDisplay()
    } catch (error) {
      showError("Math error")
      clear()
    }
  }

  
  function handleSpecialOperation(op) {
    let result
    const current = Number.parseFloat(currentOperand)

    if (isNaN(current) && op !== "pi" && op !== "e") {
      showError("Invalid input")
      return
    }

    try {
      switch (op) {
        case "sin":
          result = Math.sin(current * (Math.PI / 180))
          break
        case "cos":
          result = Math.cos(current * (Math.PI / 180))
          break
        case "tan":
          if (Math.abs(Math.cos(current * (Math.PI / 180))) < 1e-10) {
            showError("Undefined result")
            return
          }
          result = Math.tan(current * (Math.PI / 180))
          break
        case "log":
          if (current <= 0) {
            showError("Cannot calculate log of zero or negative number")
            return
          }
          result = Math.log10(current)
          break
        case "ln":
          if (current <= 0) {
            showError("Cannot calculate ln of zero or negative number")
            return
          }
          result = Math.log(current)
          break
        case "sqrt":
          if (current < 0) {
            showError("Cannot calculate square root of negative number")
            return
          }
          result = Math.sqrt(current)
          break
        case "exp":
          result = Math.exp(current)
          if (!isFinite(result)) {
            showError("Result is too large")
            return
          }
          break
        case "pi":
          result = Math.PI
          break
        case "e":
          result = Math.E
          break
        default:
          return
      }

      currentOperand = result.toString()
      shouldResetScreen = true
      updateDisplay()
    } catch (error) {
      showError("Math error")
    }
  }

  
  function clear() {
    currentOperand = "0"
    previousOperand = ""
    operation = undefined
    updateDisplay()
  }

  
  function deleteNumber() {
    if (currentOperand === "0") return
    if (currentOperand.length === 1) {
      currentOperand = "0"
    } else {
      currentOperand = currentOperand.slice(0, -1)
    }
    updateDisplay()
  }

  
  function toggleMode() {
    scientificDiv.classList.toggle("hidden")
    if (switchModeButton.textContent === "Scientific") {
      switchModeButton.textContent = "Simple"
    } else {
      switchModeButton.textContent = "Scientific"
    }
  }

  
  numberButtons.forEach((button) => {
    button.addEventListener("click", () => {
      appendNumber(button.dataset.number)
    })
  })

  operationButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const op = button.dataset.operation
      if (["sin", "cos", "tan", "log", "ln", "sqrt", "exp", "pi", "e"].includes(op)) {
        handleSpecialOperation(op)
      } else {
        chooseOperation(op)
      }
    })
  })

  equalsButton.addEventListener("click", () => {
    compute()
  })

  clearButton.addEventListener("click", clear)

  deleteButton.addEventListener("click", deleteNumber)

  switchModeButton.addEventListener("click", toggleMode)

  themeToggleBtn.addEventListener("click", toggleTheme)

  
  document.addEventListener("keydown", (e) => {
    
    if (
      ["+", "-", "*", "/", "=", "Enter", "Escape", "Backspace", "."].includes(e.key) ||
      (e.key >= "0" && e.key <= "9")
    ) {
      e.preventDefault()
    }

    if (e.key >= "0" && e.key <= "9") appendNumber(e.key)
    if (e.key === ".") appendNumber(".")
    if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") chooseOperation(e.key)

    
    if (e.key === "Enter" || e.key === "=") {
      e.preventDefault() // Prevent form submission
      compute()
    }

    if (e.key === "Escape") clear()
    if (e.key === "Backspace") deleteNumber()
  })

  // Initialize
  loadThemePreference()
  updateDisplay()
})
