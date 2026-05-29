/* ───── Card art components ─────
   Card back patterns (3 variants) and three card faces.
   All SVG, rendered crisp at any size. Gold-on-velvet / gold-on-ivory.
*/

const CardBack = ({ variant = "star" }) => {
  // 3 variants of card back
  if (variant === "moon") {
    return (
      <svg viewBox="0 0 200 320" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="cb-moon-bg" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="oklch(0.26 0.14 26)" />
            <stop offset="100%" stopColor="oklch(0.12 0.06 24)" />
          </radialGradient>
        </defs>
        <rect width="200" height="320" fill="url(#cb-moon-bg)" />
        {/* Double border */}
        <rect x="8" y="8" width="184" height="304" fill="none" stroke="oklch(0.78 0.14 76)" strokeWidth="0.6" opacity="0.85" />
        <rect x="14" y="14" width="172" height="292" fill="none" stroke="oklch(0.78 0.14 76)" strokeWidth="0.3" opacity="0.6" />
        {/* Crescent moon center */}
        <g transform="translate(100,160)">
          <circle r="42" fill="none" stroke="oklch(0.78 0.14 76)" strokeWidth="0.8" opacity="0.5" />
          <path d="M -22 -28 A 36 36 0 1 0 -22 28 A 26 26 0 1 1 -22 -28 Z" fill="oklch(0.78 0.14 76)" opacity="0.85" />
          {/* tiny stars around */}
          {[[-40,-50],[42,-55],[-50,40],[48,46],[0,-66],[0,66]].map(([x,y],i)=>(
            <g key={i} transform={`translate(${x},${y})`}>
              <path d="M 0 -3 L 0.7 -0.7 L 3 0 L 0.7 0.7 L 0 3 L -0.7 0.7 L -3 0 L -0.7 -0.7 Z" fill="oklch(0.92 0.12 82)" />
            </g>
          ))}
        </g>
        {/* corner ornaments */}
        {[[24,24,0],[176,24,90],[176,296,180],[24,296,270]].map(([x,y,r],i)=>(
          <g key={i} transform={`translate(${x},${y}) rotate(${r})`}>
            <path d="M 0 0 L 18 0 M 0 0 L 0 18 M 4 4 L 12 12" stroke="oklch(0.78 0.14 76)" strokeWidth="0.6" fill="none" opacity="0.7" />
          </g>
        ))}
      </svg>
    );
  }

  if (variant === "diamond") {
    return (
      <svg viewBox="0 0 200 320" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="cb-d-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.22 0.13 26)" />
            <stop offset="100%" stopColor="oklch(0.10 0.05 24)" />
          </linearGradient>
          <pattern id="cb-d-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 10 2 L 18 10 L 10 18 L 2 10 Z" fill="none" stroke="oklch(0.78 0.14 76)" strokeWidth="0.3" opacity="0.6" />
            <circle cx="10" cy="10" r="0.8" fill="oklch(0.78 0.14 76)" opacity="0.6" />
          </pattern>
        </defs>
        <rect width="200" height="320" fill="url(#cb-d-bg)" />
        <rect x="14" y="14" width="172" height="292" fill="url(#cb-d-pattern)" opacity="0.9" />
        {/* Borders */}
        <rect x="8" y="8" width="184" height="304" fill="none" stroke="oklch(0.78 0.14 76)" strokeWidth="0.6" opacity="0.9" />
        <rect x="14" y="14" width="172" height="292" fill="none" stroke="oklch(0.78 0.14 76)" strokeWidth="0.4" opacity="0.7" />
        {/* Center sigil */}
        <g transform="translate(100,160)">
          <circle r="34" fill="oklch(0.12 0.06 24)" stroke="oklch(0.78 0.14 76)" strokeWidth="0.6" />
          <circle r="26" fill="none" stroke="oklch(0.78 0.14 76)" strokeWidth="0.3" />
          <text x="0" y="6" textAnchor="middle"
            fontFamily="Cormorant Garamond, serif"
            fontStyle="italic"
            fontSize="22"
            fill="oklch(0.92 0.12 82)">A</text>
        </g>
      </svg>
    );
  }

  // default — star with rays
  return (
    <svg viewBox="0 0 200 320" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="cb-bg" cx="50%" cy="50%" r="75%">
          <stop offset="0%" stopColor="oklch(0.24 0.13 26)" />
          <stop offset="100%" stopColor="oklch(0.10 0.05 24)" />
        </radialGradient>
      </defs>
      <rect width="200" height="320" fill="url(#cb-bg)" />
      {/* Inner double border with corner motif */}
      <rect x="8" y="8" width="184" height="304" fill="none" stroke="oklch(0.78 0.14 76)" strokeWidth="0.6" opacity="0.9" />
      <rect x="14" y="14" width="172" height="292" fill="none" stroke="oklch(0.78 0.14 76)" strokeWidth="0.3" opacity="0.55" />
      {/* Tile of small stars */}
      <g opacity="0.45">
        {Array.from({length: 24}).map((_,i)=>{
          const cols=4, rows=6;
          const x = 32 + (i % cols) * 45;
          const y = 50 + Math.floor(i / cols) * 45;
          return <path key={i} d={`M ${x} ${y-2.5} L ${x+0.7} ${y-0.7} L ${x+2.5} ${y} L ${x+0.7} ${y+0.7} L ${x} ${y+2.5} L ${x-0.7} ${y+0.7} L ${x-2.5} ${y} L ${x-0.7} ${y-0.7} Z`} fill="oklch(0.78 0.14 76)"/>;
        })}
      </g>
      {/* Center 8-point star */}
      <g transform="translate(100,160)">
        <circle r="44" fill="oklch(0.14 0.07 24)" stroke="oklch(0.78 0.14 76)" strokeWidth="0.7" />
        <circle r="36" fill="none" stroke="oklch(0.78 0.14 76)" strokeWidth="0.3" opacity="0.6"/>
        {Array.from({length:8}).map((_,i)=>(
          <path key={i}
            transform={`rotate(${i*45})`}
            d="M 0 -34 L 4 -4 L 0 0 L -4 -4 Z"
            fill="oklch(0.92 0.12 82)"
            opacity={i % 2 === 0 ? 0.95 : 0.55}
          />
        ))}
        <circle r="5" fill="oklch(0.92 0.12 82)" />
        <circle r="2.2" fill="oklch(0.10 0.05 24)" />
      </g>
      {/* Bottom monogram */}
      <text x="100" y="290" textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize="6" letterSpacing="3"
        fill="oklch(0.78 0.14 76)"
        opacity="0.7">ASTRO ANNIE</text>
    </svg>
  );
};

