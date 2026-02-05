export default function StarRating({ 
  rating, 
  onRate, 
  onRatingChange,
  size = 'default', 
  editable = false,
  interactive = false 
}) {
  const stars = [1, 2, 3, 4, 5];
  const isInteractive = editable || interactive;
  const handleClick = onRate || onRatingChange;

  const sizeClasses = {
    small: 'text-sm',
    default: 'text-xl',
    large: 'text-3xl',
  };

  const sizeClass = typeof size === 'string' && sizeClasses[size] ? sizeClasses[size] : size;

  return (
    <div className="flex gap-1">
      {stars.map((star) => (
        <span
          key={star}
          className={`${sizeClass} ${isInteractive ? 'cursor-pointer hover:scale-110 transition' : ''}`}
          onClick={() => isInteractive && handleClick && handleClick(star)}
        >
          {star <= rating ? '⭐' : '☆'}
        </span>
      ))}
    </div>
  );
}