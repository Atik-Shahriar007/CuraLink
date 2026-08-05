export default function HeartbeatLine({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 60"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 30 H130 L145 10 L160 50 L175 20 L190 40 L205 30 H400"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset="1"
        style={{ animation: "heartbeat-draw 3s ease-in-out infinite" }}
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