/* ─── Card faces ─── */

// Common card-face chrome (border + paper texture + bottom label)
const FaceFrame = ({ children, romanNumeral, title }) => (
  <svg viewBox="0 0 200 320" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="oklch(0.96 0.03 82)"/>
        <stop offset="100%" stopColor="oklch(0.88 0.05 78)"/>
      </linearGradient>
      <filter id="grain" x="0" y="0">
        <feTurbulence baseFrequency="0.9" numOctaves="2" seed="3"/>
        <feColorMatrix values="0 0 0 0 0.15  0 0 0 0 0.05  0 0 0 0 0.05  0 0 0 0.06 0"/>
      </filter>
    </defs>
    <rect width="200" height="320" fill="url(#paper)"/>
    <rect width="200" height="320" fill="white" filter="url(#grain)" opacity="0.5"/>
    {/* gold borders */}
    <rect x="8" y="8" width="184" height="304" fill="none" stroke="oklch(0.55 0.13 65)" strokeWidth="0.8"/>
    <rect x="13" y="13" width="174" height="294" fill="none" stroke="oklch(0.55 0.13 65)" strokeWidth="0.3" opacity="0.6"/>

    {/* roman numeral top */}
    <text x="100" y="36" textAnchor="middle"
      fontFamily="Cormorant Garamond, serif"
      fontStyle="italic"
      fontSize="20"
      fill="oklch(0.45 0.13 25)">{romanNumeral}</text>

    {/* art */}
    {children}

    {/* divider */}
    <line x1="40" x2="160" y1="250" y2="250" stroke="oklch(0.55 0.13 65)" strokeWidth="0.4" opacity="0.6"/>

    {/* title at bottom */}
    <text x="100" y="278" textAnchor="middle"
      fontFamily="Cormorant Garamond, serif"
      fontStyle="italic"
      fontSize="18"
      fill="oklch(0.25 0.10 25)">{title}</text>
    <text x="100" y="294" textAnchor="middle"
      fontFamily="JetBrains Mono, monospace"
      fontSize="6"
      letterSpacing="3"
      fill="oklch(0.55 0.13 65)">ASTRO ANNIE</text>
  </svg>
);

