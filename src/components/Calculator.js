import { useReducer } from "react";
import Screen from "./Screen";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

// Constants
export const actions = {
  DELETE_DIGIT: "DEL",
  ADD_DIGIT: "ADD_DIGIT",
  CLEAR: "CLEAR",
  OPERATION: "OPERATION",
  EVALUATE: "EVALUATE",
};

const reducer = (state, action) => {
  switch (action.type) {
    // Adding digit
    case actions.ADD_DIGIT:
      // Prevent adding two periods in one number
      if (state.currentOperand) {
        if (action.payload === "." && state.currentOperand.includes(".")) {
          return state;
        }
      } else if (action.payload === ".") {
        return {};
      }

      // Prevent adding more than zero after a period
      if (action.payload === 0 && state.currentOperand === "0") {
        return state;
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${action.payload}`,
      };

    // Deleting digit
    case actions.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      if (!state.currentOperand) {
        return state;
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    // Clearing screen
    case actions.CLEAR:
      return {};

    // Choosing Operation
    case actions.OPERATION:
      if (!state.currentOperand && !state.previousOperand) {
        return state;
      }

      if (!state.currentOperand && state.previousOperand) {
        return {
          ...state,
          operation: action.payload,
          previousOperand: state.previousOperand,
        };
      }

      if (!state.previousOperand) {
        return {
          ...state,
          previousOperand: state.currentOperand,
          operation: action.payload,
          currentOperand: null,
        };
      }

      return {
        ...state,
        operation: action.payload,
        previousOperand: evaluate(state),
        currentOperand: null,
      };

    // Evaluation
    case actions.EVALUATE:
      if (!state.previousOperand || !state.currentOperand) {
        return state;
      }

      return {
        ...state,
        operation: null,
        previousOperand: null,
        currentOperand: evaluate(state),
        overwrite: true,
      };

    default:
      return {};
  }
};

const evaluate = ({ currentOperand, previousOperand, operation }) => {
  let current = parseFloat(currentOperand);
  let previous = parseFloat(previousOperand);
  let computation = "";

  if (isNaN(current) || isNaN(previous)) return "";

  switch (operation) {
    case "+":
      computation = previous + current;
      break;

    case "-":
      computation = previous - current;
      break;

    case "*":
      computation = previous * current;
      break;

    case "/":
      computation = previous / current;
      break;
  }

  return computation.toString();
};

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

const numberEdit = (operand) => {
  // Make sure a number is written
  if (!operand) return;

  // Split the number into integer and decimal
  const [integer, decimal] = operand.split(".");

  // Applying the editing method on the integer only
  if (!decimal) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
};

const Calculator = () => {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="container mt-5 w-50">
      <Screen
        numberEdit={numberEdit}
        previousOperand={previousOperand}
        operation={operation}
        currentOperand={currentOperand}
      />
      <div className="row">
        <button
          className="col-6 fw-bold"
          onClick={() => dispatch({ type: actions.CLEAR })}
        >
          AC
        </button>
        <button
          className="col-3 fw-bold"
          onClick={() => dispatch({ type: actions.DELETE_DIGIT })}
        >
          DEL
        </button>
        <OperationButton
          myClass={"col-3 fw-bold"}
          dispatch={dispatch}
          operation={"/"}
        />
      </div>
      <div className="row">
        <DigitButton dispatch={dispatch} digit={1} />
        <DigitButton dispatch={dispatch} digit={2} />
        <DigitButton dispatch={dispatch} digit={3} />
        <OperationButton
          myClass={"col fw-bold"}
          dispatch={dispatch}
          operation={"*"}
        />
      </div>
      <div className="row">
        <DigitButton dispatch={dispatch} digit={4} />
        <DigitButton dispatch={dispatch} digit={5} />
        <DigitButton dispatch={dispatch} digit={6} />
        <OperationButton
          myClass={"col fw-bold"}
          dispatch={dispatch}
          operation={"+"}
        />
      </div>
      <div className="row">
        <DigitButton dispatch={dispatch} digit={7} />
        <DigitButton dispatch={dispatch} digit={8} />
        <DigitButton dispatch={dispatch} digit={9} />
        <OperationButton
          myClass={"col fw-bold"}
          dispatch={dispatch}
          operation={"-"}
        />
      </div>
      <div className="row">
        <DigitButton dispatch={dispatch} digit={"."} />
        <DigitButton dispatch={dispatch} digit={0} />
        <button
          className="col-6 fw-bold"
          onClick={() => dispatch({ type: actions.EVALUATE })}
        >
          =
        </button>
      </div>
    </div>
  );
};

export default Calculator;
