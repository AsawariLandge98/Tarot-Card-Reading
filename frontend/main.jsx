/* ───── Main app: scroll-driven reading-table experience ───── */

const { useState, useEffect, useRef } = React;

// helpers
const clamp = (v, a=0, b=1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeIO = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;

const STAGES = {
  IDLE:    [0.00, 0.08],
  SHUFFLE: [0.08, 0.32],
  FAN:     [0.32, 0.55],
  DEAL:    [0.55, 0.88],
  SETTLE:  [0.88, 1.00],
};

const stageP = (p, [a,b]) => clamp((p - a) / (b - a));

const DECK_COUNT = 10;

// Returns the transform values for card i at progress p.
function deckCardTransform(i, p) {
  const shuf = stageP(p, STAGES.SHUFFLE);
  const fan  = stageP(p, STAGES.FAN);
  const deal = stageP(p, STAGES.DEAL);

  // base — stacked at center, slight offset for depth
  let x = -i * 0.4;
  let y = -i * 0.6;
  let z = i * 0.3;
  let rot = ((i * 7) % 5) - 2; // -2..2 jitter
  let opacity = 1;
  let scale = 1;

  // ── SHUFFLE ──
  if (shuf > 0) {
    const t = shuf;
    const fade = 1 - t; // dies out as we approach fan
    const phase  = Math.sin(t * Math.PI * 7 + i * 0.7);
    const phase2 = Math.cos(t * Math.PI * 9 + i * 1.3);
    x += phase  * 14 * fade;
    y += phase2 * 8  * fade;
    rot += phase * 6 * fade;
    // tiny scale pulse
    scale = 1 + Math.sin(t * Math.PI * 12 + i) * 0.02 * fade;
  }

  // ── FAN ──
  if (fan > 0) {
    const t = easeOut(fan);
    const half = (DECK_COUNT - 1) / 2;
    const offset = i - half;
    const fanAngle = offset * 9; // -40..40
    const fanRadius = 230;
    // fan upward, like a hand of cards held above the table
    const fx = Math.sin(fanAngle * Math.PI / 180) * fanRadius;
    const fy = -Math.abs(offset) * 4 - 30; // slight arc lift
    x = lerp(x, fx, t);
    y = lerp(y, fy, t);
    rot = lerp(rot, fanAngle, t);
    z = lerp(z, i * 0.8, t);
  }

  // ── DEAL ──
  if (deal > 0) {
    // top 3 (i=0..2) fly out to positions; the rest gather back to a tidy stack
    const targets = [
      { x: -280, y: 30, rot: 0 },  // Past
      { x:    0, y: 30, rot: 0 },  // Present
      { x:  280, y: 30, rot: 0 },  // Future
    ];

    if (i < 3) {
      // stagger start times
      const delay = i * 0.13;
      const local = clamp((deal - delay) / 0.45);
      const e = easeOut(local);
      const target = targets[i];
      x = lerp(x, target.x, e);
      y = lerp(y, target.y, e);
      rot = lerp(rot, target.rot, e);
      // arc lift
      y -= Math.sin(local * Math.PI) * 60;
      z = 100 + i;
    } else {
      // collapse rest back to tidy stack just below the candle, slightly to right
      const t = easeOut(deal);
      const idx = i - 3;
      x = lerp(x, 240 + idx * 0.4, t);
      y = lerp(y, -120 + idx * 0.6, t);
      rot = lerp(rot, -6 + (idx * 3) % 4, t);
      scale = lerp(scale, 0.55, t);
      opacity = lerp(opacity, 0.7, t);
      z = lerp(z, idx * 0.3, t);
    }
  }

  return { x, y, rot, z, opacity, scale };
}

const TopBar = () => (
  <div className="top-bar">
    <div className="mark">
      <div className="mark-glyph">A</div>
      <div className="mark-name">Astro Annie</div>
      <div className="mark-domain">astroanjilina.com</div>
    </div>
    <div className="nav-actions">
      <a href="#past">The Reader</a>
      <a href="#present">Services</a>
      <a href="#future">Training</a>
     
      <button className="book-btn"><a href="book.html">Book</a></button>
    </div>
  </div>
);

const Footer = () => (
  <footer className="footer-band">
    <div className="footer-inner">
      <div>
        <div className="eyebrow" style={{marginBottom: 14}}>The Studio</div>
        <h3 className="footer-headline">
          The cards are waiting.<br/>
          <span className="em">Come sit down.</span>
        </h3>
      </div>
      <div className="footer-col">
        <h4>Visit</h4>
        <p>20–21 Flat A-2, UGF<br/>
        Ramchander Market, Gali No. 1<br/>
        Rajpur Khurd Extension, Chattarpur<br/>
        New Delhi — 110068</p>
      </div>
      <div className="footer-col">
        <h4>Reach</h4>
        <a href="https://wa.me/918178973198?text=Namaste%20Annie%20Ji%2C%20I%20would%20like%20to%20book%20a%20reading" target="_blank" rel="noopener">+91 81789 73198</a>
        <a href="mailto:hello@astroanjilina.com">hello@astroanjilina.com</a>
        <a href="https://astroanjilina.com">astroanjilina.com</a>
      </div>
    </div>
    <div className="footer-sig">
      <span>© Anjlina Singh Marwaha · {new Date().getFullYear()}</span>
      <span>Jyotish Star Award · 2026</span>
    </div>
  </footer>
);

const ShuffleText = () => (
  <div style={{
    position: "absolute",
    left: "50%",
    top: "32%",
    transform: "translate(-50%, -50%)",
    zIndex: 7,
    fontFamily: "JetBrains Mono, monospace",
    fontSize: 11,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "var(--gold)",
    pointerEvents: "none",
  }}>
    <span style={{animation: "shuf 1.2s steps(4) infinite"}}>shuffling…</span>
    <style>{`
      @keyframes shuf { 0% { opacity: 0.4 } 50% { opacity: 1 } 100% { opacity: 0.4 } }
    `}</style>
  </div>
);

const Embers = ({ active }) => {
  const [pts] = useState(() => Array.from({length: 18}).map((_,i) => ({
    x: 40 + Math.random() * 20, // % horizontal start
    delay: i * 0.6 + Math.random(),
    duration: 5 + Math.random() * 4,
    drift: (Math.random() - 0.5) * 18,
    size: 1 + Math.random() * 1.8,
  })));
  if (!active) return null;
  return (
    <div className="embers">
      {pts.map((p, i) => (
        <span
          key={i}
          className="ember"
          style={{
            left: `${p.x}%`,
            top: `38%`,
            width: p.size,
            height: p.size,
            animation: `emberFly ${p.duration}s ease-out ${p.delay}s infinite`,
            '--drift': `${p.drift}vw`,
          }}
        />
      ))}
      <style>{`
        @keyframes emberFly {
          0%   { opacity: 0; transform: translate(0,0) scale(0.6); }
          10%  { opacity: 1; }
          70%  { opacity: 0.8; }
          100% { opacity: 0; transform: translate(var(--drift), -55vh) scale(0.3); }
        }
      `}</style>
    </div>
  );
};

const IS_DAY = (typeof window !== 'undefined' && window.__THEME === 'day');

const App = () => {
  const [progress, setProgress] = useState(0);
  const stageWrapRef = useRef(null);

  const [t, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "candle_lit": true,
    "velvet_hue": "wine",
    "card_back": "star",
    "embers": true
  }/*EDITMODE-END*/);

  // For day theme: override defaults once on mount (don't touch the editmode block)
  React.useEffect(() => {
    if (IS_DAY) setTweak({ candle_lit: false, embers: false });
  }, []);

  // Velvet color override (night theme only — day theme owns its palette via CSS)
  useEffect(() => {
    if (IS_DAY) return;
    const root = document.documentElement;
    const hueMap = {
      wine:     { v0: '0.09 0.03 22',  v1: '0.14 0.06 24',  v2: '0.19 0.10 25',  v3: '0.26 0.14 26'  },
      forest:   { v0: '0.09 0.03 165', v1: '0.13 0.06 158', v2: '0.18 0.09 152', v3: '0.24 0.12 148' },
      midnight: { v0: '0.07 0.04 270', v1: '0.11 0.07 268', v2: '0.16 0.10 266', v3: '0.22 0.13 264' },
    };
    const h = hueMap[t.velvet_hue] || hueMap.wine;
    root.style.setProperty('--velvet-0', `oklch(${h.v0})`);
    root.style.setProperty('--velvet-1', `oklch(${h.v1})`);
    root.style.setProperty('--velvet-2', `oklch(${h.v2})`);
    root.style.setProperty('--velvet-3', `oklch(${h.v3})`);
  }, [t.velvet_hue]);

  // Scroll → progress
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const wrap = stageWrapRef.current;
        if (!wrap) return;
        const rect = wrap.getBoundingClientRect();
        const total = wrap.offsetHeight - window.innerHeight;
        const p = clamp(-rect.top / total);
        setProgress(p);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const settle = stageP(progress, STAGES.SETTLE);
  const shuf = stageP(progress, STAGES.SHUFFLE);
  const dealing = stageP(progress, STAGES.DEAL);

  return <>
    <div className="velvet" />

    <TopBar />

    <div className="stage-wrap" ref={stageWrapRef} data-screen-label="01 Reading Table">
      <div className="stage">
        <div className="stage-inner">

          {/* candle glow */}
          <div className="glow" style={{
            opacity: t.candle_lit ? lerp(0.75, 1.1, easeOut(progress)) : 0.3,
            transform: `translate(-50%, -50%) scale(${1 + progress * 0.15})`,
          }}/>

          {/* candle */}
          <div className="candle" style={{
            transform: `translate(-50%, -50%) translateY(${-progress * 12}px)`,
          }}>
            <Candle lit={t.candle_lit}/>
          </div>

          {/* embers */}
          <Embers active={t.embers && t.candle_lit}/>

          {/* hero copy */}
          <div className="hero-copy" style={{
            opacity: 1 - clamp(progress * 4),
            transform: `translate(-50%, calc(-50% - ${progress * 80}px))`,
          }}>
            <div className="eyebrow">Tarot · Numerology · Lal Kitab · Vastu</div>
            <h1>Pull up a chair.<br/><span className="serif-italic">{IS_DAY ? "The light is good." : "Light the candle."}</span></h1>
            <div className="sub">
              A three-card reading with <span className="name">Anjlina Singh Marwaha</span>
            </div>
          </div>

          {/* shuffling text */}
          {shuf > 0.05 && shuf < 0.95 && <ShuffleText/>}

          {/* dealing prompt */}
          {dealing > 0.05 && dealing < 0.95 && (
            <div style={{
              position: "absolute", left: "50%", top: "30%",
              transform: "translate(-50%, -50%)",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase",
              color: "var(--gold)", zIndex: 7, pointerEvents: "none",
            }}>
              <span>Past · Present · Future</span>
            </div>
          )}

          {/* the deck */}
          <div className="cards-layer">
            {Array.from({length: DECK_COUNT}).map((_, i) => {
              const tx = deckCardTransform(i, progress);
              const isReadCard = i < 3;
              const isClickable = isReadCard && settle > 0.2;
              return (
                <div
                  key={i}
                  className="card"
                  onClick={() => {
                    if (!isClickable) return;
                    const id = ["past","present","future"][i];
                    const el = document.getElementById(id);
                    if (el) window.scrollTo({top: el.offsetTop - 40, behavior: 'smooth'});
                  }}
                  onMouseEnter={(e) => {
                    if (!isClickable) return;
                    e.currentTarget.style.setProperty('--hover-lift', '-18px');
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.setProperty('--hover-lift', '0px');
                  }}
                  style={{
                    transform: `translate3d(${tx.x}px, calc(${tx.y}px + var(--hover-lift, 0px)), ${tx.z}px) rotate(${tx.rot}deg) scale(${tx.scale})`,
                    opacity: tx.opacity,
                    zIndex: 100 + Math.round(tx.z * 10),
                    pointerEvents: isClickable ? 'auto' : 'none',
                    transition: 'transform .35s cubic-bezier(.2, .8, .2, 1.05)',
                  }}
                >
                  <div className="card-inner">
                    <div className="card-back"><CardBack variant={t.card_back}/></div>
                  </div>
                  {isReadCard && (
                    <div className={`card-label ${settle > 0.3 ? 'show' : ''}`}>
                      <div className="roman">{['I','II','III'][i]}</div>
                      <div className="name">{['Past · About','Present · Services','Future · Training'][i]}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* choose-a-card prompt */}
          <div className={`choose-prompt ${settle > 0.3 ? 'show' : ''}`}>
            <div className="line">Tap a card — or scroll on for the full reading.</div>
          </div>

        </div>
      </div>
    </div>

    {/* Three inline reading sections */}
    <ReadingPanel idx={0} cardBack={t.card_back}/>
    <ReadingPanel idx={1} cardBack={t.card_back}/>
    <ReadingPanel idx={2} cardBack={t.card_back}/>

    {/* Booking process · Testimonials · FAQ */}
    <BookingProcess />
    <Testimonials />
    <FAQ />

    {/* Inquiry / Contact section — before footer */}
    <InquirySection />

    {/* scroll hint — fades out as user scrolls */}
    <div className="scroll-hint" style={{opacity: 1 - clamp(progress * 5)}}>
      <div className="eyebrow">Scroll to deal</div>
      <span className="arrow"/>
    </div>

    {/* footer */}
    <Footer />

    {/* Tweaks panel */}
    <TweaksPanel title="Reading Table">
      <TweakSection label="Atmosphere">
        <TweakToggle label="Candle lit"
          value={t.candle_lit} onChange={v => setTweak('candle_lit', v)}/>
        <TweakToggle label="Floating embers"
          value={t.embers} onChange={v => setTweak('embers', v)}/>
        <TweakRadio label="Velvet"
          value={t.velvet_hue}
          options={["wine","forest","midnight"]}
          onChange={v => setTweak('velvet_hue', v)}/>
      </TweakSection>
      <TweakSection label="The Deck">
        <TweakRadio label="Card back"
          value={t.card_back}
          options={["star","moon","diamond"]}
          onChange={v => setTweak('card_back', v)}/>
      </TweakSection>
    </TweaksPanel>
  </>;
};

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);