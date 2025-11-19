import './EmptyState.css';
import Button from './Button';

function EmptyState({ 
  icon = '📭',
  title = 'No data found',
  description = 'There is no data to display at the moment.',
  actionLabel,
  onAction,
  className = ''
}) {
  return (
    <div className={`empty-state ${className}`.trim()}>
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" className="empty-state-action">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;

