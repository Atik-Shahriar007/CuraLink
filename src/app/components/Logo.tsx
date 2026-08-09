export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#14B8A6" />
            <stop offset="100%" stopColor="#0F3D3E" />
          </linearGradient>
        </defs>
        <path
          d="M20 34C20 34 4 24.5 4 14.5C4 9.5 8 6 12.5 6C15.7 6 18.3 7.8 20 10.3C21.7 7.8 24.3 6 27.5 6C32 6 36 9.5 36 14.5C36 24.5 20 34 20 34Z"
          fill="url(#logoGrad)"
        />
        <path
          d="M8 18h5l2.5-6 3 11 2.5-7 2 4h7"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <span className="font-display text-xl font-semibold text-teal-950">CuraLink</span>
    </div>
  );
}