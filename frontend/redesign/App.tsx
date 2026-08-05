import { useState, useEffect, useRef } from 'react'

// ── Icons (inline SVG, Lucide-style) ─────────────────────────────────────────

function Icon({ d, size = 18, stroke = 1.6, className = '' }: { d: string | string[]; size?: number; stroke?: number; className?: string }) {
  const paths = Array.isArray(d) ? d : [d]
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className}>
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  )
}

const Icons = {
  home: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  goals: ['M12 2L2 7l10 5 10-5-10-5z', 'M2 17l10 5 10-5', 'M2 12l10 5 10-5'],
  insights: ['M18 20V10', 'M12 20V4', 'M6 20v-6'],
  search: ['M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0'],
  bell: ['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9', 'M13.73 21a2 2 0 0 1-3.46 0'],
  arrow_right: 'M5 12h14M12 5l7 7-7 7',
  sparkle: ['M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'],
  send: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z',
  trend_up: ['M23 6l-9.5 9.5-5-5L1 18'],
  trend_down: ['M23 18l-9.5-9.5-5 5L1 6'],
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  piggy: ['M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'],
  check: 'M20 6L9 17l-5-5',
  plus: ['M12 5v14', 'M5 12h14'],
  refresh: 'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
  credit_card: ['M1 4h22v16H1z', 'M1 10h22'],
  user: ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  leaf: 'M2 22c1.25-1.25 2.77-3.37 3.5-6 .5-2 .5-4 2-6s4-3 6-2c2 1 3.5 3 3.5 5s-1 4-3 5-4.5 1.5-6 1c-2.5-.75-4.5-3-5-5',
  coffee: ['M18 8h1a4 4 0 0 1 0 8h-1', 'M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z', 'M6 1v3M10 1v3M14 1v3'],
  film: ['M2 2h20v20H2z', 'M7 2v20', 'M17 2v20', 'M2 12h20', 'M2 7h5', 'M2 17h5', 'M17 17h5', 'M17 7h5'],
  chat: ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'],
  wave: 'M2 12c.5-2 2-3 3.5-3s3 2.5 5 2.5 3.5-3 5-3 3 1 3.5 3',
  ellipsis: ['M12 5h.01', 'M12 12h.01', 'M12 19h.01'],
  info: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 8h.01', 'M12 12v4'],
}

// ── Data ──────────────────────────────────────────────────────────────────────

const goals = [
  { name: 'Emergency Fund', icon: 'shield', current: 8400, target: 12000, color: '#818cf8', glow: 'rgba(129,140,248,0.3)' },
  { name: 'Japan Trip', icon: 'leaf', current: 2300, target: 4500, color: '#34d399', glow: 'rgba(52,211,153,0.3)' },
  { name: 'MacBook Pro', icon: 'zap', current: 1100, target: 2499, color: '#f59e0b', glow: 'rgba(245,158,11,0.3)' },
]

const budgetCategories = [
  { name: 'Groceries', spent: 340, budget: 500, icon: 'leaf' },
  { name: 'Dining', spent: 178, budget: 200, icon: 'coffee' },
  { name: 'Entertainment', spent: 67, budget: 150, icon: 'film' },
  { name: 'Transport', spent: 98, budget: 120, icon: 'refresh' },
]

const weeklySpend = [
  { day: 'Mon', amount: 24 },
  { day: 'Tue', amount: 67 },
  { day: 'Wed', amount: 12 },
  { day: 'Thu', amount: 89 },
  { day: 'Fri', amount: 145 },
  { day: 'Sat', amount: 52 },
  { day: 'Sun', amount: 31 },
]

const aiMessages = [
  { role: 'nori', text: "You're on track this week — you've spent $420 of your $650 budget. Your dining spend is 89% used, though. Skip one restaurant meal and you'll finish the week with a small surplus." },
]

