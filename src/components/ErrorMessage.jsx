import "./ErrorMessage.css";

function ErrorMessage({ message, onBack }) {
  return (
    <div className="error-message-wrapper">
      <div className="error-message">
        <div className="error-icon">!</div>

        <h2>Что-то пошло не так</h2>

        <p>{message}</p>

        {onBack && <button onClick={onBack}>← Назад</button>}
      </div>
    </div>
  );
}

export default ErrorMessage;
