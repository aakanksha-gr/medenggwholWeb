import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalStore } from '../store/globalStore'
import { img } from '../utils/theme'

const ICON_MAP = {
  favorite: 'favorite', psychology: 'psychology',
  self_improvement: 'self_improvement', monitor_weight: 'monitor_weight',
  medical_services: 'medical_services', emergency: 'emergency',
  sentiment_very_dissatisfied: 'sentiment_very_dissatisfied', bloodtype: 'bloodtype', monitor_heart: 'monitor_heart',
}

const PALETTES = [
  { from: '#E8F5E9', to: '#C8E6C9', iconColor: '#2E7D32', accent: '#43A047', textColor: '#1B5E20', ring: '#81C784' },
  { from: '#E3F2FD', to: '#BBDEFB', iconColor: '#1565C0', accent: '#1976D2', textColor: '#0D47A1', ring: '#64B5F6' },
  { from: '#FCE4EC', to: '#F8BBD0', iconColor: '#AD1457', accent: '#C2185B', textColor: '#880E4F', ring: '#F06292' },
  { from: '#FFF3E0', to: '#FFE0B2', iconColor: '#E65100', accent: '#F57C00', textColor: '#BF360C', ring: '#FFB74D' },
  { from: '#F3E5F5', to: '#E1BEE7', iconColor: '#6A1B9A', accent: '#7B1FA2', textColor: '#4A148C', ring: '#BA68C8' },
  { from: '#E0F7FA', to: '#B2EBF2', iconColor: '#00695C', accent: '#00796B', textColor: '#004D40', ring: '#4DB6AC' },
  { from: '#FFF8E1', to: '#FFECB3', iconColor: '#F57F17', accent: '#F9A825', textColor: '#E65100', ring: '#FFD54F' },
  { from: '#EDE7F6', to: '#D1C4E9', iconColor: '#4527A0', accent: '#512DA8', textColor: '#311B92', ring: '#9575CD' },
]

