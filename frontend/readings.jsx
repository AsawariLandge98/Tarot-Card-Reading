/* ───── Reading content — three sections that scroll into view ───── */

const READINGS = [
  {
    roman: "I",
    position: "Past",
    title: "The Beginning",
    kicker: "About the Reader",
    portrait: true,
    lede: "Three decades at the velvet table. Twenty-two years of practice. The cards have a long memory, and so does Anjlina.",
  },
  {
    roman: "II",
    position: "Present",
    title: "The Reading",
    kicker: "What is offered",
    lede: "What you bring to the table is heard. What the cards say is honest. Six ways to sit down.",
    services: [
      { name: "Tarot Card Reading",  desc: "Three-card or full Celtic-cross spread. Bring one clear question.",          tag: "60 min"  },
      { name: "Lal Kitab Remedies",  desc: "Custom upaay drawn from your kundali — simple, low-cost, prescribed for thirty days.", tag: "Custom"  },
      { name: "Love & Relationship", desc: "Couple compatibility, synastry, and what the cards say about timing.",        tag: "45 min"  },
      { name: "Career & Finance",    desc: "Job, business, money flow. Numerology paired with tarot for direction.",      tag: "45 min"  },
      { name: "Full Life-Path",      desc: "Birth-chart, numerology, and a one-year tarot forecast in a single sitting.", tag: "90 min"  },
      { name: "Vastu Consultation",  desc: "Home or workplace. On-site visit or floor-plan review across NCR.",           tag: "On site" },
    ],
  },
  {
    roman: "III",
    position: "Future",
    title: "The Teaching",
    kicker: "Courses Available",
    lede: "What was given to you must be passed on. Become the reader. Small batches, taught at the table.",
    courses: [
      { name: "Tarot Card Course",  desc: "78 cards, three spreads, and the ethics of reading. Live demo sessions throughout.", tag: "12 weeks" },
      { name: "Numerology Course",  desc: "Pythagorean and Chaldean systems. Read names, dates, and life-paths fluently.",        tag: "8 weeks"  },
      { name: "Vastu Course",       desc: "Directional study, dosh diagnosis, and the remedies that actually move energy.",       tag: "10 weeks" },
      { name: "Lal Kitab Workshop", desc: "Intensive two-day primer on the Red Book — chart reading and quick remedies.",         tag: "Weekend"  },
    ],
    footnote: "Small batches of six. In-person at the Chattarpur studio or live on video. Certificate provided.",
  },
];

const Credentials = () => (
  <ul className="creds">
    <li><span className="dot"/> Numerologist · 22+ years</li>
    <li><span className="dot"/> Certified Tarot Card Reader</li>
    <li><span className="dot"/> Lal Kitab Specialist</li>
    <li><span className="dot"/> Vastu Expert</li>
    <li><span className="dot"/> Birth-chart astrology</li>
    <li><span className="dot"/> Jyotish Star Award — 2026</li>
  </ul>
);

// Single reading panel — full viewport, card on left, content on right
const ReadingPanel = ({ idx, cardBack }) => {
  const r = READINGS[idx];
  const FaceComp = [CardFacePast, CardFacePresent, CardFaceFuture][idx];
  const sectionRef = React.useRef(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setInView(true)),
      { threshold: 0.15, rootMargin: "-10% 0px" }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const id = ["past","present","future"][idx];
  return (
    <section
      ref={sectionRef}
      id={id}
      data-screen-label={`0${idx+2} ${r.position}`}
      className={`rp ${inView ? "rp-in" : ""}`}
    >
      <div className="rp-card-wrap">
        <div className="rp-card" style={{perspective: 1600}}>
          <div className="rp-card-flip">
            <div className="rp-card-back"><CardBack variant={cardBack}/></div>
            <div className="rp-card-face"><FaceComp/></div>
          </div>
        </div>
        <div className="rp-card-label">
          <div className="rp-roman">{r.roman}</div>
          <div className="rp-pos">{r.position}</div>
        </div>
      </div>

      <div className="rp-body">
        <div className="rp-eyebrow">{r.kicker}</div>
        <h2 className="rp-title">{r.title}</h2>
        <p className="rp-lede">{r.lede}</p>

        {r.portrait && (
          <div className="rp-portrait-row">
            <div className="portrait-wrap">
              <img src="assets/annie-portrait.jpg" alt="Anjlina Singh Marwaha"/>
            </div>
            <div className="rp-bio">
              <p>Anjlina Singh Marwaha — known to her clients as <em>Astro Annie</em> — has read for hundreds of seekers from her practice in Rajpur Khurd, New Delhi. She works in the lineage of Lal Kitab and the language of numerology, with the tarot as her listening tool.</p>
              <p style={{marginTop: 12}}>Quiet. Practical. Direct. The reading you came for, with the remedy you didn't know to ask for.</p>
            </div>
          </div>
        )}

        {r.portrait && <Credentials/>}

        {(r.services || r.courses) && (
          <div className="item-list">
            {(r.services || r.courses).map((s, i) => (
              <div className="item" key={i}>
                <div className="item-num">{String(i+1).padStart(2,'0')}</div>
                <div>
                  <div className="item-head">{s.name}</div>
                  <div className="item-desc">{s.desc}</div>
                </div>
                <div className="item-tag">{s.tag}</div>
              </div>
            ))}
          </div>
        )}

        {r.footnote && (
          <p className="rp-footnote">{r.footnote}</p>
        )}

        <div className="cta-row">
          <a className="btn-primary" href="book.html" target="_blank" rel="noopener">Book a Sitting</a>
          {idx < 2 && (
            <a className="btn-ghost" href={`#${["present","future"][idx]}`}>
              Next card →
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

Object.assign(window, { ReadingPanel, READINGS, Credentials });
