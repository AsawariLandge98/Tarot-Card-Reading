/* ───── Extras: Booking form (slots-connected), Process, Testimonials, FAQ ───── */

const BACKEND = 'http://127.0.0.1:8000/api';

const READING_TYPES = [
  'Three Card','Celtic Cross','Love Reading','Career Path',
  'Year Ahead','Full Spread','Numerology','Lal Kitab','Vastu',
];

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Send a message",
    body: "WhatsApp Annie at +91 81789 73198. Share your name, date of birth, and what you're sitting with — love, career, family, anything. No formality. Just a hello.",
    action: { label: "Open WhatsApp", href: "https://wa.me/918178973198?text=Namaste%20Annie%20Ji%2C%20I%20would%20like%20to%20book%20a%20reading" },
  },
  {
    num: "02",
    title: "Pick a slot",
    body: "Annie replies within a few hours — usually the same day. Pick a morning, afternoon, or evening that suits you. Sessions run six days a week.",
  },
  {
    num: "03",
    title: "Sit at the table",
    body: "Join over WhatsApp call (voice or video) — or visit the Chattarpur studio in person if you're in Delhi. Bring your questions. Bring a notebook. Hindi or English, whatever's closer to you.",
  },
  {
    num: "04",
    title: "Walk away clearer",
    body: "You leave with the reading written down, the remedies prescribed, and a sense of what to do next. Not vague predictions — practical guidance for the next thirty days.",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya S.",
    city: "Gurgaon",
    rating: 5,
    body: "Annie ji ne mujhe ek bahut bada wrong decision lene se bacha liya. Aapse baat karke aisa laga jaise kisi apne se baat kar rahi hu — calm, honest, no drama. The Lal Kitab remedies actually worked.",
    topic: "Career change",
  },
  {
    name: "Rahul M.",
    city: "Mumbai",
    rating: 5,
    body: "Came in stressed about a business decision. Annie ji patiently listened to every question, no rushing. Her tarot read was specific — she named the partner's first letter and the month it would resolve. Both happened.",
    topic: "Business & partnership",
  },
  {
    name: "Sunita K.",
    city: "Jaipur",
    rating: 5,
    body: "Har baar Annie ji se baat karke saari paresani halki ho jaati hai. She is the kind of reader who tells you the truth gently. Numerology session ne mere bete ka naam suggest kiya — woh ab bahut acche se settle ho gaya hai.",
    topic: "Numerology · Family",
  },
  {
    name: "Vikram & Nandini",
    city: "New Delhi",
    rating: 5,
    body: "Booked the couple compatibility session before our wedding. She didn't sugar-coat — pointed out the friction patterns and what to watch for. Two years in, every single thing she said has been useful. Honest reading.",
    topic: "Love & marriage",
  },
  {
    name: "Anita R.",
    city: "Lucknow",
    rating: 5,
    body: "I joined the tarot card course online. Small batch, real practice on real spreads, and Annie ji answers every question — even after class is over. Six months later I'm reading for friends and family with confidence.",
    topic: "Tarot course",
  },
  {
    name: "Karan B.",
    city: "London",
    rating: 5,
    body: "Booked online from London for a full life-path session. 90 minutes felt like 30. She traced patterns in my life I'd never connected. The vastu adjustments she suggested for the new flat have made a noticeable difference.",
    topic: "Life-path · Vastu",
  },
];