export default function CategoryScreen() {
  const nav = useNavigate()
  const { healthCategories, userData, setUserData, selectDoctor, resetSession } = useGlobalStore()
  const [activeTab, setActiveTab] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')

  // Flush session data when entering the main page to ensure fresh booking/assessment state
  useState(() => {
    resetSession?.()
  }, [])

  function handleSelect(cat) {
    setUserData({
      ...userData,
      selectedCategoryId: cat.id, selectedCategoryName: cat.name,
      selectedSubCategoryId: 0, selectedSubCategoryName: '',
    })
    selectDoctor?.(cat.id)
    if (!cat.subcategories || cat.subcategories.length === 0) nav('/patient-input')
    else nav('/sub-categories')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F0F4FF', fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif", width: '100%', boxSizing: 'border-box' }}>
      <style>{`
        @keyframes hdrIn  { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gridIn { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        .cat-hdr  { animation: hdrIn  0.45s ease both; }
        .cat-grid { animation: gridIn 0.45s 0.1s ease both; opacity:0; animation-fill-mode:forwards; }
        .cat-card { transition: transform 0.18s ease, box-shadow 0.18s ease !important; }
        .cat-card:hover { transform: translateY(-6px) scale(1.01) !important; box-shadow: 0 16px 40px rgba(10,22,40,0.15) !important; }
        .cat-card:active { transform: scale(0.98) !important; }

        /* Full-width header */
        .cat-hdr-wrap { background: linear-gradient(135deg,#091525 0%,#1255B8 55%,#0088A3 100%); width:100%; box-sizing:border-box; }
        .cat-inner { max-width:1400px; margin:0 auto; width:100%; box-sizing:border-box; }
        .cat-inner-pad { padding: 0 20px; }
        @media(min-width:640px)  { .cat-inner-pad { padding: 0 40px; } }
        @media(min-width:1024px) { .cat-inner-pad { padding: 0 64px; } }

        .cat-content-pad { padding: 20px 20px 100px; }
        @media(min-width:640px)  { .cat-content-pad { padding: 24px 40px 100px; } }
        @media(min-width:1024px) { .cat-content-pad { padding: 28px 64px 100px; } }

        /* Responsive grid — always fills width */
        .category-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media(min-width:640px)  { .category-grid { grid-template-columns: repeat(3, 1fr); gap: 18px; } }
        @media(min-width:900px)  { .category-grid { grid-template-columns: repeat(4, 1fr); gap: 20px; } }
        @media(min-width:1200px) { .category-grid { grid-template-columns: repeat(5, 1fr); gap: 22px; } }

        /* Card image: taller on desktop */
        .card-img-wrap { position:relative; overflow:hidden; width:100%; height:160px; }
        @media(min-width:640px)  { .card-img-wrap { height:180px; } }
        @media(min-width:1024px) { .card-img-wrap { height:200px; } }
        .card-img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.4s ease; }
        .cat-card:hover .card-img { transform: scale(1.06); }
        .card-overlay { position:absolute; inset:0; background:linear-gradient(180deg,transparent 40%,rgba(10,22,40,0.35) 100%); }
        .card-icon-box { position:absolute; bottom:12px; left:12px; width:36px; height:36px; borderRadius:10px; background:rgba(255,255,255,0.92); border:1.5px solid rgba(255,255,255,0.5); display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.15); backdrop-filter:blur(8px); }

        /* Bottom nav */
        .glass-nav-wrapper { position:fixed; bottom:0; left:0; right:0; z-index:50; padding:0 0 max(env(safe-area-inset-bottom,0px),8px); }
        .glass-nav { max-width:600px; margin:0 auto; background:rgba(255,255,255,0.95); backdrop-filter:blur(20px); border-radius:24px 24px 0 0; box-shadow:0 -4px 32px rgba(10,22,40,0.12); display:flex; padding:8px 0 4px; border-top:1px solid rgba(255,255,255,0.6); }
        @media(min-width:900px) { .glass-nav { border-radius:24px; margin:8px auto; max-width:480px; } }
        .nav-btn { flex:1; display:flex; flex-direction:column; align-items:center; gap:4; padding:8px 0 4px; background:none; border:none; cursor:pointer; position:relative; }
        .nav-indicator { position:absolute; top:0; width:24px; height:3px; border-radius:0 0 3px 3px; transition:background 0.2s; }

        /* Search bar */
        .search-bar { display:flex; align-items:center; gap:12; background:rgba(255,255,255,0.12); border-radius:16px; padding:13px 18px; border:1px solid rgba(255,255,255,0.18); margin-bottom:20px; cursor:pointer; }

        /* Stats pills */
        .stats-row { display:flex; gap:14px; flex-wrap:wrap; padding-bottom:24px; }
        .stat-pill { display:flex; align-items:center; gap:8px; background:rgba(255,255,255,0.10); borderRadius:20px; padding:6px 14px; border:1px solid rgba(255,255,255,0.1); border-radius:20px; }
        
        @media(max-width:480px) {
          .hide-mobile { display:none !important; }
          .show-mobile { display:inline-block !important; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <header className="cat-hdr cat-hdr-wrap" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: '20%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(0,188,212,0.07)', pointerEvents: 'none' }} />

        <div className="cat-inner cat-inner-pad">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, marginBottom: 20 }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: '0 0 4px', letterSpacing: 0.3 }}>
                  Hello, {userData?.name || 'there'} 👋
                </p>
                <h1 style={{ color: '#fff', fontSize: 30, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>
                  How can we help?
                </h1>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <button 
                  onClick={() => { resetSession(); nav('/appointment'); }}
                  style={{ 
                    height: 48, 
                    borderRadius: 24, 
                    padding: '0 20px',
                    background: 'rgba(255,255,255,0.15)', 
                    border: '1.5px solid rgba(255,255,255,0.25)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 8,
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer', 
                    transition: 'all 0.2s',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
                  <span className="material-icons" style={{ fontSize: 20 }}>calendar_month</span>
                  <span className="hide-mobile">Book Appointment</span>
                  <span className="show-mobile" style={{ display: 'none' }}>Book</span>
                </button>
                <button onClick={() => nav('/profile')} style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </button>
              </div>
            </div>

            <div className="search-bar" style={{ padding: '0 18px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input
                type="text"
                placeholder="Search health concerns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: 15,
                  padding: '13px 0 13px 12px',
                  flex: 1,
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div className="stats-row">
              {[
                `${healthCategories?.length || 0} Categories`,
                'Verified Doctors',
                'Instant Help',
              ].map(lbl => (
                <div key={lbl} className="stat-pill">
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#38BDF8', boxShadow: '0 0 8px rgba(56,189,248,0.5)' }} />
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>{lbl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Wave bottom */}
        <div style={{ height: 24, background: '#F0F4FF', borderRadius: '20px 20px 0 0' }} />
      </header>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <div className="cat-inner">
          <div className="cat-content-pad cat-inner cat-grid" style={{ boxSizing: 'border-box' }}>
            {/* Section heading */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 5, height: 26, borderRadius: 3, background: '#3B82F6' }} />
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: 0 }}>All Categories</h2>
              </div>
              <span style={{ fontSize: 13, color: '#1D4ED8', background: '#DBEAFE', padding: '6px 16px', borderRadius: 20, fontWeight: 700 }}>
                {healthCategories?.length || 0} available
              </span>
            </div>

            {/* Category grid */}
            <div className="category-grid" style={{ gridColumn: '1 / -1' }}>
              {(healthCategories || [])
                .filter(cat =>
                  cat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((cat, idx) => (
                  <CategoryCard
                    key={cat.id}
                    cat={cat}
                    palette={PALETTES[idx % PALETTES.length]}
                    onSelect={() => handleSelect(cat)}
                  />
                ))}
            </div>
          </div>
        </div>
      </main>

      {/* ── BOTTOM NAV ── */}
      <div className="glass-nav-wrapper">
        <nav className="glass-nav">
          {[
            { label: 'Home', id: 'home', path: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></> },
            { label: 'History', id: 'history', path: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></> },
            { label: 'Alerts', id: 'alerts', path: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></> },
            { label: 'Profile', id: 'profile', path: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></> },
          ].map(item => {
            const isActive = activeTab === item.id
            return (
              <button key={item.id} className="nav-btn" onClick={() => { setActiveTab(item.id); if (item.id === 'profile') nav('/profile') }}>
                <div className="nav-indicator" style={{ background: isActive ? '#3B82F6' : 'transparent' }} />
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#3B82F6' : '#64748B'} strokeWidth={isActive ? '2.5' : '2'} strokeLinecap="round" strokeLinejoin="round">{item.path}</svg>
                <span style={{ fontSize: 11, fontWeight: isActive ? 700 : 600, color: isActive ? '#3B82F6' : '#64748B', marginTop: 2 }}>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

function CategoryCard({ cat, palette: p, onSelect }) {
  const [imgErr, setImgErr] = useState(false)
  const icon = ICON_MAP[cat.icon] || 'medical_services'
  const imgSrc = img(cat.image)

  return (
    <button className="cat-card" onClick={onSelect} style={{ background: '#fff', borderRadius: 20, border: '1.5px solid rgba(10,22,40,0.06)', padding: 0, overflow: 'hidden', cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 18px rgba(10,22,40,0.07)', width: '100%' }}>

      {/* Image section */}
      <div className="card-img-wrap" style={{ background: `linear-gradient(145deg,${p.from},${p.to})` }}>
        {(imgSrc && !imgErr) ? (
          <>
            <img src={imgSrc} alt={cat.name} className="card-img" onError={() => setImgErr(true)} />
            <div className="card-overlay" />
          </>
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-icons" style={{ fontSize: 72, color: p.iconColor, opacity: 0.25 }}>{icon}</span>
          </div>
        )}

        {/* Icon box */}
        <div className="card-icon-box">
          <span className="material-icons" style={{ fontSize: 20, color: p.iconColor }}>{icon}</span>
        </div>

        {/* Badge */}
        {cat.subcategories?.length > 0 && (
          <div style={{ position: 'absolute', top: 12, right: 12, background: p.accent, color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 20, boxShadow: `0 4px 12px ${p.accent}66`, letterSpacing: '0.05em' }}>
            {cat.subcategories.length} TYPES
          </div>
        )}
      </div>

      {/* Text section */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 6px', lineHeight: 1.3 }}>{cat.name}</h3>
        {cat.description && (
          <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 12px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>{cat.description}</p>
        )}
        <div style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: p.accent, letterSpacing: '0.02em' }}>EXPLORE</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </div>
      </div>
    </button>
  )
}