// Past — "The Beginning". Rising sun over a horizon line with mountains
const CardFacePast = () => (
  <FaceFrame romanNumeral="I" title="The Beginning">
    {/* sun + rays */}
    <g transform="translate(100, 130)">
      {Array.from({length: 12}).map((_,i)=>(
        <line key={i}
          transform={`rotate(${i*30})`}
          x1="0" y1="-46" x2="0" y2="-58"
          stroke="oklch(0.55 0.13 65)" strokeWidth="1.2" strokeLinecap="round"/>
      ))}
      <circle r="34" fill="oklch(0.85 0.14 75)"/>
      <circle r="34" fill="none" stroke="oklch(0.45 0.13 25)" strokeWidth="0.8"/>
      <circle r="26" fill="none" stroke="oklch(0.45 0.13 25)" strokeWidth="0.3" opacity="0.6"/>
      {/* face hint — minimal eyes/smile */}
      <circle cx="-9" cy="-3" r="1.4" fill="oklch(0.30 0.10 25)"/>
      <circle cx="9" cy="-3" r="1.4" fill="oklch(0.30 0.10 25)"/>
      <path d="M -8 8 Q 0 14 8 8" fill="none" stroke="oklch(0.30 0.10 25)" strokeWidth="1" strokeLinecap="round"/>
    </g>
    {/* horizon */}
    <line x1="20" y1="200" x2="180" y2="200" stroke="oklch(0.45 0.13 25)" strokeWidth="0.6"/>
    {/* mountains */}
    <path d="M 20 200 L 50 175 L 75 195 L 100 165 L 130 195 L 155 178 L 180 200 Z"
      fill="oklch(0.45 0.13 25)" opacity="0.85"/>
    <path d="M 30 200 L 55 188 L 80 200 Z" fill="oklch(0.32 0.10 22)"/>
    <path d="M 110 200 L 140 188 L 165 200 Z" fill="oklch(0.32 0.10 22)"/>
    {/* small stars in sky */}
    {[[40,80],[160,75],[55,55],[145,55],[100,52]].map(([x,y],i)=>(
      <path key={i} d={`M ${x} ${y-2} L ${x+0.6} ${y-0.6} L ${x+2} ${y} L ${x+0.6} ${y+0.6} L ${x} ${y+2} L ${x-0.6} ${y+0.6} L ${x-2} ${y} L ${x-0.6} ${y-0.6} Z`} fill="oklch(0.55 0.13 65)"/>
    ))}
  </FaceFrame>
);

