import { actions } from "./Calculator";

const OperationButton = ({ dispatch, operation, myClass }) => {
  return (
    <button
      className={myClass}
      onClick={() => dispatch({ type: actions.OPERATION, payload: operation })}
    >
      {operation}
    </button>
  );
};

export default OperationButton;
