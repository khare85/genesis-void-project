
import { cn } from '@/lib/utils';

interface MatchScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const MatchScoreRing: React.FC<MatchScoreRingProps> = ({
  score,
  size = 'md',
  showText = true,
  className,
}) => {
  const getColor = (score: number) => {
    if (score >= 80) return 'bg-ats-accent-green';
    if (score >= 60) return 'bg-ats-accent-yellow';
    return 'bg-ats-accent-red';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-12 w-12 text-sm';
      case 'lg':
        return 'h-20 w-20 text-2xl';
      default:
        return 'h-16 w-16 text-xl';
    }
  };

  // Calculate percentage for circle background
  const circumference = 2 * Math.PI * 47; // 47 is the radius of the circle
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={cn('relative flex items-center justify-center', getSizeClasses(), className)}>
      {/* Background ring */}
      <svg
        className="absolute inset-0 h-full w-full -rotate-90"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="text-muted/30"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          className={cn(
            "transition-all duration-500 ease-out",
            score >= 80 ? "text-ats-accent-green" : 
            score >= 60 ? "text-ats-accent-yellow" : 
            "text-ats-accent-red"
          )}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
      </svg>
      {/* Score text */}
      {showText && (
        <span className="font-bold relative text-center">{score}</span>
      )}
    </div>
  );
};

export default MatchScoreRing;
