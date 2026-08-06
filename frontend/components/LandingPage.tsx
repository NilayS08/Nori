"use client"

import { useState, useEffect, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

// ── Icons ─────────────────────────────────────────────────────────────────────
interface IconProps {
  d: string | string[]
  size?: number
  stroke?: number
}

function Icon({ d, size = 24, stroke = 2 }: IconProps) {
  const paths = Array.isArray(d) ? d : [d]
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  )
}

const Icons: Record<string, string | string[]> = {
  wave: 'M2 12c.5-2 2-3 3.5-3s3 2.5 5 2.5 3.5-3 5-3 3 1 3.5 3',
  zap: 'M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z',
  shield: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
  sparkle: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z',
  leaf: [
    'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z',
    'M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12',
  ],
  trend_up: ['M22 7l-8.5 8.5-5-5L2 17', 'M16 7h6v6'],
}

// ── Shared helpers ────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function FadeIn({ children, delay = 0, style = {} }: { children: ReactNode; delay?: number; style?: CSSProperties }) {
  const { ref, visible } = useInView()
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)', transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`, ...style }}>
      {children}
    </div>
  )
}

// ── Background orbs ───────────────────────────────────────────────────────────
function LandingOrbs() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      <div style={{ position: 'absolute', top: '-15%', left: '-8%', width: 900, height: 900, background: 'radial-gradient(circle, rgba(79,70,229,0.22) 0%, transparent 65%)', animation: 'float-orb 22s ease-in-out infinite', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', top: '25%', right: '-12%', width: 700, height: 700, background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 65%)', animation: 'float-orb 28s ease-in-out infinite reverse', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '20%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 65%)', animation: 'float-orb 24s ease-in-out infinite 10s', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', top: '60%', right: '25%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 65%)', animation: 'float-orb 18s ease-in-out infinite 4s', borderRadius: '50%' }} />
    </div>
  )
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function LandingNav({ onStart }: { onStart: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
      zIndex: 200, display: 'flex', alignItems: 'center', gap: 4,
      padding: '7px 10px', width: 'min(820px, calc(100vw - 40px))',
      background: scrolled ? 'rgba(8,8,16,0.82)' : 'rgba(8,8,16,0.6)',
      backdropFilter: 'blur(40px) saturate(200%)', WebkitBackdropFilter: 'blur(40px) saturate(200%)',
      border: '1px solid rgba(255,255,255,0.09)', borderRadius: 100,
      transition: 'background 0.3s ease',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '5px 14px', marginRight: 6 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg, #6b7cff 0%, #a78bfa 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(107,124,255,0.55)' }}>
          <Icon d={Icons.wave} size={14} stroke={2.5} />
        </div>
        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: '-0.04em', color: '#f0f0f5' }}>nori</span>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: 2, flex: 1 }}>
        {['Product', 'How it works', 'About'].map(item => (
          <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} style={{ padding: '7px 16px', borderRadius: 100, fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseEnter={e => (e.currentTarget.style.color = '#f0f0f5')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}>{item}</a>
        ))}
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={onStart} style={{ padding: '8px 20px', borderRadius: 100, fontSize: 13, fontWeight: 600, border: 'none', background: 'linear-gradient(135deg, #6b7cff 0%, #a78bfa 100%)', color: '#fff', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 0 20px rgba(107,124,255,0.4)', transition: 'all 0.2s ease' }} onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 30px rgba(107,124,255,0.65)')} onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 20px rgba(107,124,255,0.4)')}>Start Free</button>
      </div>
    </nav>
  )
}

