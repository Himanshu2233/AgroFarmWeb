export default function StarRating({ rating, onRate, size = 'text-2xl', editable = false }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex gap-1">
      {stars.map((star) => (
        <span
          key={star}
          className={`${size} ${editable ? 'cursor-pointer hover:scale-110 transition' : ''}`}
          onClick={() => editable && onRate && onRate(star)}
        >
          {star <= rating ? '⭐' : '☆'}
        </span>
      ))}
    </div>
  );
}