import { Link } from 'react-router-dom';
import './Button.css';

function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  loading = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  as,
  to,
  ...props 
}) {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const widthClass = fullWidth ? 'btn-full-width' : '';
  const loadingClass = loading ? 'btn-loading' : '';
  
  const classes = `${baseClass} ${variantClass} ${sizeClass} ${widthClass} ${loadingClass} ${className}`.trim();
  
  // If 'as' prop is provided (e.g., Link), use that component
  if (as === Link || to) {
    const Component = as || Link;
    return (
      <Component
        to={to}
        className={classes}
        onClick={onClick}
        {...props}
      >
        {loading && <span className="btn-spinner"></span>}
        <span className={loading ? 'btn-content-loading' : ''}>{children}</span>
      </Component>
    );
  }
  
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <span className="btn-spinner"></span>}
      <span className={loading ? 'btn-content-loading' : ''}>{children}</span>
    </button>
  );
}

export default Button;