// ── Section 1: Hero ───────────────────────────────────────────────────────────
function HeroSection({ onStart }: { onStart: () => void }) {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { setTimeout(() => setLoaded(true), 80) }, [])

  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 100, paddingBottom: 80, position: 'relative', zIndex: 1 }}>
      {/* Eyebrow */}
      <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.6s ease 0.1s', display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 16px 6px 10px', borderRadius: 100, marginBottom: 40, background: 'rgba(107,124,255,0.1)', border: '1px solid rgba(107,124,255,0.2)' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#818cf8', animation: 'pulse-dot 2s ease-in-out infinite' }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: '#818cf8', letterSpacing: '0.07em' }}>AI-POWERED FINANCIAL COMPANION</span>
      </div>

      {/* Headline */}
      <h1 style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.7s ease 0.2s', margin: '0 0 24px', fontFamily: "'Inter', sans-serif", fontSize: 'clamp(52px, 6vw, 82px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.04em', color: '#f0f0f5', textAlign: 'center', maxWidth: 860 }}>
        Know exactly how much<br />
        <span style={{ background: 'linear-gradient(135deg, #818cf8 20%, #c4b5fd 80%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>you can safely spend.</span>
      </h1>

      {/* Subheading */}
      <p style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.7s ease 0.32s', margin: '0 0 48px', fontSize: 18, lineHeight: 1.7, color: 'rgba(255,255,255,0.45)', textAlign: 'center', maxWidth: 560, fontWeight: 400 }}>
        Nori helps you make smarter financial decisions using AI, personalized insights and savings goals — without spreadsheets or bank statement uploads.
      </p>

      {/* Buttons */}
      <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.7s ease 0.44s', display: 'flex', gap: 12, marginBottom: 80 }}>
        <button onClick={onStart} style={{ padding: '14px 32px', borderRadius: 100, fontSize: 15, fontWeight: 600, border: 'none', background: 'linear-gradient(135deg, #6b7cff 0%, #a78bfa 100%)', color: '#fff', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 0 32px rgba(107,124,255,0.45)', transition: 'all 0.2s ease' }} onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 48px rgba(107,124,255,0.7)')} onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 32px rgba(107,124,255,0.45)')}>Start Free</button>
      </div>

      {/* Floating dashboard mockup */}
      <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(32px)', transition: 'all 0.9s ease 0.55s', width: '100%', maxWidth: 960, position: 'relative' }}>
        {/* Glow behind mockup */}
        <div style={{ position: 'absolute', inset: '-40px -60px', background: 'radial-gradient(ellipse, rgba(107,124,255,0.2) 0%, transparent 70%)', pointerEvents: 'none', borderRadius: '50%' }} />

        {/* Glass device frame */}
        <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.12)', animation: 'float-hero 6s ease-in-out infinite' }}>
          {/* Mock browser chrome */}
          <div style={{ height: 44, background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {['#ff5f57', '#febc2e', '#28c840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />)}
            </div>
            <div style={{ flex: 1, height: 24, background: 'rgba(255,255,255,0.05)', borderRadius: 8, maxWidth: 280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>app.nori.finance</span>
            </div>
          </div>

          {/* Dashboard preview content */}
          <div style={{ padding: '28px 28px 24px', background: 'rgba(6,6,8,0.8)' }}>
            {/* Hero number */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Safe to Spend Today</div>
              <div style={{ fontSize: 52, fontWeight: 700, fontFamily: "'Inter', sans-serif", letterSpacing: '-0.04em',             background: 'linear-gradient(135deg, #34d399 0%, #6ee7b7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>₹347.50</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginTop: 6 }}>Resets in 11h 24m · Next paycheck in 6 days</div>
            </div>

            {/* Stat row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
              {[{ label: 'Avg daily spend', v: '₹58.50', delta: '-12%', up: false }, { label: 'Savings rate', v: '23.4%', delta: '+2.1%', up: true }, { label: 'Days to goal', v: '47', delta: '-3 days', up: false }].map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 14px' }}>
                  <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.3)', marginBottom: 5 }}>{s.label}</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#f0f0f5', fontFamily: "'Inter', sans-serif", letterSpacing: '-0.02em' }}>{s.v}</div>
                  <div style={{ fontSize: 10, color: s.up ? '#34d399' : '#f59e0b', marginTop: 3 }}>{s.delta}</div>
                </div>
              ))}
            </div>

            {/* Two column */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 12 }}>
              {/* Left */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Bar chart mini */}
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#f0f0f5', marginBottom: 12 }}>Weekly Spending</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 48 }}>
                    {[24, 67, 12, 89, 145, 52, 31].map((v, i) => (
                      <div key={i} style={{ flex: 1, borderRadius: 4, height: `${(v / 145) * 44}px`, background: i === 4 ? 'linear-gradient(180deg,#818cf8,#6b7cff)' : 'rgba(255,255,255,0.07)', boxShadow: i === 4 ? '0 0 10px rgba(107,124,255,0.5)' : 'none' }} />
                    ))}
                  </div>
                </div>
                {/* Goals mini */}
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#f0f0f5', marginBottom: 10 }}>Savings Goals</div>
                  {[{ n: 'Emergency Fund', pct: 70, c: '#818cf8' }, { n: 'Japan Trip', pct: 51, c: '#34d399' }].map(g => (
                    <div key={g.n} style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{g.n}</span>
                        <span style={{ fontSize: 10, fontWeight: 600, color: g.c }}>{g.pct}%</span>
                      </div>
                      <div style={{ height: 3, borderRadius: 3, background: 'rgba(255,255,255,0.07)' }}>
                        <div style={{ height: '100%', width: `${g.pct}%`, borderRadius: 3, background: g.c }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI panel mini */}
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 7, background: 'linear-gradient(135deg, #6b7cff 0%, #a78bfa 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(107,124,255,0.4)' }}>
                    <Icon d={Icons.wave} size={10} stroke={2.5} />
                  </div>
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 600, color: '#f0f0f5' }}>Ask Nori</div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>AI financial companion</div>
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '9px 11px', border: '1px solid rgba(255,255,255,0.07)', fontSize: 10, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                  You&apos;re on track. Dining is 89% used — skip one restaurant meal and finish the week with a surplus.
                </div>
                {['Can I afford AirPods?', 'Travel next month?'].map(q => (
                  <div key={q} style={{ padding: '6px 10px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.08)', fontSize: 9.5, color: 'rgba(255,255,255,0.38)', background: 'rgba(255,255,255,0.03)' }}>{q}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Section 2: Problem ────────────────────────────────────────────────────────
function ProblemSection() {
  const { ref, visible } = useInView(0.2)
  return (
    <section id="product" ref={ref} style={{ padding: '140px 32px', textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', scrollMarginTop: 90 }}>
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)', transition: 'all 0.8s ease' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', borderRadius: 100, marginBottom: 52, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
          <span style={{ fontSize: 11.5, fontWeight: 500, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em' }}>THE PROBLEM</span>
        </div>

        <blockquote style={{ margin: '0 0 40px', fontFamily: "'Inter', sans-serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 600, lineHeight: 1.22, letterSpacing: '-0.03em', color: '#f0f0f5' }}>
          &quot;Most budgeting apps tell you{' '}
          <span style={{ color: 'rgba(255,255,255,0.28)' }}>where your money went.</span>
          <br /><br />
          Nori tells you whether{' '}
          <span style={{ background: 'linear-gradient(135deg, #818cf8 0%, #c4b5fd 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>you can actually afford things.&quot;</span>
        </blockquote>

        <p style={{ fontSize: 16, lineHeight: 1.75, color: 'rgba(255,255,255,0.38)', maxWidth: 560, margin: '0 auto' }}>
          No bank statement uploads. No complex spreadsheets. No financial anxiety. Just a clear, confident answer every day.
        </p>
      </div>
    </section>
  )
}

// ── Section 3: Solution ───────────────────────────────────────────────────────
const solutionCards = [
  {
    icon: 'zap', color: '#818cf8', glow: 'rgba(129,140,248,0.2)',
    title: 'Safe to Spend', subtitle: 'Know exactly how much you can spend today, without touching a single savings goal.',
  },
  {
    icon: 'shield', color: '#34d399', glow: 'rgba(52,211,153,0.2)',
    title: 'Financial Goals', subtitle: "Set it once. Nori tracks your progress automatically and adjusts your daily budget in real time.",
  },
  {
    icon: 'sparkle', color: '#a78bfa', glow: 'rgba(167,139,250,0.2)',
    title: 'AI Companion', subtitle: 'Ask Nori anything before spending. Get intelligent, personalized guidance — instantly.',
  },
]

function SolutionSection() {
  return (
    <section style={{ padding: '0 32px 140px', position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto' }}>
      <FadeIn style={{ textAlign: 'center', marginBottom: 64 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', borderRadius: 100, marginBottom: 24, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
          <span style={{ fontSize: 11.5, fontWeight: 500, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em' }}>THE SOLUTION</span>
        </div>
        <h2 style={{ margin: 0, fontFamily: "'Inter', sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.03em', color: '#f0f0f5' }}>
          A new kind of financial companion.
        </h2>
      </FadeIn>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {solutionCards.map(({ icon, color, glow, title, subtitle }, i) => (
          <FadeIn key={title} delay={i * 0.1}>
            <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '36px 32px', transition: 'border-color 0.3s, transform 0.3s', cursor: 'default', height: '100%' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `rgba(${color === '#818cf8' ? '129,140,248' : color === '#34d399' ? '52,211,153' : '167,139,250'},0.25)`;(e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)' }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';(e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: glow, border: `1px solid ${color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28, color: color }}>
                <Icon d={Icons[icon]} size={24} stroke={1.6} />
              </div>
              <h3 style={{ margin: '0 0 14px', fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', color: '#f0f0f5' }}>{title}</h3>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.42)' }}>{subtitle}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

// ── Section 4: Product showcase ───────────────────────────────────────────────
function ShowcaseSection({ onDashboard }: { onDashboard: () => void }) {
  return (
    <section id="how-it-works" style={{ padding: '0 32px 140px', position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', scrollMarginTop: 90 }}>
      <FadeIn style={{ textAlign: 'center', marginBottom: 64 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', borderRadius: 100, marginBottom: 24, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
          <span style={{ fontSize: 11.5, fontWeight: 500, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em' }}>PRODUCT</span>
        </div>
        <h2 style={{ margin: '0 0 16px', fontFamily: "'Inter', sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.03em', color: '#f0f0f5' }}>
          Your entire financial life,<br />in one view.
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.38)', margin: 0 }}>Every number that matters. Nothing that doesn&apos;t.</p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div style={{ position: 'relative' }}>
          {/* Dramatic glow */}
          <div style={{ position: 'absolute', inset: '-60px -80px', background: 'radial-gradient(ellipse 70% 50%, rgba(107,124,255,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* Large dashboard frame */}
          <div style={{ background: 'rgba(255,255,255,0.035)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 28, overflow: 'hidden', boxShadow: '0 60px 180px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)', cursor: 'pointer' }} onClick={onDashboard}>
            {/* Chrome */}
            <div style={{ height: 46, background: 'rgba(255,255,255,0.025)', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', padding: '0 18px', gap: 10 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['#ff5f57', '#febc2e', '#28c840'].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c, opacity: 0.75 }} />)}
              </div>
              <div style={{ flex: 1, height: 26, background: 'rgba(255,255,255,0.05)', borderRadius: 9, maxWidth: 300, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.28)', fontFamily: "'JetBrains Mono', monospace" }}>app.nori.finance/dashboard</span>
              </div>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', padding: '4px 12px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.08)' }}>Click to explore →</span>
            </div>

            {/* Dashboard screenshot */}
            <div style={{ padding: '32px 32px 28px', background: 'rgba(6,6,8,0.85)' }}>
              {/* Mini navbar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 7, background: 'linear-gradient(135deg, #6b7cff, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon d={Icons.wave} size={11} stroke={2.5} />
                  </div>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: '-0.03em', color: '#f0f0f5' }}>nori</span>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  {['Dashboard', 'Goals', 'Insights'].map(n => <span key={n} style={{ fontSize: 12, color: n === 'Dashboard' ? '#f0f0f5' : 'rgba(255,255,255,0.3)', fontWeight: n === 'Dashboard' ? 600 : 400 }}>{n}</span>)}
                </div>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #6b7cff, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>AL</div>
              </div>

              {/* Hero number */}
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Safe to Spend Today</div>
                <div style={{ fontSize: 64, fontWeight: 700, fontFamily: "'Inter', sans-serif", letterSpacing: '-0.04em',             background: 'linear-gradient(135deg, #34d399, #6ee7b7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>₹347.50</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 8 }}>Resets in 11h 24m · Next paycheck in 6 days</div>
              </div>

              {/* Stat row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                {[{ label: 'Avg daily spend', v: '₹58.50', c: '#f59e0b' }, { label: 'Savings rate', v: '23.4%', c: '#34d399' }, { label: 'Days to goal', v: '47', c: '#34d399' }].map(s => (
                  <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px 16px' }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', marginBottom: 6 }}>{s.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#f0f0f5', fontFamily: "'Inter', sans-serif", letterSpacing: '-0.02em' }}>{s.v}</div>
                    <div style={{ fontSize: 10.5, color: s.c, marginTop: 4 }}>↑ This month</div>
                  </div>
                ))}
              </div>

              {/* Two col */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 14 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Chart */}
                  <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '18px 20px' }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: '#f0f0f5', marginBottom: 16 }}>Weekly Spending</div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 64 }}>
                      {[24, 67, 12, 89, 145, 52, 31].map((v, i) => (
                        <div key={i} style={{ flex: 1, borderRadius: 6, height: `${(v / 145) * 58}px`, background: i === 4 ? 'linear-gradient(180deg,#818cf8,#6b7cff)' : 'rgba(255,255,255,0.07)', boxShadow: i === 4 ? '0 0 12px rgba(107,124,255,0.5)' : 'none' }} />
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => <span key={d} style={{ fontSize: 9.5, color: i === 4 ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)', fontWeight: i === 4 ? 600 : 400 }}>{d}</span>)}
                    </div>
                  </div>

                  {/* Goals grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    {/* Goals */}
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '18px 20px' }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: '#f0f0f5', marginBottom: 14 }}>Savings Goals</div>
                      {[{ n: 'Emergency Fund', p: 70, c: '#818cf8' }, { n: 'Japan Trip', p: 51, c: '#34d399' }, { n: 'MacBook Pro', p: 44, c: '#f59e0b' }].map(g => (
                        <div key={g.n} style={{ marginBottom: 10 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)' }}>{g.n}</span>
                            <span style={{ fontSize: 10.5, fontWeight: 600, color: g.c }}>{g.p}%</span>
                          </div>
                          <div style={{ height: 3, borderRadius: 3, background: 'rgba(255,255,255,0.07)' }}>
                            <div style={{ height: '100%', width: `${g.p}%`, borderRadius: 3, background: g.c, boxShadow: `0 0 6px ${g.c}60` }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Budget health */}
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '18px 20px' }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: '#f0f0f5', marginBottom: 14 }}>Budget Health</div>
                      {[{ n: 'Groceries', p: 68 }, { n: 'Dining', p: 89 }, { n: 'Entertainment', p: 45 }].map(c => (
                        <div key={c.n} style={{ marginBottom: 10 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)' }}>{c.n}</span>
                            <span style={{ fontSize: 10.5, color: c.p >= 85 ? '#f59e0b' : 'rgba(255,255,255,0.35)' }}>{c.p}%</span>
                          </div>
                          <div style={{ height: 3, borderRadius: 3, background: 'rgba(255,255,255,0.07)' }}>
                            <div style={{ height: '100%', width: `${c.p}%`, borderRadius: 3, background: c.p >= 85 ? '#f59e0b' : '#6b7cff' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI panel */}
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(135deg, #6b7cff, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(107,124,255,0.4)' }}>
                      <Icon d={Icons.wave} size={12} stroke={2.5} />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#f0f0f5' }}>Ask Nori</div>
                      <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.3)' }}>AI financial companion</div>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '10px 12px', border: '1px solid rgba(255,255,255,0.07)', fontSize: 11, color: 'rgba(255,255,255,0.58)', lineHeight: 1.65 }}>
                    You&apos;re on track this week. Your dining budget is 89% used — skip one restaurant meal and you&apos;ll finish with a surplus.
                  </div>
                  <div style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(107,124,255,0.1)', border: '1px solid rgba(107,124,255,0.15)', fontSize: 10.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                    <span style={{ color: '#818cf8', fontWeight: 600 }}>Weekly Insight</span><br />
                    Maintain this pace and save ₹127 extra this month.
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {['Am I overspending?', 'Can I afford AirPods?', 'Review my goals'].map(q => (
                      <div key={q} style={{ padding: '7px 12px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.07)', fontSize: 10.5, color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.03)' }}>{q}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}

// ── Section 5: How it works ───────────────────────────────────────────────────
const steps = [
  { num: '01', title: 'Tell Nori about your finances.', body: 'Share your income, recurring expenses, and monthly obligations. No bank logins, no uploads. Just the numbers that matter.' },
  { num: '02', title: 'Set your savings goals.', body: "Whether it's a trip, an emergency fund, or a big purchase — set it once and Nori automatically protects it every day." },
  { num: '03', title: 'Spend with confidence.', body: "Every morning, Nori tells you exactly how much you can spend today. No guilt, no anxiety, no mental math." },
]

function HowItWorksSection() {
  return (
    <section style={{ padding: '0 32px 140px', position: 'relative', zIndex: 1, maxWidth: 1000, margin: '0 auto' }}>
      <FadeIn style={{ textAlign: 'center', marginBottom: 72 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', borderRadius: 100, marginBottom: 24, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
          <span style={{ fontSize: 11.5, fontWeight: 500, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em' }}>HOW IT WORKS</span>
        </div>
        <h2 style={{ margin: 0, fontFamily: "'Inter', sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.03em', color: '#f0f0f5' }}>
          Three steps to financial clarity.
        </h2>
      </FadeIn>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {steps.map(({ num, title, body }, i) => (
          <FadeIn key={num} delay={i * 0.12}>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 48, padding: '48px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingTop: 4 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.04em', marginBottom: 16 }}>{num}</span>
                {i < steps.length - 1 && (
                  <div style={{ width: 1, height: 48, background: 'linear-gradient(180deg, rgba(107,124,255,0.4) 0%, transparent 100%)', marginLeft: 6 }} />
                )}
              </div>
              <div>
                <h3 style={{ margin: '0 0 14px', fontFamily: "'Inter', sans-serif", fontSize: 26, fontWeight: 600, letterSpacing: '-0.025em', color: '#f0f0f5', lineHeight: 1.2 }}>{title}</h3>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.75, color: 'rgba(255,255,255,0.42)', maxWidth: 520 }}>{body}</p>
              </div>
            </div>
          </FadeIn>
        ))}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
      </div>
    </section>
  )
}

// ── Section 6: Meet Nori AI ───────────────────────────────────────────────────
const demoConversations = [
  { q: 'Can I afford AirPods?', a: "Yes — you have ₹347.50 safe to spend today and AirPods Pro are ₹249. Buying them leaves you with ₹98.50 for the rest of the day, which is above your average. Go for it." },
  { q: 'Can I travel next month?', a: "Based on your savings goals, you can comfortably afford a ₹1,200 trip in September without touching your emergency fund. I'd suggest booking before the 15th." },
  { q: 'Should I buy a MacBook?', a: "You're 44% toward your MacBook goal. At your current pace, you'll reach it in 67 days. I wouldn't buy it outright today — let me help you get there faster." },
]

function MeetNoriSection() {
  const [active, setActive] = useState(0)
  const [typing, setTyping] = useState(false)
  const [showAnswer, setShowAnswer] = useState(true)

  const handleSelect = (i: number) => {
    if (i === active) return
    setShowAnswer(false)
    setTyping(true)
    setTimeout(() => {
      setActive(i)
      setTyping(false)
      setShowAnswer(true)
    }, 900)
  }

  return (
    <section id="about" style={{ padding: '0 32px 140px', position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', scrollMarginTop: 90 }}>
      <FadeIn style={{ textAlign: 'center', marginBottom: 64 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', borderRadius: 100, marginBottom: 24, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
          <span style={{ fontSize: 11.5, fontWeight: 500, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em' }}>MEET NORI</span>
        </div>
        <h2 style={{ margin: '0 0 16px', fontFamily: "'Inter', sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.03em', color: '#f0f0f5' }}>
          Your AI financial companion.
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.38)', margin: 0, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
          Not a chatbot. Not a calculator. A companion that understands your goals and gives you real answers.
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'center' }}>
          {/* Left: prompts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontWeight: 500, margin: '0 0 8px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Try asking Nori</p>
            {demoConversations.map(({ q }, i) => (
              <button key={q} onClick={() => handleSelect(i)} style={{ padding: '18px 22px', borderRadius: 16, border: `1px solid ${active === i ? 'rgba(107,124,255,0.35)' : 'rgba(255,255,255,0.08)'}`, background: active === i ? 'rgba(107,124,255,0.1)' : 'rgba(255,255,255,0.03)', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.25s ease', boxShadow: active === i ? '0 0 24px rgba(107,124,255,0.15)' : 'none' }}>
                <span style={{ fontSize: 15, fontWeight: 500, color: active === i ? '#f0f0f5' : 'rgba(255,255,255,0.5)' }}>{q}</span>
              </button>
            ))}
          </div>

          {/* Right: AI panel */}
          <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.4)' }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'linear-gradient(180deg, rgba(107,124,255,0.08) 0%, transparent 100%)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: 'linear-gradient(135deg, #6b7cff, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(107,124,255,0.5)' }}>
                <Icon d={Icons.wave} size={16} stroke={2.5} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f0f5' }}>Nori</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', animation: 'pulse-dot 2s ease-in-out infinite' }} />
                  <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.32)' }}>Your AI financial companion</span>
                </div>
              </div>
            </div>

            {/* Chat */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 200 }}>
              {/* User message */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ maxWidth: '80%', padding: '12px 16px', borderRadius: '16px 16px 4px 16px', background: 'rgba(107,124,255,0.2)', border: '1px solid rgba(107,124,255,0.25)', fontSize: 14, color: '#e0e0f0', lineHeight: 1.6 }}>
                  {demoConversations[active].q}
                </div>
              </div>

              {/* Nori response */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: 9, flexShrink: 0, background: 'linear-gradient(135deg, #6b7cff, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(107,124,255,0.35)' }}>
                  <Icon d={Icons.wave} size={12} stroke={2.5} />
                </div>
                <div style={{ maxWidth: '85%', padding: '12px 16px', borderRadius: '16px 16px 16px 4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 13.5, color: 'rgba(255,255,255,0.72)', lineHeight: 1.7 }}>
                  {typing ? (
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '4px 0' }}>
                      {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.4)', animation: `pulse-dot 1.2s ease-in-out infinite ${i * 0.18}s` }} />)}
                    </div>
                  ) : showAnswer ? (
                    <span style={{ opacity: showAnswer ? 1 : 0, transition: 'opacity 0.4s ease' }}>{demoConversations[active].a}</span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}

// ── Section 7: Why people love Nori ──────────────────────────────────────────
const benefits = [
  { icon: 'shield', color: '#818cf8', title: 'No bank statement uploads', body: 'Nori never asks for access to your bank. Enter your numbers manually and stay in full control.' },
  { icon: 'leaf', color: '#34d399', title: 'Privacy first, always', body: 'Your financial data lives with you. Nori never sells or shares your information. Ever.' },
  { icon: 'sparkle', color: '#a78bfa', title: 'AI-powered guidance', body: 'Ask anything about your money. Get clear, honest answers based on your actual situation — not generic advice.' },
  { icon: 'zap', color: '#f59e0b', title: 'Designed to feel effortless', body: 'No complex dashboards. No confusing categories. Just the one number that matters, every day.' },
  { icon: 'trend_up', color: '#34d399', title: 'Personalized to you', body: 'Nori learns your habits, adjusts to your goals, and gives smarter recommendations over time.' },
  { icon: 'wave', color: '#818cf8', title: 'Built for real life', body: 'Not a budgeting app, not a bank. Nori is the companion for the financial decisions you make every day.' },
]

function WhyNoriSection() {
  return (
    <section style={{ padding: '0 32px 140px', position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto' }}>
      <FadeIn style={{ textAlign: 'center', marginBottom: 64 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', borderRadius: 100, marginBottom: 24, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
          <span style={{ fontSize: 11.5, fontWeight: 500, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em' }}>WHY NORI</span>
        </div>
        <h2 style={{ margin: 0, fontFamily: "'Inter', sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.03em', color: '#f0f0f5' }}>
          Designed around how<br />people actually think about money.
        </h2>
      </FadeIn>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {benefits.map(({ icon, color, title, body }, i) => (
          <FadeIn key={title} delay={i * 0.07}>
            <div style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 22, padding: '28px 26px', transition: 'border-color 0.3s, transform 0.3s' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.13)';(e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)' }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';(e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color, border: `1px solid ${color}28` }}>
                  <Icon d={Icons[icon]} size={18} stroke={1.6} />
                </div>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', color: '#f0f0f5' }}>{title}</h3>
              </div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.4)' }}>{body}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

// ── Final CTA ─────────────────────────────────────────────────────────────────
function CTASection({ onStart }: { onStart: () => void }) {
  return (
    <section style={{ padding: '0 32px 140px', position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
      <FadeIn>
        {/* Large ambient glow */}
        <div style={{ position: 'absolute', inset: '-80px -120px', background: 'radial-gradient(ellipse 60% 50%, rgba(107,124,255,0.18) 0%, transparent 70%)', pointerEvents: 'none', borderRadius: '50%' }} />

        <div style={{ position: 'relative', background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 32, padding: '80px 60px', overflow: 'hidden' }}>
          {/* Inner glow */}
          <div style={{ position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)', width: '70%', height: '200px', background: 'radial-gradient(ellipse, rgba(107,124,255,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', borderRadius: 100, marginBottom: 32, background: 'rgba(107,124,255,0.1)', border: '1px solid rgba(107,124,255,0.2)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#818cf8', animation: 'pulse-dot 2s ease-in-out infinite' }} />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: '#818cf8', letterSpacing: '0.06em' }}>START FREE TODAY</span>
          </div>

          <h2 style={{ margin: '0 0 20px', fontFamily: "'Inter', sans-serif", fontSize: 'clamp(36px, 5vw, 58px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.04em', color: '#f0f0f5' }}>
            Start making better<br />financial decisions.
          </h2>

          <p style={{ margin: '0 0 48px', fontSize: 17, lineHeight: 1.75, color: 'rgba(255,255,255,0.42)', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
            Nori helps you spend confidently, save consistently, and make smarter choices every day.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 0 }}>
            <button onClick={onStart} style={{ padding: '15px 38px', borderRadius: 100, fontSize: 16, fontWeight: 600, border: 'none', background: 'linear-gradient(135deg, #6b7cff 0%, #a78bfa 100%)', color: '#fff', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 0 40px rgba(107,124,255,0.5)', transition: 'all 0.2s ease' }} onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 60px rgba(107,124,255,0.7)')} onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 40px rgba(107,124,255,0.5)')}>Start Free</button>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ padding: '32px 60px 40px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1, maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 24, height: 24, borderRadius: 7, background: 'linear-gradient(135deg, #6b7cff, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon d={Icons.wave} size={11} stroke={2.5} />
        </div>
        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: '-0.03em', color: 'rgba(255,255,255,0.6)' }}>nori</span>
      </div>
      <div style={{ display: 'flex', gap: 28 }}>
        {['GitHub', 'Privacy', 'Contact'].map(item => (
          <a key={item} href="#" style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>{item}</a>
        ))}
      </div>
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>© 2025 Nori. All rights reserved.</span>
    </footer>
  )
}

// ── Landing Page ──────────────────────────────────────────────────────────────
export default function LandingPage() {
  const router = useRouter()
  const onStart = () => router.push('/register')
  const onDashboard = () => router.push('/dashboard')

  return (
    <div style={{ minHeight: '100vh', background: '#060608', position: 'relative', overflowX: 'hidden' }}>
      <LandingOrbs />
      <LandingNav onStart={onStart} />
      <HeroSection onStart={onStart} />
      <ProblemSection />
      <SolutionSection />
      <ShowcaseSection onDashboard={onDashboard} />
      <HowItWorksSection />
      <MeetNoriSection />
      <WhyNoriSection />
      <CTASection onStart={onStart} />
      <Footer />
    </div>
  )
}