const FAQS = [
  {
    q: "Who is Astro Annie and why should I trust her?",
    a: "Anjlina Singh Marwaha — known to her clients as Astro Annie — is a Delhi-based numerologist, tarot reader, vastu expert and Lal Kitab specialist with twenty-two years of practice. She has read for hundreds of clients across India and abroad, and received the Jyotish Star Award in 2026. She's known for honest, practical readings — never the kind that scare you into booking again.",
  },
  {
    q: "What's the difference between tarot, numerology, Lal Kitab and vastu?",
    a: "Tarot is a listening tool — drawn from the question you bring. Numerology reads the energy in your name and birth date. Lal Kitab works from your kundali and prescribes small, low-cost remedies (an iron ring, a fistful of rice in flowing water, that sort of thing). Vastu addresses the physical space you live or work in. Annie often weaves two or three together in a single sitting.",
  },
  {
    q: "Do I have to be in Delhi for a reading?",
    a: "No. Most sessions happen on WhatsApp voice or video call — that's how clients in Mumbai, Bangalore, Dubai, London and Toronto sit with Annie. If you're in Delhi NCR and prefer to come in person, the Chattarpur studio is open by appointment six days a week.",
  },
  {
    q: "Is the reading available in Hindi?",
    a: "Haan, bilkul. Annie ji reads fluently in Hindi and English and switches between the two as the conversation needs. Many clients prefer to talk about personal matters in their mother tongue — that's encouraged.",
  },
  {
    q: "How long is a typical session, and what does it cost?",
    a: "A tarot or numerology sitting runs 45–60 minutes. A full life-path reading takes 90 minutes. Annie does not watch the clock — sessions often run long when the cards open up something important. Pricing is shared on WhatsApp once you describe what you're looking for; nothing is hidden.",
  },
  {
    q: "Is everything confidential?",
    a: "Always. What you share at the table stays at the table. No recordings are kept beyond what you receive, no client details are shared anywhere — many people bring their most personal matters here, and that trust is the foundation of the practice.",
  },
  {
    q: "Can I learn this from her? Are there courses?",
    a: "Yes — Annie ji runs small-batch courses (six students) in tarot (12 weeks), numerology (8 weeks), and vastu (10 weeks), plus a weekend Lal Kitab intensive. Classes happen in person at the Chattarpur studio or live on video. You finish with a certificate and entry to a private circle of practitioners.",
  },
  {
    q: "How do I actually book?",
    a: "Use the booking form on this page — pick your date, time, and reading type, fill in your details, and we'll confirm within a few hours. Or WhatsApp +91 81789 73198 directly.",
  },
];

/* ────────── helpers ────────── */
function fmtDate(d) {
  if (!d) return '—';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });
}
function fmtTime(t) {
  if (!t) return '—';
  const [h, m] = t.split(':');
  const hh = parseInt(h);
  return `${hh > 12 ? hh - 12 : hh || 12}:${m} ${hh >= 12 ? 'PM' : 'AM'}`;
}

