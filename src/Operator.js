import { OPERATIONS } from "./CalculatorApp"

export default function Operator({ dispatch, operation })
{
  return (
    <button onClick={() => dispatch({ type: OPERATIONS.CHOOSE_OPERATION, payload: { operation } })}> 
    {operation}
    </button>
  )
}