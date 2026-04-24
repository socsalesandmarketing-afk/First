import { ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import type { Review } from '../types';
import StarRating from './StarRating';
import { format } from 'date-fns';

interface Props {
  review: Review;
}

export default function ReviewCard({ review }: Props) {
  const [helpful, setHelpful] = useState(review.helpfulCount);
  const [voted, setVoted] = useState(false);

  function handleHelpful() {
    if (voted) return;
    setHelpful((n) => n + 1);
    setVoted(true);
  }

  return (
    <div className="py-5 border-b border-gray-100 last:border-0">
      <div className="flex items-start gap-3 mb-3">
        <img
          src={review.userAvatar}
          alt={review.userName}
          className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900 text-sm">{review.userName}</span>
            <span className="text-gray-400 text-xs">{format(new Date(review.date), 'MMM yyyy')}</span>
          </div>
          <StarRating rating={review.rating} size={14} />
        </div>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed mb-3">{review.comment}</p>
      <button
        onClick={handleHelpful}
        className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${voted ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <ThumbsUp size={13} />
        Helpful ({helpful})
      </button>
    </div>
  );
}
