import './Skeleton.css';

function Skeleton({ 
  variant = 'text', 
  width,
  height,
  className = '',
  lines = 1 
}) {
  if (variant === 'text' && lines > 1) {
    return (
      <div className={`skeleton-text-multiple ${className}`.trim()}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="skeleton skeleton-text"
            style={{ width: i === lines - 1 ? '60%' : '100%' }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`skeleton skeleton-${variant} ${className}`.trim()}
      style={{ width, height }}
    />
  );
}

export default Skeleton;