// Present — "The Reading". Eye / mandala / hand of cards
const CardFacePresent = () => (
  <FaceFrame romanNumeral="II" title="The Reading">
    <g transform="translate(100, 130)">
      {/* outer petals */}
      {Array.from({length: 12}).map((_,i)=>(
        <path key={i}
          transform={`rotate(${i*30})`}
          d="M 0 -48 Q 6 -38 0 -28 Q -6 -38 0 -48 Z"
          fill="none" stroke="oklch(0.55 0.13 65)" strokeWidth="0.5"/>
      ))}
      {/* outer ring */}
      <circle r="48" fill="none" stroke="oklch(0.55 0.13 65)" strokeWidth="0.4"/>
      <circle r="28" fill="oklch(0.55 0.13 65)" opacity="0.1"/>
      <circle r="28" fill="none" stroke="oklch(0.45 0.13 25)" strokeWidth="0.6"/>
      {/* the eye */}
      <path d="M -22 0 Q 0 -16 22 0 Q 0 16 -22 0 Z"
        fill="oklch(0.96 0.03 82)" stroke="oklch(0.30 0.10 25)" strokeWidth="0.6"/>
      <circle r="10" fill="oklch(0.45 0.13 25)"/>
      <circle r="5" fill="oklch(0.20 0.06 24)"/>
      <circle cx="-2" cy="-2" r="1.5" fill="oklch(0.95 0.04 82)"/>
      {/* rays */}
      {Array.from({length:8}).map((_,i)=>(
        <line key={i}
          transform={`rotate(${i*45})`}
          x1="0" y1="-30" x2="0" y2="-46"
          stroke="oklch(0.85 0.14 75)" strokeWidth="0.6"/>
      ))}
    </g>
    {/* small celestial symbols below */}
    <g transform="translate(100, 215)" opacity="0.85">
      <text x="-44" y="0" textAnchor="middle" fontFamily="serif" fontSize="14" fill="oklch(0.45 0.13 25)">☉</text>
      <text x="-22" y="0" textAnchor="middle" fontFamily="serif" fontSize="14" fill="oklch(0.45 0.13 25)">☽</text>
      <text x="0" y="0" textAnchor="middle" fontFamily="serif" fontSize="14" fill="oklch(0.45 0.13 25)">✦</text>
      <text x="22" y="0" textAnchor="middle" fontFamily="serif" fontSize="14" fill="oklch(0.45 0.13 25)">♆</text>
      <text x="44" y="0" textAnchor="middle" fontFamily="serif" fontSize="14" fill="oklch(0.45 0.13 25)">☿</text>
    </g>
  </FaceFrame>
);

// Future — "The Teaching". Tree of knowledge / hand with stars / open book
const CardFaceFuture = () => (
  <FaceFrame romanNumeral="III" title="The Teaching">
    <g transform="translate(100, 135)">
      {/* book */}
      <g transform="translate(0, 30)">
        <path d="M -52 0 L 0 -6 L 52 0 L 52 18 L 0 12 L -52 18 Z"
          fill="oklch(0.55 0.13 65)" stroke="oklch(0.30 0.10 25)" strokeWidth="0.6"/>
        <line x1="0" y1="-6" x2="0" y2="12" stroke="oklch(0.30 0.10 25)" strokeWidth="0.5"/>
        {/* page lines */}
        {[3,7,11].map((y,i)=>(
          <g key={i}>
            <line x1="-44" x2="-6" y1={y-1} y2={y-3} stroke="oklch(0.96 0.03 82)" strokeWidth="0.4" opacity="0.6"/>
            <line x1="6" x2="44" y1={y-3} y2={y-1} stroke="oklch(0.96 0.03 82)" strokeWidth="0.4" opacity="0.6"/>
          </g>
        ))}
      </g>
      {/* rising stars from book */}
      {[[-18,0,5],[0,-15,7],[20,-5,5],[-30,-10,4],[28,-22,4]].map(([x,y,s],i)=>(
        <g key={i} transform={`translate(${x},${y})`}>
          <path d={`M 0 ${-s} L ${s*0.3} ${-s*0.3} L ${s} 0 L ${s*0.3} ${s*0.3} L 0 ${s} L ${-s*0.3} ${s*0.3} L ${-s} 0 L ${-s*0.3} ${-s*0.3} Z`} fill="oklch(0.85 0.14 75)" stroke="oklch(0.45 0.13 25)" strokeWidth="0.3"/>
        </g>
      ))}
      {/* infinity-like loop above */}
      <g transform="translate(0,-40)">
        <path d="M -16 0 Q -16 -8 -8 -8 Q 0 -8 0 0 Q 0 8 8 8 Q 16 8 16 0 Q 16 -8 8 -8 Q 0 -8 0 0 Q 0 8 -8 8 Q -16 8 -16 0 Z"
          fill="none" stroke="oklch(0.45 0.13 25)" strokeWidth="1"/>
      </g>
    </g>
  </FaceFrame>
);

Object.assign(window, {
  CardBack, CardFacePast, CardFacePresent, CardFaceFuture
});