const quickInsights = [
  { label: 'Avg daily spend', value: '$58.50', trend: 'down', delta: '-12%' },
  { label: 'Savings rate', value: '23.4%', trend: 'up', delta: '+2.1%' },
  { label: 'Days to goal', value: '47', trend: 'down', delta: '-3 days' },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function Orbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%', width: '700px', height: '700px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
        animation: 'float-orb 18s ease-in-out infinite',
        borderRadius: '50%', filter: 'blur(1px)'
      }} />
      <div style={{
        position: 'absolute', top: '30%', right: '-15%', width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
        animation: 'float-orb 24s ease-in-out infinite reverse',
        borderRadius: '50%', filter: 'blur(1px)'
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', left: '30%', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)',
        animation: 'float-orb 20s ease-in-out infinite 8s',
        borderRadius: '50%', filter: 'blur(1px)'
      }} />
    </div>
  )
}

function Navbar({ activeNav, setActiveNav }: { activeNav: string; setActiveNav: (s: string) => void }) {
  const navItems = ['Dashboard', 'Goals', 'Insights']

  return (
    <div style={{
      position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
      zIndex: 100, display: 'flex', alignItems: 'center', gap: '4px',
      padding: '6px 8px', width: 'min(880px, calc(100vw - 40px))',
    }} className="glass-nav" >

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px', padding: '6px 14px' }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '8px',
          background: 'linear-gradient(135deg, #6b7cff 0%, #a78bfa 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 16px rgba(107,124,255,0.5)',
        }}>
          <Icon d={Icons.wave} size={14} stroke={2.5} className="" />
        </div>
        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '16px', letterSpacing: '-0.03em', color: '#f0f0f5' }}>nori</span>
      </div>

      {/* Nav items */}
      <div style={{ display: 'flex', gap: '2px', flex: 1 }}>
        {navItems.map((item) => (
          <button key={item} onClick={() => setActiveNav(item)} style={{
            padding: '7px 16px', borderRadius: '100px', border: 'none', cursor: 'pointer',
            fontSize: '13.5px', fontWeight: 500, transition: 'all 0.2s ease',
            background: activeNav === item ? 'rgba(255,255,255,0.1)' : 'transparent',
            color: activeNav === item ? '#f0f0f5' : 'rgba(255,255,255,0.45)',
            fontFamily: 'inherit',
          }}>
            {item}
          </button>
        ))}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button style={{
          width: '34px', height: '34px', borderRadius: '100px', border: 'none',
          background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: 'rgba(255,255,255,0.45)', transition: 'color 0.2s',
        }} onMouseEnter={e => (e.currentTarget.style.color = '#f0f0f5')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}>
          <Icon d={Icons.search} size={16} />
        </button>
        <button style={{
          width: '34px', height: '34px', borderRadius: '100px', border: 'none',
          background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: 'rgba(255,255,255,0.45)', transition: 'color 0.2s', position: 'relative',
        }} onMouseEnter={e => (e.currentTarget.style.color = '#f0f0f5')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}>
          <Icon d={Icons.bell} size={16} />
          <div style={{
            position: 'absolute', top: '8px', right: '8px', width: '6px', height: '6px',
            borderRadius: '50%', background: '#818cf8', border: '1.5px solid #060608',
          }} />
        </button>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%', marginLeft: '4px',
          background: 'linear-gradient(135deg, #6b7cff 0%, #a78bfa 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: 600, cursor: 'pointer',
          boxShadow: '0 0 12px rgba(107,124,255,0.4)',
        }}>
          AL
        </div>
      </div>
    </div>
  )
}

function SafeToSpendHero() {
  const [animIn, setAnimIn] = useState(false)
  useEffect(() => { setTimeout(() => setAnimIn(true), 100) }, [])

  return (
    <div style={{
      textAlign: 'center', paddingTop: '140px', paddingBottom: '16px',
      opacity: animIn ? 1 : 0, transform: animIn ? 'translateY(0)' : 'translateY(24px)',
      transition: 'opacity 0.7s ease, transform 0.7s ease',
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '5px 14px 5px 10px', borderRadius: '100px', marginBottom: '28px',
        background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)',
      }}>
        <div className="pulse-dot" style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34d399' }} />
        <span style={{ fontSize: '12px', fontWeight: 500, color: '#34d399', letterSpacing: '0.04em' }}>LIVE BALANCE</span>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <span style={{ fontSize: '13px', fontWeight: 400, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Safe to Spend Today
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '4px', marginBottom: '16px' }}>
        <span style={{ fontSize: '24px', fontWeight: 300, color: 'rgba(52,211,153,0.7)', marginTop: '20px', fontFamily: "'Inter', sans-serif" }}>$</span>
        <span className="font-display-num text-gradient-green" style={{ fontSize: '96px', fontWeight: 700, lineHeight: 1 }}>
          347
        </span>
        <span style={{ fontSize: '32px', fontWeight: 300, color: 'rgba(52,211,153,0.7)', marginTop: '14px', fontFamily: "'Inter', sans-serif" }}>.50</span>
      </div>

      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.38)', fontWeight: 400, margin: 0 }}>
        Resets in <span style={{ color: 'rgba(255,255,255,0.6)' }}>11 hours 24 mins</span> · Next paycheck in <span style={{ color: 'rgba(255,255,255,0.6)' }}>6 days</span>
      </p>
    </div>
  )
}

