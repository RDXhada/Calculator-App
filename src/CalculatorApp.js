import { useReducer } from "react"
import Digits from "./Digits"
import Operator from "./Operator"
import "./styles.css"

export const OPERATIONS = {
  ADD: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE: "delete-digit",
  EVALUATE: "evaluate",
}

function reducer(state, { type, payload }) 
{
  switch (type) 
  {
    //ADD DIGIT CASE
    case OPERATIONS.ADD:
      if (state.overwrite) {
        return {...state,currentOperand: payload.digit,overwrite: false,}
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      if (payload.digit === "." && state.currentOperand === ".") {
        return state
      }

      return {...state,currentOperand: `${state.currentOperand || ""}${payload.digit}`,}

      //CHOOSE OPERATION CASE
    case OPERATIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }
      if (state.currentOperand == null) {
        return {...state, operation: payload.operation,}
      }
      if (state.previousOperand == null) {
        return {...state,operation: payload.operation,previousOperand: state.currentOperand,currentOperand: null,}
      }

      return {...state,previousOperand: evaluate(state),operation: payload.operation,currentOperand: null,}

      //CLEAR(C) CASE
    case OPERATIONS.CLEAR:
      return {}

      //DEL CASE
    case OPERATIONS.DELETE:
      if (state.overwrite) {
        return { ...state, overwrite: false, currentOperand: null,}
      }
      if (state.currentOperand == null) return state
      if (state.currentOperand.length === 1) { 
        return { ...state, currentOperand: null }
      }

      return {...state, currentOperand: state.currentOperand.slice(0, -1),}

      //EVAL CASE
    case OPERATIONS.EVALUATE:
      if (state.operation == null || state.currentOperand == null ||state.previousOperand == null) {
         return state 
        }

      return {...state, overwrite: true, previousOperand: null, operation: null, currentOperand: evaluate(state),}
    
    default: return state 
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
   if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation =  (prev + current).toFixed(8)
      break
    case "-":
      computation = (prev - current).toFixed(8)
      break
    case "*":
      computation = (prev * current).toFixed(8)
      break
    case "÷":
      computation =  (prev / current).toFixed(8)
      break
      default: computation = "" 
      break
  }
  //return the computation as a "double" number and have 6 digits after the floating point and convert it to string
  //floating point 
  return parseFloat(computation).toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {maximumFractionDigits: 0,})


function formatOperand(operand) 
{
  if (operand == null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() 
{
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer,{})

  return (
    <div className="calculator-display">
  {/* Output section */}
  <div className="output">
    {/* Previous operand section */}
    <div className="previous-operand">
      {formatOperand(previousOperand)} {operation}
    </div>
    {/* Current operand section */}
    <div className="current-operand">
      {formatOperand(currentOperand)}
    </div>
  </div>

  {/* AC button */}
  <button className="span-two" onClick={() => dispatch({ type: OPERATIONS.CLEAR })}>C</button>

  {/* DEL button */}
  <button onClick={() => dispatch({ type: OPERATIONS.DELETE })}>DEL</button>

  {/* Operation buttons */}
  <Operator operation="÷" dispatch={dispatch}/>
  <Digits digit="1" dispatch={dispatch}/>
  <Digits digit="2" dispatch={dispatch}/>
  <Digits digit="3" dispatch={dispatch}/>
  <Operator operation="*" dispatch={dispatch}/>
  <Digits digit="4" dispatch={dispatch}/>
  <Digits digit="5" dispatch={dispatch}/>
  <Digits digit="6" dispatch={dispatch}/>
  <Operator operation="+" dispatch={dispatch}/>
  <Digits digit="7" dispatch={dispatch}/>
  <Digits digit="8" dispatch={dispatch}/>
  <Digits digit="9" dispatch={dispatch}/>
  <Operator operation="-" dispatch={dispatch}/>
  <Digits digit="." dispatch={dispatch}/>
  <Digits digit="0" dispatch={dispatch}/>

  {/* Equals button */}
  <button className="span-two" onClick={() => dispatch({ type: OPERATIONS.EVALUATE })}>=</button>
</div>

  )
}
export default App
