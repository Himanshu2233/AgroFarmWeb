import { useNavigate } from 'react-router-dom';

export default function BackButton({ to, label = 'Back' }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 text-green-800 hover:text-green-600 font-medium transition mb-4"
    >
      <span className="text-xl">←</span>
      <span>{label}</span>
    </button>
  );
}