function ProgressRing({ pct, color, glow, size = 64 }: { pct: number; color: string; glow: string; size?: number }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="5"
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transformOrigin: 'center', transform: 'rotate(-90deg)', filter: `drop-shadow(0 0 6px ${glow})` }}
      />
    </svg>
  )
}

function GoalsCard() {
  return (
    <div className="glass animate-fade-in-up" style={{ padding: '28px', animationDelay: '0.1s' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#f0f0f5' }}>Savings Goals</h3>
          <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.38)' }}>3 active · all on track</p>
        </div>
        <button style={{
          padding: '6px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: 500,
          border: '1px solid rgba(255,255,255,0.1)', background: 'transparent',
          color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'inherit',
        }}>View all</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {goals.map((g) => {
          const pct = Math.round((g.current / g.target) * 100)
          return (
            <div key={g.name} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <ProgressRing pct={pct} color={g.color} glow={g.glow} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#f0f0f5' }}>{g.name}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: g.color, fontFamily: "'Inter', sans-serif" }}>{pct}%</span>
                </div>
                <div style={{ height: '4px', borderRadius: '4px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${pct}%`, borderRadius: '4px',
                    background: g.color, boxShadow: `0 0 8px ${g.glow}`,
                    transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                  <span style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.35)', fontFamily: "'Inter', sans-serif" }}>${g.current.toLocaleString()}</span>
                  <span style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.25)', fontFamily: "'Inter', sans-serif" }}>${g.target.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function BudgetHealthCard() {
  return (
    <div className="glass animate-fade-in-up" style={{ padding: '28px', animationDelay: '0.15s' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#f0f0f5' }}>Budget Health</h3>
          <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.38)' }}>August · 18 days remaining</p>
        </div>
        <div style={{
          padding: '5px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 600,
          background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)',
        }}>On Track</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {budgetCategories.map((cat) => {
          const pct = Math.round((cat.spent / cat.budget) * 100)
          const over = pct >= 90
          const barColor = over ? '#f59e0b' : '#6b7cff'
          return (
            <div key={cat.name}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)',
                  }}>
                    <Icon d={(Icons as any)[cat.icon]} size={13} stroke={1.8} />
                  </div>
                  <span style={{ fontSize: '13.5px', fontWeight: 500, color: '#f0f0f5' }}>{cat.name}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: over ? '#f59e0b' : '#f0f0f5', fontFamily: "'Inter', sans-serif" }}>
                    ${cat.spent}
                  </span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontFamily: "'Inter', sans-serif" }}>
                    /{cat.budget}
                  </span>
                </div>
              </div>
              <div style={{ height: '5px', borderRadius: '5px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${pct}%`, borderRadius: '5px',
                  background: barColor, boxShadow: `0 0 6px ${over ? 'rgba(245,158,11,0.4)' : 'rgba(107,124,255,0.4)'}`,
                  transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
                }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WeeklySpendChart() {
  const max = Math.max(...weeklySpend.map(d => d.amount))
  const today = new Date().getDay()
  const days = weeklySpend.map((d, i) => ({ ...d, isToday: i === (today === 0 ? 6 : today - 1) }))

  return (
    <div className="glass animate-fade-in-up" style={{ padding: '28px', animationDelay: '0.2s' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#f0f0f5' }}>Weekly Spending</h3>
          <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.38)' }}>Total this week · <span style={{ color: '#f0f0f5', fontFamily: "'Inter', sans-serif" }}>$420</span></p>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['W', 'M', 'Y'].map(p => (
            <button key={p} style={{
              width: '30px', height: '30px', borderRadius: '8px', border: 'none', fontSize: '12px', fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit',
              background: p === 'W' ? 'rgba(107,124,255,0.2)' : 'transparent',
              color: p === 'W' ? '#818cf8' : 'rgba(255,255,255,0.3)',
            }}>{p}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80px' }}>
        {days.map(({ day, amount, isToday }) => (
          <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '100%', borderRadius: '6px', position: 'relative', overflow: 'hidden',
              height: `${(amount / max) * 72}px`,
              background: isToday ? 'linear-gradient(180deg, #818cf8 0%, #6b7cff 100%)' : 'rgba(255,255,255,0.07)',
              boxShadow: isToday ? '0 0 16px rgba(107,124,255,0.5)' : 'none',
              transition: 'all 0.3s ease',
              cursor: 'default',
            }}>
              {isToday && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 60%)' }} />}
            </div>
            <span style={{ fontSize: '11px', color: isToday ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)', fontWeight: isToday ? 600 : 400 }}>{day}</span>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '20px', padding: '14px 16px', borderRadius: '12px',
        background: 'rgba(107,124,255,0.07)', border: '1px solid rgba(107,124,255,0.12)',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <Icon d={Icons.sparkle} size={14} stroke={1.5} className="" style={{ color: '#818cf8', flexShrink: 0 } as any} />
        <p style={{ margin: 0, fontSize: '12.5px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
          You spent <span style={{ color: '#f0f0f5', fontWeight: 500 }}>$145 on Friday</span> — your highest day. Most went to dinner out.
        </p>
      </div>
    </div>
  )
}

function ConfidenceCard() {
  const score = 84
  const circumference = 2 * Math.PI * 52
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="glass animate-fade-in-up" style={{ padding: '28px', animationDelay: '0.22s' }}>
      <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 600, color: '#f0f0f5' }}>Financial Confidence</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <svg width="120" height="120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="52" fill="none"
              stroke="url(#conf-grad)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={offset}
              style={{ transformOrigin: 'center', transform: 'rotate(-90deg)', filter: 'drop-shadow(0 0 8px rgba(129,140,248,0.5))' }}
            />
            <defs>
              <linearGradient id="conf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6b7cff" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <span className="font-display-num" style={{ fontSize: '28px', fontWeight: 700, color: '#f0f0f5', lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>/ 100</span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
            Your financial habits are <span style={{ color: '#f0f0f5', fontWeight: 500 }}>excellent</span>. You've consistently hit your savings targets for 4 months.
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['On-time bills', 'Savings habit', 'Goal progress'].map(tag => (
              <span key={tag} style={{
                padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 500,
                background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)',
              }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function WeeklyCheckIn() {
  const [selected, setSelected] = useState<string | null>(null)
  const moods = [
    { emoji: '😰', label: 'Stressed' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '😌', label: 'Calm' },
    { emoji: '🤩', label: 'Great' },
  ]

  return (
    <div className="glass animate-fade-in-up" style={{ padding: '28px', animationDelay: '0.25s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <div className="pulse-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#818cf8' }} />
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Weekly Check-in</span>
      </div>
      <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 600, color: '#f0f0f5' }}>How do you feel about money this week?</h3>

      <div style={{ display: 'flex', gap: '10px' }}>
        {moods.map(({ emoji, label }) => (
          <button key={label} onClick={() => setSelected(label)} style={{
            flex: 1, padding: '14px 8px', borderRadius: '14px', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
            background: selected === label ? 'rgba(107,124,255,0.18)' : 'rgba(255,255,255,0.04)',
            borderWidth: '1px', borderStyle: 'solid',
            borderColor: selected === label ? 'rgba(107,124,255,0.4)' : 'rgba(255,255,255,0.06)',
            transition: 'all 0.2s ease', fontFamily: 'inherit',
            boxShadow: selected === label ? '0 0 16px rgba(107,124,255,0.2)' : 'none',
          }}>
            <span style={{ fontSize: '22px' }}>{emoji}</span>
            <span style={{ fontSize: '11px', fontWeight: 500, color: selected === label ? '#818cf8' : 'rgba(255,255,255,0.35)' }}>{label}</span>
          </button>
        ))}
      </div>

      {selected && (
        <div style={{
          marginTop: '16px', padding: '12px 16px', borderRadius: '12px',
          background: 'rgba(107,124,255,0.07)', border: '1px solid rgba(107,124,255,0.12)',
          animation: 'fade-in-up 0.3s ease forwards',
        }}>
          <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
            <Icon d={Icons.sparkle} size={12} stroke={1.5} /> {' '}
            Noted. Nori will factor your financial mood into this week's recommendations.
          </p>
        </div>
      )}
    </div>
  )
}

function QuickStats() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', animationDelay: '0.05s' }} className="animate-fade-in-up">
      {quickInsights.map(({ label, value, trend, delta }) => (
        <div key={label} className="glass-sm" style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.35)', marginBottom: '8px', fontWeight: 500 }}>{label}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="font-display-num" style={{ fontSize: '22px', fontWeight: 700, color: '#f0f0f5' }}>{value}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <Icon d={trend === 'up' ? Icons.trend_up : Icons.trend_down} size={12} stroke={2}
              className="" style={{ color: trend === 'up' ? '#34d399' : '#f59e0b' } as any} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: trend === 'up' ? '#34d399' : '#f59e0b' }}>{delta}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── AI Assistant Panel ────────────────────────────────────────────────────────

function AIAssistantPanel() {
  const [messages, setMessages] = useState(aiMessages)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const suggestions = [
    'Am I overspending?',
    "What's my savings rate?",
    'Can I afford dinner out?',
    'Review my goals',
  ]

  const handleSend = (text?: string) => {
    const msg = text || input.trim()
    if (!msg) return
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setInput('')
    setTyping(true)

    const responses: Record<string, string> = {
      'Am I overspending?': "You're slightly over on dining (89% used) but under in every other category. Overall you're at 64.6% of your monthly budget with 18 days left — that's healthy.",
      "What's my savings rate?": "Your savings rate this month is 23.4%, up from 21.3% last month. At this pace, you'll reach your emergency fund goal 3 weeks early. Nice work.",
      'Can I afford dinner out?': "Yes — but keep it under $45 to stay on track. Your dining budget has $22 left. A moderate restaurant meal would push you slightly over, but it won't affect your savings goals at all.",
      'Review my goals': "You have 3 active goals. Emergency Fund (70%) is your closest — you'll hit it in 47 days. Japan Trip (51%) is on schedule for December. MacBook Pro (44%) is slightly behind, but a small boost this month would get it back on track.",
    }

    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [...prev, {
        role: 'nori',
        text: responses[msg] || "Great question. Based on your current spending patterns, you're in a good position. Your essential expenses are covered, savings are growing, and you have a comfortable buffer for the rest of the month."
      }])
    }, 1400)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  return (
    <div className="glass" style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      padding: '0', overflow: 'hidden', minHeight: '600px',
    }}>
      {/* Header */}
      <div style={{
        padding: '22px 24px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'linear-gradient(180deg, rgba(107,124,255,0.06) 0%, transparent 100%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6b7cff 0%, #a78bfa 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(107,124,255,0.4)',
          }}>
            <Icon d={Icons.wave} size={15} stroke={2.5} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#f0f0f5' }}>Ask Nori</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div className="pulse-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#34d399' }} />
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>Always watching your finances</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            gap: '10px', alignItems: 'flex-start',
          }}>
            {msg.role === 'nori' && (
              <div style={{
                width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                background: 'linear-gradient(135deg, #6b7cff 0%, #a78bfa 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 10px rgba(107,124,255,0.3)',
              }}>
                <Icon d={Icons.wave} size={12} stroke={2.5} />
              </div>
            )}
            <div style={{
              maxWidth: '85%', padding: '12px 15px', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: msg.role === 'user' ? 'rgba(107,124,255,0.2)' : 'rgba(255,255,255,0.05)',
              border: msg.role === 'user' ? '1px solid rgba(107,124,255,0.25)' : '1px solid rgba(255,255,255,0.07)',
              fontSize: '13px', lineHeight: 1.6, color: msg.role === 'user' ? '#e0e0f0' : 'rgba(255,255,255,0.75)',
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {typing && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
              background: 'linear-gradient(135deg, #6b7cff 0%, #a78bfa 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon d={Icons.wave} size={12} stroke={2.5} />
            </div>
            <div style={{
              padding: '12px 18px', borderRadius: '16px 16px 16px 4px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', gap: '4px', alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(255,255,255,0.4)',
                  animation: `pulse-dot 1.2s ease-in-out infinite ${i * 0.2}s`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      <div style={{ padding: '0 24px 12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {suggestions.map(s => (
          <button key={s} onClick={() => handleSend(s)} style={{
            padding: '6px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 500,
            border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)',
            color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 0.15s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(107,124,255,0.4)'; e.currentTarget.style.color = '#818cf8' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}>
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 10px 10px 16px', borderRadius: '100px',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          transition: 'border-color 0.2s',
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about your money..."
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontSize: '13px', color: '#f0f0f5', fontFamily: 'inherit',
            }}
          />
          <button onClick={() => handleSend()} style={{
            width: '32px', height: '32px', borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: input.trim() ? 'linear-gradient(135deg, #6b7cff 0%, #a78bfa 100%)' : 'rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: input.trim() ? '#fff' : 'rgba(255,255,255,0.25)',
            transition: 'all 0.2s ease',
            boxShadow: input.trim() ? '0 0 12px rgba(107,124,255,0.5)' : 'none',
          }}>
            <Icon d={Icons.send} size={14} stroke={2} />
          </button>
        </div>
      </div>

      {/* Weekly Insight */}
      <div style={{
        margin: '0 16px 16px', padding: '16px', borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(107,124,255,0.1) 0%, rgba(167,139,250,0.08) 100%)',
        border: '1px solid rgba(107,124,255,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <Icon d={Icons.sparkle} size={13} stroke={1.5} style={{ color: '#818cf8' } as any} />
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#818cf8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Weekly Insight</span>
        </div>
        <p style={{ margin: 0, fontSize: '12.5px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
          If you maintain this week's pace, you'll save <span style={{ color: '#34d399', fontWeight: 600 }}>$127 extra</span> this month — enough to move your Japan trip goal forward by <span style={{ color: '#f0f0f5', fontWeight: 500 }}>3 weeks</span>.
        </p>
      </div>

      {/* Quick actions */}
      <div style={{ padding: '0 16px 20px', display: 'flex', gap: '8px' }}>
        {[
          { label: 'Add expense', icon: 'plus' },
          { label: 'Log income', icon: 'trend_up' },
          { label: 'New goal', icon: 'piggy' },
        ].map(({ label, icon }) => (
          <button key={label} style={{
            flex: 1, padding: '10px 8px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)',
            fontSize: '11.5px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
            transition: 'all 0.15s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(107,124,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(107,124,255,0.2)'; e.currentTarget.style.color = '#818cf8' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}>
            <Icon d={(Icons as any)[icon]} size={15} stroke={1.8} />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [activeNav, setActiveNav] = useState('Dashboard')

  return (
    <div style={{ minHeight: '100vh', background: '#060608', position: 'relative' }}>
      <Orbs />

      <Navbar activeNav={activeNav} setActiveNav={setActiveNav} />

      <div style={{
        maxWidth: '1480px', margin: '0 auto',
        padding: '0 32px 80px', position: 'relative', zIndex: 1,
      }}>
        {/* Hero */}
        <SafeToSpendHero />

        {/* Quick stats row */}
        <div style={{ marginBottom: '20px' }}>
          <QuickStats />
        </div>

        {/* Main two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <WeeklySpendChart />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <GoalsCard />
              <BudgetHealthCard />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <ConfidenceCard />
              <WeeklyCheckIn />
            </div>
          </div>

          {/* Right column — AI Panel, sticky */}
          <div style={{ position: 'sticky', top: '88px' }}>
            <AIAssistantPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
