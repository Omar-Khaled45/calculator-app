const Screen = ({ numberEdit, previousOperand, operation, currentOperand }) => {
  return (
    <div className="row">
      <div className="col output">
        <div className="previous-operand">
          {numberEdit(previousOperand)} {operation}
        </div>
        <div className="current-operand text-break">
          {numberEdit(currentOperand)}
        </div>
      </div>
    </div>
  );
};

export default Screen;
