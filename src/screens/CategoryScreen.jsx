import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalStore } from '../store/globalStore'
import { img } from '../utils/theme'

const ICON_MAP = {
  favorite: 'favorite', psychology: 'psychology',
  self_improvement: 'self_improvement', monitor_weight: 'monitor_weight',
  medical_services: 'medical_services', emergency: 'emergency',
  sentiment_very_dissatisfied: 'sentiment_very_dissatisfied',
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
  const { healthCategories, userData, setUserData, selectDoctor } = useGlobalStore()
  const [pressedId, setPressedId] = useState(null)
  const [activeTab, setActiveTab] = useState('home')

  function handleSelect(cat) {
    setUserData({
      selectedCategoryId: cat.id, selectedCategoryName: cat.name,
      selectedSubCategoryId: 0, selectedSubCategoryName: '',
    })
    selectDoctor(cat.id)
    if (!cat.subcategories || cat.subcategories.length === 0) nav('/patient-input')
    else nav('/sub-categories')
  }

  return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        background: '#EEF2FF',
        fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif",
        width: '100%', boxSizing: 'border-box',
      }}>
        <style>{`
        @keyframes hdrIn  { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gridIn { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        .cat-hdr  { animation: hdrIn  0.45s ease both; }
        .cat-grid { animation: gridIn 0.45s 0.1s ease both; opacity:0; animation-fill-mode:forwards; }
        .cat-card { transition: transform 0.18s ease, box-shadow 0.18s ease !important; }
        .cat-card:hover { transform: translateY(-5px) scale(1.02) !important; }
        .cat-nav-btn { transition: all 0.14s ease; background:none; border:none; cursor:pointer; }
        .cat-nav-btn:active { transform:scale(0.88); }

        /* ── RESPONSIVE GRID ─────────────────────────────────────── */
        .cat-page-inner { width:100%; padding:0; }
        .cat-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }
        /* 3 columns on medium screens */
        @media(min-width: 640px) {
          .cat-cards-grid { grid-template-columns: repeat(3, 1fr); gap:16px; }
        }
        /* 4 columns on large screens */
        @media(min-width: 1024px) {
          .cat-cards-grid { grid-template-columns: repeat(4, 1fr); gap:18px; }
        }
      `}</style>

        {/* ── HEADER ── */}
        <div className="cat-hdr" style={{
          background: 'linear-gradient(135deg,#091525 0%,#1255B8 55%,#0088A3 100%)',
          width: '100%', boxSizing: 'border-box',
          padding: '20px 20px 0',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative orbs */}
          <div style={{ position:'absolute',top:-70,right:-70,width:220,height:220,borderRadius:'50%',background:'rgba(255,255,255,0.04)',pointerEvents:'none' }} />
          <div style={{ position:'absolute',bottom:-50,left:'25%',width:160,height:160,borderRadius:'50%',background:'rgba(0,188,212,0.07)',pointerEvents:'none' }} />
          <div style={{ position:'absolute',top:30,left:-40,width:120,height:120,borderRadius:'50%',background:'rgba(255,255,255,0.03)',pointerEvents:'none' }} />

          <div className="cat-page-inner" style={{ position:'relative', zIndex:1, padding:'0 0 0 0' }}>
            {/* Top row */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <div>
                <p style={{ color:'rgba(255,255,255,0.55)', fontSize:13, margin:'0 0 3px', letterSpacing:0.3 }}>
                  Hello, {userData?.name || 'there'} 👋
                </p>
                <h2 style={{ color:'#fff', fontSize:22, fontWeight:800, margin:0, letterSpacing:-0.5 }}>
                  How can we help?
                </h2>
              </div>
              <button onClick={() => nav('/profile')} style={{
                width:44, height:44, borderRadius:12,
                background:'rgba(255,255,255,0.12)', border:'1.5px solid rgba(255,255,255,0.2)',
                display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
            </div>

            {/* Search bar */}
            <div style={{
              background:'rgba(255,255,255,0.10)', borderRadius:14,
              padding:'11px 16px', display:'flex', alignItems:'center', gap:10,
              border:'1px solid rgba(255,255,255,0.14)', marginBottom:16,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span style={{ color:'rgba(255,255,255,0.38)', fontSize:14 }}>Search health concerns...</span>
            </div>

            {/* Stats pills */}
            <div style={{ display:'flex', gap:10, flexWrap:'wrap', paddingBottom:20 }}>
              {[
                { label:`${healthCategories?.length||0} Categories` },
                { label:'Verified Doctors' },
                { label:'Instant Help' },
              ].map(item => (
                  <div key={item.label} style={{
                    display:'flex', alignItems:'center', gap:6,
                    background:'rgba(255,255,255,0.10)', borderRadius:20,
                    padding:'5px 12px', border:'1px solid rgba(255,255,255,0.1)',
                  }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:'#4FC3F7' }} />
                    <span style={{ fontSize:11, color:'rgba(255,255,255,0.65)', fontWeight:600 }}>{item.label}</span>
                  </div>
              ))}
            </div>
          </div>

          {/* Wave */}
          <div style={{ height:22, background:'#EEF2FF', borderRadius:'18px 18px 0 0' }} />
        </div>

        {/* ── SECTION LABEL ── */}
        <div style={{ padding:'14px 20px 10px', width:'100%', boxSizing:'border-box' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:4, height:22, borderRadius:2, background:'linear-gradient(180deg,#1976D2,#0097A7)' }} />
              <span style={{ fontSize:16, fontWeight:800, color:'#0A1628' }}>All Categories</span>
            </div>
            <span style={{
              fontSize:12, color:'#1976D2', background:'#DBEAFE',
              padding:'4px 12px', borderRadius:20, fontWeight:700,
            }}>
            {healthCategories?.length||0} available
          </span>
          </div>
        </div>

        {/* ── GRID ── */}
        <div className="cat-grid" style={{ flex:1, overflowY:'auto', padding:'4px 20px 24px', width:'100%', boxSizing:'border-box' }}>
          <div className="cat-cards-grid">
            {(healthCategories||[]).map((cat, idx) => (
                <CategoryCard
                    key={cat.id}
                    cat={cat}
                    palette={PALETTES[idx % PALETTES.length]}
                    pressed={pressedId === cat.id}
                    onPress={() => setPressedId(cat.id)}
                    onRelease={() => { setPressedId(null); handleSelect(cat) }}
                />
            ))}
          </div>
        </div>

        {/* ── BOTTOM NAV ── */}
        <div style={{
          width:'100%', background:'#fff',
          borderTop:'1px solid #E3E8F5',
          display:'flex', justifyContent:'space-around',
          boxShadow:'0 -4px 24px rgba(10,22,40,0.09)',
          flexShrink:0, boxSizing:'border-box',
          padding:'6px 0 max(env(safe-area-inset-bottom,0px), 10px)',
        }}>
          {[
            { icon:(
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
              ), label:'Home', id:'home' },
            { icon:(
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
              ), label:'History', id:'history' },
            { icon:(
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
              ), label:'Alerts', id:'alerts' },
            { icon:(
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
              ), label:'Profile', id:'profile' },
          ].map(item => {
            const active = activeTab === item.id
            return (
                <button key={item.id} className="cat-nav-btn"
                        onClick={() => { setActiveTab(item.id); if (item.id === 'profile') nav('/profile') }}
                        style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2, padding:'6px 20px', position:'relative' }}
                >
                  {active && (
                      <div style={{
                        position:'absolute', top:0, left:'50%', transform:'translateX(-50%)',
                        width:28, height:3, borderRadius:'0 0 4px 4px',
                        background:'linear-gradient(90deg,#1976D2,#0097A7)',
                      }} />
                  )}
                  <span style={{ color: active ? '#1976D2' : '#9CA3AF', display:'flex', stroke: active ? '#1976D2' : '#9CA3AF' }}>
                {item.icon}
              </span>
                  <span style={{ fontSize:10, fontWeight: active ? 700 : 500, color: active ? '#1976D2' : '#9CA3AF' }}>
                {item.label}
              </span>
                </button>
            )
          })}
        </div>
      </div>
  )
}

function CategoryCard({ cat, palette: p, pressed, onPress, onRelease }) {
  const [imgErr, setImgErr] = useState(false)
  const icon   = ICON_MAP[cat.icon] || 'medical_services'
  const imgSrc = img(cat.image)

  return (
      <button
          className="cat-card"
          onMouseDown={onPress} onMouseUp={onRelease}
          onTouchStart={onPress} onTouchEnd={onRelease}
          style={{
            background: '#fff',
            borderRadius: 18,
            border: `1.5px solid ${p.ring}55`,
            padding: 0, overflow: 'hidden', cursor: 'pointer', textAlign: 'left',
            transform: pressed ? 'scale(0.95)' : 'scale(1)',
            boxShadow: pressed
                ? `0 2px 10px ${p.accent}30`
                : `0 6px 22px rgba(10,22,40,0.10)`,
            display: 'flex', flexDirection: 'column',
            width: '100%',
          }}
      >
        {/* Image area */}
        <div style={{
          width: '100%', height: 130, position: 'relative',
          overflow: 'hidden', flexShrink: 0,
          background: `linear-gradient(145deg,${p.from},${p.to})`,
        }}>
          {(imgSrc && !imgErr)
              ? <img
                  src={imgSrc} alt={cat.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={() => setImgErr(true)}
              />
              : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span className="material-icons" style={{ fontSize:54, color:p.iconColor, opacity:0.4 }}>{icon}</span>
              </div>
          }

          {/* Bottom fade overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(180deg,transparent 45%,rgba(255,255,255,0.88) 100%)`,
          }} />

          {/* Icon badge on image */}
          <div style={{
            position: 'absolute', bottom: 10, left: 10, zIndex: 2,
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(255,255,255,0.96)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 3px 10px ${p.accent}44`,
          }}>
            <span className="material-icons" style={{ fontSize: 20, color: p.iconColor }}>{icon}</span>
          </div>

          {/* Subcategory count badge */}
          {cat.subcategories?.length > 0 && (
              <div style={{
                position: 'absolute', top: 9, right: 9, zIndex: 2,
                background: p.accent, color: '#fff',
                fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 20,
                boxShadow: `0 2px 8px ${p.accent}66`, letterSpacing: 0.4,
              }}>
                {cat.subcategories.length} TYPES
              </div>
          )}
        </div>

        {/* Text section */}
        <div style={{ padding: '10px 12px 12px' }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: '#0A1628', margin: '0 0 3px', lineHeight: 1.3 }}>
            {cat.name}
          </p>
          {cat.description && (
              <p style={{
                fontSize: 11, color: '#6B7280', margin: '0 0 7px', lineHeight: 1.4,
                display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {cat.description}
              </p>
          )}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: p.from, padding: '3px 9px', borderRadius: 7,
            border: `1px solid ${p.ring}55`,
          }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: p.accent, letterSpacing: 0.5 }}>EXPLORE</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={p.accent} strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>
        </div>
      </button>
  )
}