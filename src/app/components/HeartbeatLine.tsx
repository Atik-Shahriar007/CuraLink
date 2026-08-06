export default function HeartbeatLine({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 60"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 30 H90 L100 5 L112 55 L124 12 L136 45 L148 30 H170 L180 8 L192 52 L204 18 L216 42 L228 30 H400"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset="1"
        style={{ animation: "heartbeat-draw 3.5s ease-in-out infinite" }}
      />
      <style>{`
        @keyframes heartbeat-draw {
          0% { stroke-dashoffset: 1; opacity: 0; }
          15% { opacity: 1; }
          60% { stroke-dashoffset: 0; opacity: 1; }
          85% { opacity: 0; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
      `}</style>
    </svg>
  );
}