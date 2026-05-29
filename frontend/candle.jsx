const { useEffect, useRef } = React;

const Candle = () => {
  const flickerRef = useRef(null);
  const flameRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    let t = 0;
    flickerRef.current = setInterval(() => {
      t += 0.12;
      if (!flameRef.current || !glowRef.current) return;
      const scaleX = 1 + Math.sin(t * 2.3) * 0.06;
      const scaleY = 1 + Math.sin(t * 1.7) * 0.08;
      const tx = Math.sin(t * 3.1) * 1.5;
      flameRef.current.style.transform =
        `translate(${tx}px, 0) scaleX(${scaleX}) scaleY(${scaleY})`;
      glowRef.current.setAttribute('opacity', 0.7 + Math.sin(t * 2) * 0.2);
    }, 50);

    return () => {
      if (flickerRef.current) clearInterval(flickerRef.current);
    };
  }, []);

  return (
    <svg viewBox="0 0 100 300" width="40" height="130" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="c-glow" cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="#ffe066" stopOpacity="0.55"/>
          <stop offset="100%" stopColor="#ffe066" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="c-wax" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#f9f0d8"/>
          <stop offset="100%" stopColor="#d4b98a"/>
        </radialGradient>
        <filter id="c-fblur">
          <feGaussianBlur stdDeviation="1.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Glow halo */}
      <ellipse ref={glowRef} cx="60" cy="72" rx="38" ry="32" fill="url(#c-glow)" opacity="1"/>

      {/* Flame — always lit, never blows out */}
      <g ref={flameRef} style={{ transformOrigin: '60px 82px' }}>
        <path
          d="M60,82 C54,72 50,60 58,46 C60,40 62,35 60,28 C66,36 72,50 68,62 C70,68 72,75 66,82 Z"
          fill="#ffb300" opacity="0.9" filter="url(#c-fblur)"
        />
        <path
          d="M60,82 C57,75 56,66 60,56 C61,52 62,48 60,43 C64,50 66,60 63,70 C65,74 65,79 62,82 Z"
          fill="#fff176" opacity="0.95"
        />
        <circle cx="60" cy="82" r="2.2" fill="#fff9c4"/>
      </g>

      {/* Candle body */}
      <rect x="38" y="88" width="44" height="165" rx="6" fill="url(#c-wax)" stroke="#c9a96e" strokeWidth="0.8"/>
      <path d="M46,100 Q44,115 46,130" stroke="#f0d9a8" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5"/>
      <path d="M72,108 Q74,120 72,138" stroke="#f0d9a8" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4"/>

      {/* Top rim */}
      <ellipse cx="60" cy="88" rx="22" ry="5" fill="#eddfc0" stroke="#c9a96e" strokeWidth="0.6"/>

      {/* Wax pool */}
      <ellipse cx="60" cy="86" rx="12" ry="3.5" fill="#f5e9c5" opacity="0.9"/>

      {/* Wick */}
      <line x1="60" y1="84" x2="60" y2="88" stroke="#4a3000" strokeWidth="1.5" strokeLinecap="round"/>

      {/* Base / holder */}
      <rect x="28" y="253" width="64" height="14" rx="4" fill="#b8943a" stroke="#8a6a1a" strokeWidth="0.6"/>
      <rect x="22" y="263" width="76" height="10" rx="3" fill="#9a7a2a" stroke="#7a5a10" strokeWidth="0.5"/>
    </svg>
  );
};

Object.assign(window, { Candle });
