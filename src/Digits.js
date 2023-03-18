import { OPERATIONS } from "./CalculatorApp"

export default function Digits({ dispatch, digit }) {
  return (
    <button onClick={() => dispatch({ type: OPERATIONS.ADD, payload: { digit } })}>
      {digit}
    </button>
  )
}