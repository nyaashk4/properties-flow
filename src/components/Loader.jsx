import "./Loader.css";

function Loader({ message }) {
  return (
    <div className="loader-wrapper">
      <div className="loader-spinner"></div>
      <p>{message}</p>
    </div>
  );
}

export default Loader;
