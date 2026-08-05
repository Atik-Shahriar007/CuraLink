export default function AmbulanceIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 150" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dcdfe2" />
        </linearGradient>
        <linearGradient id="windowGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bcd6e0" />
          <stop offset="100%" stopColor="#7f9aa8" />
        </linearGradient>
        <radialGradient id="wheelGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#6b7280" />
          <stop offset="100%" stopColor="#1f2937" />
        </radialGradient>
        <linearGradient id="stripeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
      </defs>

      {/* motion speed lines */}
      <g stroke="#dc2626" strokeWidth="3" strokeLinecap="round" opacity="0.35">
        <line x1="0" y1="55" x2="28" y2="55" />
        <line x1="0" y1="72" x2="20" y2="72" />
        <line x1="0" y1="89" x2="26" y2="89" />
      </g>

      {/* ground shadow */}
      <ellipse cx="175" cy="138" rx="105" ry="8" fill="#000" opacity="0.15" />

      {/* van body */}
      <path
        d="M40 100 V60 Q40 50 50 50 H115 L140 30 H255 Q265 30 265 40 V100 Z"
        fill="url(#bodyGrad)"
        stroke="#9aa0a6"
        strokeWidth="1.5"
      />

      {/* cab windshield + window */}
      <path d="M145 34 L128 50 H118 L138 34 Z" fill="url(#windowGrad)" stroke="#5b7280" strokeWidth="1" />
      <rect x="150" y="34" width="52" height="16" rx="2" fill="url(#windowGrad)" stroke="#5b7280" strokeWidth="1" />

      {/* red stripe */}
      <rect x="40" y="82" width="225" height="10" fill="url(#stripeGrad)" />

      {/* red cross emblem panel */}
      <rect x="60" y="55" width="34" height="24" rx="3" fill="#fff" stroke="#dc2626" strokeWidth="1.5" />
      <rect x="73" y="60" width="8" height="14" fill="#dc2626" />
      <rect x="66" y="64" width="22" height="6" fill="#dc2626" />

      {/* AMBULANCE text bar */}
      <rect x="105" y="60" width="90" height="12" rx="2" fill="#0F3D3E" opacity="0.85" />
      <text x="150" y="69" textAnchor="middle" fontSize="8" fontWeight="700" fill="white" fontFamily="Arial, sans-serif" letterSpacing="1">
        AMBULANCE
      </text>

      {/* light bar on roof */}
      <rect x="150" y="24" width="44" height="8" rx="2" fill="#1f2937" />
      <rect x="152" y="25.5" width="19" height="5" rx="1" fill="#ef4444">
        <animate attributeName="opacity" values="1;0.3;1" dur="0.8s" repeatCount="indefinite" />
      </rect>
      <rect x="173" y="25.5" width="19" height="5" rx="1" fill="#3b82f6">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="0.8s" repeatCount="indefinite" />
      </rect>

      {/* headlight + mirror + door lines */}
      <circle cx="259" cy="66" r="5" fill="#fde68a" stroke="#b45309" strokeWidth="1" />
      <rect x="252" y="90" width="1.5" height="10" fill="#9aa0a6" />
      <rect x="116" y="90" width="1.5" height="10" fill="#9aa0a6" />
      <rect x="128" y="42" width="8" height="6" rx="1" fill="#4b5563" />

      {/* wheels */}
      <circle cx="95" cy="102" r="16" fill="url(#wheelGrad)" />
      <circle cx="95" cy="102" r="7" fill="#9ca3af" />
      <circle cx="230" cy="102" r="16" fill="url(#wheelGrad)" />
      <circle cx="230" cy="102" r="7" fill="#9ca3af" />
    </svg>
  );
}