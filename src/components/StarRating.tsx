import { Star } from 'lucide-react';

interface Props {
  rating: number;
  size?: number;
  interactive?: boolean;
  onRate?: (r: number) => void;
}

export default function StarRating({ rating, size = 16, interactive = false, onRate }: Props) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`${star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} ${interactive ? 'cursor-pointer hover:fill-amber-300 hover:text-amber-300 transition-colors' : ''}`}
          onClick={() => interactive && onRate?.(star)}
        />
      ))}
    </div>
  );
}
