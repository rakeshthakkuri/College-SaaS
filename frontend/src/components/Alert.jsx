import './Alert.css';

function Alert({ 
  children, 
  variant = 'info', 
  title,
  onClose,
  className = '' 
}) {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };

  return (
    <div className={`alert alert-${variant} ${className}`.trim()} role="alert">
      <div className="alert-content">
        <span className="alert-icon">{icons[variant]}</span>
        <div className="alert-text">
          {title && <div className="alert-title">{title}</div>}
          <div className="alert-message">{children}</div>
        </div>
      </div>
      {onClose && (
        <button className="alert-close" onClick={onClose} aria-label="Close">
          ×
        </button>
      )}
    </div>
  );
}

export default Alert;

