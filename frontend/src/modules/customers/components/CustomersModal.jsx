import "../index.css";

export default function Modal({ children, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="btn-close" onClick={onClose}>✖</button>
        {children}
      </div>
    </div>
  );
}
