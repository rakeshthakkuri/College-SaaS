import './LoadingSpinner.css';

function LoadingSpinner({ size = 'medium', className = '' }) {
  return (
    <div className={`loading-spinner loading-spinner-${size} ${className}`.trim()}>
      <div className="spinner"></div>
    </div>
  );
}

export default LoadingSpinner;