/* ────────── Book a Reading Form ────────── */
const BookReading = () => {
  const { useState, useEffect } = React;

  const [slots, setSlots]           = useState([]);   // all open slots from API
  const [loading, setLoading]       = useState(true);
  const [slotsError, setSlotsError] = useState('');

  // form state
  const [selDate, setSelDate]         = useState('');
  const [selTime, setSelTime]         = useState('');
  const [readingType, setReadingType] = useState('');
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [phone, setPhone]             = useState('');
  const [notes, setNotes]             = useState('');

  // submit state
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);
  const [submitError, setSubmitError] = useState('');

  /* fetch open slots on mount */
  useEffect(() => {
    fetch(`${BACKEND}/slots/?open=1`)
      .then(r => r.json())
      .then(data => { setSlots(data); setLoading(false); })
      .catch(() => {
        setSlotsError('Could not load available slots. Please WhatsApp us to book.');
        setLoading(false);
      });
  }, []);

  /* unique dates from open slots, sorted */
  const availableDates = [...new Set(slots.map(s => s.date))].sort();

  /* times available for selected date */
  const availableTimes = slots
    .filter(s => s.date === selDate)
    .map(s => s.time)
    .sort();

  /* reset time when date changes */
  const handleDateChange = (d) => { setSelDate(d); setSelTime(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selDate || !selTime || !readingType || !name || !email) {
      setSubmitError('Please fill all required fields (*).');
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      const resp = await fetch(`${BACKEND}/bookings/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name:  name,
          email:        email,
          phone:        phone,
          reading_type: readingType,
          booking_date: selDate,
          booking_time: selTime,
          notes:        notes,
          status:       'pending',
          amount:       0,
        }),
      });
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(JSON.stringify(err));
      }
      setSuccess(true);
      // reset form
      setSelDate(''); setSelTime(''); setReadingType('');
      setName(''); setEmail(''); setPhone(''); setNotes('');
    } catch (err) {
      setSubmitError('Something went wrong. Please try WhatsApp instead.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── styles (inline, so no extra CSS file needed) ── */
  const S = {
    section: {
      padding: '90px 6vw 70px',
      maxWidth: '860px',
      margin: '0 auto',
    },
    head: { marginBottom: '44px' },
    eyebrow: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--gold)',
      marginBottom: '12px',
    },
    title: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 'clamp(28px, 4vw, 44px)',
      fontWeight: 500,
      color: 'var(--ivory)',
      lineHeight: 1.2,
      marginBottom: '12px',
    },
    sub: {
      fontSize: '14px',
      color: 'var(--ivory-mu)',
      lineHeight: 1.65,
      maxWidth: '540px',
    },
    card: {
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(175,145,80,0.22)',
      borderRadius: '14px',
      padding: '36px 40px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: '16px',
      marginBottom: '16px',
    },
    label: {
      display: 'block',
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--gold)',
      marginBottom: '7px',
    },
    select: {
      width: '100%',
      background: 'rgba(0,0,0,0.35)',
      border: '1px solid rgba(175,145,80,0.3)',
      borderRadius: '8px',
      color: 'var(--ivory)',
      fontSize: '14px',
      padding: '11px 14px',
      outline: 'none',
      cursor: 'pointer',
      appearance: 'auto',
    },
    input: {
      width: '100%',
      background: 'rgba(0,0,0,0.35)',
      border: '1px solid rgba(175,145,80,0.3)',
      borderRadius: '8px',
      color: 'var(--ivory)',
      fontSize: '14px',
      padding: '11px 14px',
      outline: 'none',
      boxSizing: 'border-box',
    },
    textarea: {
      width: '100%',
      background: 'rgba(0,0,0,0.35)',
      border: '1px solid rgba(175,145,80,0.3)',
      borderRadius: '8px',
      color: 'var(--ivory)',
      fontSize: '14px',
      padding: '11px 14px',
      outline: 'none',
      resize: 'vertical',
      minHeight: '80px',
      boxSizing: 'border-box',
    },
    divider: {
      height: '1px',
      background: 'rgba(175,145,80,0.15)',
      margin: '24px 0',
    },
    btn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '13px 32px',
      background: 'transparent',
      border: '1px solid var(--gold)',
      color: 'var(--gold)',
      fontFamily: "'DM Sans', sans-serif",
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      width: '100%',
      justifyContent: 'center',
    },
    successBox: {
      textAlign: 'center',
      padding: '48px 24px',
    },
    successIcon: {
      fontSize: '48px',
      marginBottom: '16px',
    },
    successTitle: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: '26px',
      color: 'var(--ivory)',
      marginBottom: '10px',
    },
    successSub: {
      fontSize: '14px',
      color: 'var(--ivory-mu)',
      lineHeight: 1.65,
    },
    error: {
      color: '#e07a88',
      fontSize: '13px',
      marginTop: '12px',
      textAlign: 'center',
    },
    note: {
      fontSize: '12px',
      color: 'var(--ivory-mu)',
      marginTop: '10px',
      textAlign: 'center',
      lineHeight: 1.6,
    },
    loadingText: {
      color: 'var(--ivory-mu)',
      fontSize: '14px',
      textAlign: 'center',
      padding: '24px 0',
    },
    noSlots: {
      color: 'var(--ivory-mu)',
      fontSize: '13px',
      textAlign: 'center',
      padding: '24px 0',
      lineHeight: 1.7,
    },
    slotCount: {
      fontSize: '12px',
      color: 'var(--gold)',
      marginTop: '6px',
      fontWeight: 600,
    },
  };

  return (
    <section id="book-reading" data-screen-label="04 Book a Reading" style={S.section}>
      <div style={S.head}>
        <div style={S.eyebrow} className="rp-eyebrow">Book a session</div>
        <h2 style={S.title}>
          Reserve your seat <span className="serif-italic">at the table.</span>
        </h2>
        <p style={S.sub}>
          Pick an available slot below — only open times are shown. We confirm within a few hours.
        </p>
      </div>

      <div style={S.card}>
        {success ? (
          <div style={S.successBox}>
            <div style={S.successIcon}>✦</div>
            <div style={S.successTitle}>Booking received.</div>
            <p style={S.successSub}>
              Thank you! Annie ji will confirm your slot via WhatsApp or email shortly.<br/>
              Please keep an eye on your inbox.
            </p>
            <p style={{...S.note, marginTop: '20px'}}>
              Questions? <a href="https://wa.me/918178973198" style={{color:'var(--gold)'}}>WhatsApp us</a>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>

            {/* ── Slot picker ── */}
            {loading ? (
              <div style={S.loadingText}>Loading available slots…</div>
            ) : slotsError ? (
              <div style={S.noSlots}>
                ⚠ {slotsError}<br/>
                <a href="https://wa.me/918178973198" style={{color:'var(--gold)'}}>Open WhatsApp →</a>
              </div>
            ) : availableDates.length === 0 ? (
              <div style={S.noSlots}>
                No open slots right now.<br/>
                <a href="https://wa.me/918178973198" style={{color:'var(--gold)'}}>WhatsApp Annie ji to check availability →</a>
              </div>
            ) : (
              <>
                <div style={S.grid}>
                  {/* Date picker */}
                  <div>
                    <label style={S.label}>Date *</label>
                    <select
                      style={S.select}
                      value={selDate}
                      onChange={e => handleDateChange(e.target.value)}
                      required
                    >
                      <option value="">— Choose a date —</option>
                      {availableDates.map(d => (
                        <option key={d} value={d}>{fmtDate(d)}</option>
                      ))}
                    </select>
                    {availableDates.length > 0 && (
                      <div style={S.slotCount}>{availableDates.length} date{availableDates.length > 1 ? 's' : ''} available</div>
                    )}
                  </div>

                  {/* Time picker */}
                  <div>
                    <label style={S.label}>Time *</label>
                    <select
                      style={{...S.select, opacity: selDate ? 1 : 0.5}}
                      value={selTime}
                      onChange={e => setSelTime(e.target.value)}
                      disabled={!selDate}
                      required
                    >
                      <option value="">— Choose a time —</option>
                      {availableTimes.map(t => (
                        <option key={t} value={t}>{fmtTime(t)}</option>
                      ))}
                    </select>
                    {selDate && availableTimes.length > 0 && (
                      <div style={S.slotCount}>{availableTimes.length} slot{availableTimes.length > 1 ? 's' : ''} open</div>
                    )}
                  </div>
                </div>

                {/* Reading type */}
                <div style={{marginBottom: '16px'}}>
                  <label style={S.label}>Reading type *</label>
                  <select
                    style={S.select}
                    value={readingType}
                    onChange={e => setReadingType(e.target.value)}
                    required
                  >
                    <option value="">— What would you like? —</option>
                    {READING_TYPES.map(rt => (
                      <option key={rt} value={rt}>{rt}</option>
                    ))}
                  </select>
                </div>

                <div style={S.divider}/>

                {/* Personal details */}
                <div style={S.grid}>
                  <div>
                    <label style={S.label}>Your name *</label>
                    <input
                      style={S.input}
                      type="text"
                      placeholder="Full name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label style={S.label}>Email *</label>
                    <input
                      style={S.input}
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{...S.grid, marginTop: '16px'}}>
                  <div>
                    <label style={S.label}>WhatsApp / Phone</label>
                    <input
                      style={S.input}
                      type="tel"
                      placeholder="+91 _____ _____"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={S.label}>Anything to share?</label>
                    <textarea
                      style={{...S.textarea, minHeight: '46px'}}
                      placeholder="One-line note (optional)"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                    />
                  </div>
                </div>

                {submitError && <div style={S.error}>{submitError}</div>}

                <div style={{marginTop: '24px'}}>
                  <button
                    type="submit"
                    style={{...S.btn, opacity: submitting ? 0.6 : 1}}
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting…' : '✦ Confirm Booking Request'}
                  </button>
                  <p style={S.note}>
                    We'll confirm via WhatsApp or email · No payment now · Free to reschedule
                  </p>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </section>
  );
};

/* ────────── How-it-works section ────────── */
const BookingProcess = () => (
  <section className="booking" data-screen-label="05 How It Works">
    <div className="section-head">
      <div className="rp-eyebrow">How a sitting works</div>
      <h2 className="section-title">
        Simple. Private. <span className="serif-italic">By appointment.</span>
      </h2>
      <p className="section-sub">
        Four steps from the message you send to the answers you walk away with.
      </p>
    </div>

    <ol className="step-grid">
      {PROCESS_STEPS.map((s, i) => (
        <li key={i} className="step">
          <div className="step-num">{s.num}</div>
          <div className="step-thread" aria-hidden="true"/>
          <h3 className="step-title">{s.title}</h3>
          <p className="step-body">{s.body}</p>
          {s.action && (
            <a className="step-action" href={s.action.href} target="_blank" rel="noopener">
              {s.action.label} <span aria-hidden="true">→</span>
            </a>
          )}
        </li>
      ))}
    </ol>
  </section>
);

/* ────────── Testimonials section ────────── */
const Testimonials = () => (
  <section className="testimonials" data-screen-label="06 Testimonials">
    <div className="section-head">
      <div className="rp-eyebrow">What clients say</div>
      <h2 className="section-title">
        Real voices.<br/>
        <span className="serif-italic">Read theirs.</span>
      </h2>
      <p className="section-sub">
        Notes from clients across India and abroad — names changed where asked, words unedited.
      </p>
    </div>

    <div className="testi-grid">
      {TESTIMONIALS.map((t, i) => (
        <figure key={i} className="testi" style={{'--rot': `${((i * 1.7) % 3 - 1) * 0.6}deg`}}>
          <div className="testi-stars" aria-label={`${t.rating} stars`}>
            {Array.from({length: t.rating}).map((_, j) => <span key={j}>★</span>)}
          </div>
          <blockquote className="testi-body">{t.body}</blockquote>
          <figcaption className="testi-caption">
            <div className="testi-name">{t.name}</div>
            <div className="testi-meta">{t.city} · {t.topic}</div>
          </figcaption>
        </figure>
      ))}
    </div>

    <div className="testi-footer">
      <div className="testi-stat">
        <div className="stat-num">22<span>yrs</span></div>
        <div className="stat-label">Practice</div>
      </div>
      <div className="testi-stat">
        <div className="stat-num">600<span>+</span></div>
        <div className="stat-label">Sittings</div>
      </div>
      <div className="testi-stat">
        <div className="stat-num">4.9<span>★</span></div>
        <div className="stat-label">Average</div>
      </div>
      <div className="testi-stat">
        <div className="stat-num">9<span>countries</span></div>
        <div className="stat-label">Clients in</div>
      </div>
    </div>
  </section>
);

/* ────────── FAQ section ────────── */
const FAQ = () => {
  const [open, setOpen] = React.useState(0);
  return (
    <section className="faq" data-screen-label="07 FAQ" id="faq">
      <div className="section-head">
        <div className="rp-eyebrow">Questions before you sit down</div>
        <h2 className="section-title">
          Things people ask <span className="serif-italic">before they book.</span>
        </h2>
      </div>

      <div className="faq-list">
        {FAQS.map((f, i) => (
          <div key={i} className={`faq-item ${open === i ? "faq-open" : ""}`}>
            <button
              type="button"
              className="faq-q"
              onClick={() => setOpen(open === i ? -1 : i)}
              aria-expanded={open === i}
            >
              <span className="faq-q-text">{f.q}</span>
              <span className="faq-toggle" aria-hidden="true">{open === i ? "−" : "+"}</span>
            </button>
            <div className="faq-a-wrap" style={{
              maxHeight: open === i ? "320px" : "0",
              opacity: open === i ? 1 : 0,
            }}>
              <p className="faq-a">{f.a}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="faq-cta">
        <p>Still wondering? <a href="https://wa.me/918178973198?text=Namaste%20Annie%20Ji%2C%20I%20have%20a%20question%20before%20booking">WhatsApp Annie ji directly</a> — no obligation.</p>
      </div>
    </section>
  );
};

/* ────────── Inquiry / Contact Section ────────── */
const InquirySection = () => {
  const { useState } = React;

  const [form, setForm]         = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all fields.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const r = await fetch('http://127.0.0.1:8000/api/inquiries/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!r.ok) throw new Error('Failed');
      setSuccess(true);
      setForm({ name: '', email: '', message: '' });
    } catch {
      setError('Something went wrong. Please WhatsApp us instead.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      style={{
        position: 'relative',
        zIndex: 2,
        padding: '100px 8vw 80px',
        maxWidth: '780px',
        margin: '0 auto',
      }}
      id="contact"
    >
      {/* Section head */}
      <div className="section-head" style={{ textAlign: 'left', margin: '0 0 48px' }}>
        <div className="rp-eyebrow" style={{ marginBottom: 14 }}>Write to Annie</div>
        <h2 className="section-title" style={{ fontSize: 'clamp(32px, 3.6vw, 52px)' }}>
          A question before <span className="serif-italic">you sit down?</span>
        </h2>
        <p className="section-sub" style={{ marginTop: 16 }}>
          Leave a message — Annie ji or the studio team replies within the day.
          No pressure. No obligation. Just ask.
        </p>
      </div>

      {/* Decorative rule */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(to right, var(--gold) 0%, transparent 80%)',
        marginBottom: '40px',
        opacity: 0.35,
      }}/>

      {success ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>✦</div>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '26px',
            color: 'var(--ivory)',
            marginBottom: '12px',
          }}>Message received.</h3>
          <p style={{
            color: 'var(--ivory-mu)',
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '17px',
            lineHeight: 1.6,
          }}>
            Annie ji will reply within the day via email.<br/>
            Or reach her directly on{' '}
            <a href="https://wa.me/918178973198" style={{ color: 'var(--gold)' }}>
              WhatsApp
            </a>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
          {/* Name + Email row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: '8px',
              }}>Your name</label>
              <input
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid oklch(0.55 0.13 65 / 0.45)',
                  padding: '10px 0',
                  color: 'var(--ivory)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderBottomColor = 'var(--gold)'}
                onBlur={e => e.target.style.borderBottomColor = 'oklch(0.55 0.13 65 / 0.45)'}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: '8px',
              }}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid oklch(0.55 0.13 65 / 0.45)',
                  padding: '10px 0',
                  color: 'var(--ivory)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderBottomColor = 'var(--gold)'}
                onBlur={e => e.target.style.borderBottomColor = 'oklch(0.55 0.13 65 / 0.45)'}
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: '8px',
            }}>Your message</label>
            <textarea
              placeholder="What's on your mind? Ask anything — questions about readings, courses, availability…"
              value={form.message}
              onChange={e => set('message', e.target.value)}
              required
              rows={5}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid oklch(0.55 0.13 65 / 0.45)',
                padding: '10px 0',
                color: 'var(--ivory)',
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                outline: 'none',
                resize: 'none',
                boxSizing: 'border-box',
                lineHeight: 1.65,
              }}
              onFocus={e => e.target.style.borderBottomColor = 'var(--gold)'}
              onBlur={e => e.target.style.borderBottomColor = 'oklch(0.55 0.13 65 / 0.45)'}
            />
          </div>

          {error && (
            <div style={{ color: '#b55', fontFamily: 'var(--font-body)', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                background: 'transparent',
                border: '1px solid var(--gold)',
                color: 'var(--gold)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                padding: '13px 36px',
                cursor: 'pointer',
                borderRadius: '3px',
                opacity: submitting ? 0.6 : 1,
                transition: 'all 0.2s',
              }}
              onMouseOver={e => { e.target.style.background = 'var(--gold)'; e.target.style.color = 'var(--velvet-0)'; }}
              onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--gold)'; }}
            >
              {submitting ? 'Sending…' : 'Send message →'}
            </button>

            <a
              href="https://wa.me/918178973198?text=Namaste%20Annie%20Ji%2C%20I%20have%20a%20question"
              target="_blank"
              rel="noopener"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--ivory-mu)',
                textDecoration: 'none',
                borderBottom: '1px solid transparent',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => { e.target.style.color = 'var(--gold)'; e.target.style.borderBottomColor = 'var(--gold)'; }}
              onMouseOut={e => { e.target.style.color = 'var(--ivory-mu)'; e.target.style.borderBottomColor = 'transparent'; }}
            >
              Or WhatsApp directly →
            </a>
          </div>
        </form>
      )}
    </section>
  );
};

Object.assign(window, { BookReading, BookingProcess, Testimonials, FAQ, InquirySection });