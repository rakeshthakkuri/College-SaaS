import './Input.css';

function Input({
  label,
  error,
  helperText,
  fullWidth = true,
  required = false,
  className = '',
  ...props
}) {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;
  
  return (
    <div className={`input-group ${fullWidth ? 'input-full-width' : ''} ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`input ${hasError ? 'input-error' : ''}`}
        aria-invalid={hasError}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {error && (
        <div id={`${inputId}-error`} className="input-error-message" role="alert">
          {error}
        </div>
      )}
      {helperText && !error && (
        <div id={`${inputId}-helper`} className="input-helper-text">
          {helperText}
        </div>
      )}
    </div>
  );
}

export default Input;

