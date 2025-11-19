import './Card.css';

function Card({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'medium',
  onClick,
  ...props 
}) {
  const hoverClass = hover ? 'card-hover' : '';
  const paddingClass = `card-padding-${padding}`;
  const clickableClass = onClick ? 'card-clickable' : '';
  
  return (
    <div
      className={`card ${hoverClass} ${paddingClass} ${clickableClass} ${className}`.trim()}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;

