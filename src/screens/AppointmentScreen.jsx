import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalStore } from '../store/globalStore'
import { saveUserProfile } from '../services/localStorageService'
import AppBar from '../components/AppBar'

const GENDERS    = ['Male', 'Female', 'Other']
const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']

function openWA(number, message) {
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank', 'noopener')
}

export default function AppointmentScreen() {
  const nav = useNavigate()
  const { userData, selectedDoctor, adminInfo, resetSession, setUserData } = useGlobalStore()

  const [name,         setName]         = useState(userData.name   || '')
  const [email,        setEmail]        = useState(userData.email  || '')
  const [mobile,       setMobile]       = useState(userData.mobile || '')
  const [age,          setAge]          = useState(userData.age    || '')
  const [gender,       setGender]       = useState(userData.gender || 'Male')
  const [selDate,      setSelDate]      = useState('')
  const [selTime,      setSelTime]      = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error,        setError]        = useState('')
  const [fieldErrs,    setFieldErrs]    = useState({})
  const [success,      setSuccess]      = useState(false)

  const dateInputRef = useRef(null)

  const catName = userData.selectedCategoryName || 'Health'
  const subName = userData.selectedSubCategoryName || ''
  const todayStr = new Date().toISOString().split('T')[0]
  const maxStr   = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  function validate() {
    const e = {}
    if (!name.trim())   e.name   = 'Name is required'
    if (!email.trim())  e.email  = 'Email is required'
    else if (!/^[^@]+@[^@]+\.[^@]+/.test(email.trim())) e.email = 'Enter a valid email'
    if (!mobile.trim()) e.mobile = 'Mobile is required'
    else if (!/^[6-9]\d{9}$/.test(mobile.trim())) e.mobile = 'Enter valid 10-digit mobile'
    if (!age.trim())    e.age    = 'Age is required'
    setFieldErrs(e)
    return Object.keys(e).length === 0
  }

  function fmtDate(d) {
    if (!d) return ''
    const dt = new Date(d)
    return `${dt.getDate().toString().padStart(2,'0')}/${(dt.getMonth()+1).toString().padStart(2,'0')}/${dt.getFullYear()}`
  }

  async function submitAppointment() {
    if (!validate()) return
    if (!selDate) { setError('Please select an appointment date'); return }
    if (!selTime) { setError('Please select a time slot'); return }
    setError('')
    setIsSubmitting(true)
    const updated = {
      ...userData, name: name.trim(), email: email.trim(),
      mobile: mobile.trim(), age: age.trim(), gender,
      appointmentDate: selDate, appointmentTime: selTime,
    }
    setUserData(updated)
    saveUserProfile(updated)
    await new Promise(r => setTimeout(r, 400))
    notifyDoctor()
    await new Promise(r => setTimeout(r, 900))
    confirmPatient()
    await new Promise(r => setTimeout(r, 900))
    notifyAdmin()
    setIsSubmitting(false)
    setSuccess(true)
    setTimeout(() => { resetSession(); nav('/categories', { replace: true }) }, 3000)
  }

  function notifyDoctor() {
    if (!selectedDoctor?.whatsapp) return
    const sub = subName ? ` › ${subName}` : ''
    openWA(selectedDoctor.whatsapp,
        `🏥 *New Appointment — HealMedEngg*\n\n👤 *Patient:* ${name.trim()}\n📱 *Mobile:* ${mobile.trim()}\n` +
        `📧 *Email:* ${email.trim()}\n🎂 *Age:* ${age.trim()} | *Gender:* ${gender}\n\n` +
        `🩺 *Problem:* ${catName}${sub}\n\n📅 *Date:* ${fmtDate(selDate)}\n⏰ *Time:* ${selTime}\n\nPlease confirm.`)
  }

  function confirmPatient() {
    const num = mobile.trim().startsWith('91') ? mobile.trim() : `91${mobile.trim()}`
    openWA(num, `✅ *HealMedEngg — Appointment Confirmed!*\n\nDear ${name.trim()},\n\n` +
        `Your appointment has been booked.\n\n👨‍⚕️ *Doctor:* ${selectedDoctor?.name || 'Our Specialist'}\n` +
        `📅 *Date:* ${fmtDate(selDate)}\n⏰ *Time:* ${selTime}\n\nThank you! 🙏`)
  }

  function notifyAdmin() {
    if (!adminInfo?.whatsapp) return
    openWA(adminInfo.whatsapp,
        `📋 *Admin Alert — New Booking*\n\n👤 ${name.trim()} | 📱 ${mobile.trim()}\n🩺 ${catName}\n` +
        `👨‍⚕️ ${selectedDoctor?.name || 'N/A'}\n📅 ${fmtDate(selDate)} at ${selTime}`)
  }

  /* ── SUCCESS SCREEN ── */
  if (success) return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg,#091525 0%,#1255B8 55%,#0088A3 100%)',
        fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif",
        padding: 24, width: '100%', boxSizing: 'border-box',
      }}>
        <style>{`
        @keyframes successPop { from{opacity:0;transform:scale(0.6)} to{opacity:1;transform:scale(1)} }
        @keyframes floatBob   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>
        <div style={{
          background: '#fff', borderRadius: 28, padding: '40px 32px',
          textAlign: 'center', maxWidth: 400, width: '100%',
          animation: 'successPop 0.5s cubic-bezier(.34,1.56,.64,1)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
        }}>
          <div style={{
            width: 96, height: 96, borderRadius: '50%', margin: '0 auto 20px',
            background: 'linear-gradient(135deg,#E8F5E9,#C8E6C9)',
            border: '3px solid #81C784',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'floatBob 2s ease infinite',
          }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0A1628', margin: '0 0 8px' }}>Appointment Booked! 🎉</h2>
          <p style={{ color: '#6B7280', fontSize: 14, margin: '0 0 24px' }}>
            {selectedDoctor?.name || 'Our doctor'} will contact you soon.
          </p>
          <div style={{ background:'#F0F4FF', borderRadius:16, padding:'16px 20px', display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
            {[
              { label:'Doctor', val: selectedDoctor?.name || 'Specialist' },
              { label:'Date',   val: fmtDate(selDate) },
              { label:'Time',   val: selTime },
            ].map(r => (
                <div key={r.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:12, color:'#9CA3AF' }}>{r.label}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:'#0A1628' }}>{r.val}</span>
                </div>
            ))}
          </div>
          <p style={{ color:'#9CA3AF', fontSize:12, margin:0 }}>Redirecting to home in 3 seconds...</p>
        </div>
      </div>
  )

  /* ── MAIN FORM ── */
  return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        background: '#EEF2FF',
        fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif",
        width: '100%', boxSizing: 'border-box',
      }}>
        <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }

        /* ── NATIVE DATE INPUT — fully interactive overlay ── */
        .date-pick-wrap { position:relative; display:block; }
        .date-pick-wrap input[type="date"] {
          position:absolute; inset:0; width:100%; height:100%;
          opacity:0; cursor:pointer; z-index:10; border:none;
          background:transparent; padding:0; margin:0;
          -webkit-appearance:none;
        }
        .date-pick-face {
          display:flex; align-items:center; gap:10;
          background:#fff; border:2px solid #E3E8F5; border-radius:13px;
          padding:13px 16px; cursor:pointer; transition:border-color 0.18s, box-shadow 0.18s;
          pointer-events:none;
        }
        .date-pick-wrap:hover .date-pick-face { border-color:#93C5FD; }
        .date-pick-wrap.filled .date-pick-face { border-color:#1976D2; background:#F0F7FF; box-shadow:0 0 0 3px rgba(25,118,210,0.1); }

        /* ── FORM INPUT ── */
        .appt-input-wrap {
          display:flex; align-items:center; gap:10;
          background:#fff; border:2px solid #E3E8F5; border-radius:13px;
          padding:0 14px; transition:border-color 0.18s, box-shadow 0.18s;
          overflow:hidden;
        }
        .appt-input-wrap:focus-within {
          border-color:#1976D2;
          box-shadow:0 0 0 3px rgba(25,118,210,0.1);
          background:#F0F7FF;
        }
        .appt-input-wrap input {
          flex:1; padding:13px 0; border:none; background:transparent;
          outline:none; font-size:14px; color:#0A1628; font-weight:500;
          font-family:'Plus Jakarta Sans','Segoe UI',sans-serif;
        }
        .appt-input-wrap input::placeholder { color:#9CA3AF; }

        /* ── GENDER SELECT ── */
        .appt-select {
          width:100%; padding:13px 14px;
          background:#fff; border:2px solid #E3E8F5; border-radius:13px;
          font-size:14px; color:#0A1628; font-weight:500;
          font-family:'Plus Jakarta Sans','Segoe UI',sans-serif;
          appearance:none; -webkit-appearance:none; cursor:pointer; outline:none;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2.2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat:no-repeat; background-position:right 12px center;
          padding-right:36px; transition:border-color 0.18s, box-shadow 0.18s;
        }
        .appt-select:focus { border-color:#1976D2; box-shadow:0 0 0 3px rgba(25,118,210,0.1); }

        /* ── TIME BUTTON ── */
        .time-slot-btn {
          padding:10px 15px; border-radius:11px;
          font-size:13px; font-weight:700; cursor:pointer;
          transition:all 0.18s ease; border:2px solid #E3E8F5;
          background:#fff; color:#374151; font-family:inherit;
        }
        .time-slot-btn:hover { border-color:#93C5FD; transform:translateY(-2px); box-shadow:0 4px 12px rgba(25,118,210,0.15); }
        .time-slot-btn.active {
          background:linear-gradient(135deg,#1976D2,#0097A7);
          color:#fff; border-color:transparent;
          box-shadow:0 4px 16px rgba(25,118,210,0.4);
          transform:translateY(-2px);
        }

        /* ── RESPONSIVE FORM ── */
        .appt-two-col { display:grid; grid-template-columns:1fr; gap:20px; }
        @media(min-width:768px) {
          .appt-two-col { grid-template-columns:1fr 1fr; }
        }
      `}</style>

        <AppBar title="Book Appointment" />

        {/* Doctor hero banner — full width */}
        {selectedDoctor && (
            <div style={{
              background: 'linear-gradient(100deg,#091525 0%,#1255B8 55%,#0088A3 100%)',
              width: '100%', boxSizing: 'border-box', padding: '16px 20px',
            }}>
              <div style={{
                display:'flex', alignItems:'center', gap:14,
                background:'rgba(255,255,255,0.09)', borderRadius:16, padding:'14px 18px',
                border:'1px solid rgba(255,255,255,0.14)', backdropFilter:'blur(8px)',
              }}>
                <div style={{
                  width:50, height:50, borderRadius:14, flexShrink:0,
                  background:'linear-gradient(135deg,rgba(255,255,255,0.2),rgba(255,255,255,0.06))',
                  border:'1.5px solid rgba(255,255,255,0.22)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ color:'rgba(255,255,255,0.48)', fontSize:10, margin:'0 0 2px', letterSpacing:0.9, textTransform:'uppercase' }}>Assigned Doctor</p>
                  <p style={{ color:'#fff', fontWeight:800, fontSize:15, margin:'0 0 1px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{selectedDoctor.name}</p>
                  <p style={{ color:'rgba(255,255,255,0.52)', fontSize:12, margin:0 }}>{selectedDoctor.specialization}</p>
                </div>
                <div style={{
                  display:'flex', alignItems:'center', gap:5, flexShrink:0,
                  background:'rgba(105,240,174,0.15)', border:'1px solid rgba(105,240,174,0.35)',
                  borderRadius:20, padding:'5px 11px',
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#69F0AE" stroke="none">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span style={{ fontSize:11, fontWeight:700, color:'#69F0AE' }}>Verified</span>
                </div>
              </div>
            </div>
        )}

        {/* ── SCROLLABLE FORM ── */}
        <div style={{ flex:1, overflowY:'auto' }}>
          <div style={{ width:'100%', padding:'18px 20px 120px', boxSizing:'border-box' }}>

            {/* Pre-fill notice */}
            <div style={{
              display:'flex', alignItems:'center', gap:10,
              background:'linear-gradient(135deg,#F0FDF4,#DCFCE7)',
              border:'1.5px solid #86EFAC', borderRadius:13, padding:'11px 16px',
              marginBottom:16, animation:'fadeUp 0.35s ease',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span style={{ fontSize:13, color:'#15803D', fontWeight:600 }}>
              Profile info pre-filled — review before confirming
            </span>
            </div>

            <div className="appt-two-col">
              {/* ── LEFT COLUMN: Personal Info ── */}
              <SectionCard title="Personal Information" iconPath="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" subtitle="Your contact details">

                <FieldWrap label="Full Name" err={fieldErrs.name}>
                  <div className="appt-input-wrap">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1976D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    <input type="text" placeholder="Enter your full name" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                </FieldWrap>

                <FieldWrap label="Email Address" err={fieldErrs.email}>
                  <div className="appt-input-wrap">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1976D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                </FieldWrap>

                <FieldWrap label="Mobile Number" err={fieldErrs.mobile}>
                  <div className="appt-input-wrap">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1976D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
                    </svg>
                    <input
                        type="tel" placeholder="10-digit number" value={mobile}
                        onChange={e => setMobile(e.target.value.replace(/\D/g,'').slice(0,10))}
                    />
                  </div>
                </FieldWrap>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <FieldWrap label="Age" err={fieldErrs.age}>
                    <div className="appt-input-wrap">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1976D2" strokeWidth="2" strokeLinecap="round" style={{flexShrink:0}}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <input
                          type="tel" placeholder="Age"  value={age}
                          onChange={e => setAge(e.target.value.replace(/\D/g,'').slice(0,3))}
                      />
                    </div>
                  </FieldWrap>

                  <FieldWrap label="Gender">
                    <select className="appt-select" value={gender} onChange={e => setGender(e.target.value)}>
                      {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </FieldWrap>
                </div>
              </SectionCard>

              {/* ── RIGHT COLUMN: Appointment Details ── */}
              <SectionCard title="Appointment Details" iconPath="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" subtitle="Choose date & time">

                {/* DATE PICKER — native input overlaid, fully clickable */}
                <FieldWrap label="Appointment Date">
                  <div className={`date-pick-wrap${selDate ? ' filled' : ''}`}>
                    <div className="date-pick-face">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1976D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <span style={{
                        flex:1, fontSize:14,
                        fontWeight: selDate ? 700 : 400,
                        color: selDate ? '#0A1628' : '#9CA3AF',
                      }}>
                      {selDate ? fmtDate(selDate) : 'Tap to select date'}
                    </span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.2" strokeLinecap="round">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                    {/* THE KEY: native date input overlaid 100% opacity:0 */}
                    <input
                        ref={dateInputRef}
                        type="date"
                        min={todayStr}
                        max={maxStr}
                        value={selDate}
                        onChange={e => {
                          setSelDate(e.target.value)
                          setError('')
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          dateInputRef.current?.showPicker?.() // 🔥 important
                        }}
                    />
                  </div>
                </FieldWrap>

                {/* TIME SLOTS */}
                <FieldWrap label="Select Time Slot">
                  <div style={{ display:'flex', flexWrap:'wrap', gap:9 }}>
                    {TIME_SLOTS.map(slot => (
                        <button
                            key={slot}
                            className={`time-slot-btn${selTime === slot ? ' active' : ''}`}
                            onClick={() => { setSelTime(slot); setError('') }}
                        >
                          {slot}
                        </button>
                    ))}
                  </div>
                </FieldWrap>

                {/* Error message */}
                {error && (
                    <div style={{
                      display:'flex', alignItems:'center', gap:8,
                      background:'#FEF2F2', border:'1px solid #FECACA',
                      padding:'11px 14px', borderRadius:12,
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      <span style={{ fontSize:13, color:'#DC2626', fontWeight:600 }}>{error}</span>
                    </div>
                )}
              </SectionCard>
            </div>
          </div>
        </div>

        {/* ── STICKY BOTTOM ── */}
        <div style={{
          width:'100%', background:'#fff',
          padding:'14px 20px max(env(safe-area-inset-bottom,0px),20px)',
          boxShadow:'0 -8px 30px rgba(10,22,40,0.10)',
          position:'sticky', bottom:0, flexShrink:0, boxSizing:'border-box',
          display:'flex', flexDirection:'column', gap:10,
        }}>
          <button
              onClick={submitAppointment}
              disabled={isSubmitting}
              style={{
                width:'100%', padding:'15px 24px', borderRadius:14, border:'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                background: isSubmitting
                    ? 'linear-gradient(135deg,#93C5FD,#67E8F9)'
                    : 'linear-gradient(135deg,#1976D2 0%,#0097A7 100%)',
                color:'#fff', fontSize:15, fontWeight:800,
                display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                boxShadow: isSubmitting ? 'none' : '0 6px 24px rgba(25,118,210,0.4)',
                transition:'all 0.2s ease', letterSpacing:0.3,
              }}
              onMouseDown={e => !isSubmitting && (e.currentTarget.style.transform='scale(0.98)')}
              onMouseUp={e => e.currentTarget.style.transform='scale(1)'}
          >
            {isSubmitting ? (
                <>
                  <div style={{ width:20,height:20,borderRadius:'50%',border:'2.5px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',animation:'spin 0.8s linear infinite' }} />
                  <span>Booking your appointment...</span>
                </>
            ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Confirm Appointment
                </>
            )}
          </button>

          <button
              onClick={() => { if (validate()) notifyDoctor() }}
              style={{
                width:'100%', padding:'13px 24px', borderRadius:14, cursor:'pointer',
                background:'#fff', border:'1.5px solid #E3E8F5',
                color:'#374151', fontSize:14, fontWeight:700,
                display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                transition:'all 0.15s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor='#86EFAC'}
              onMouseLeave={e => e.currentTarget.style.borderColor='#E3E8F5'}
          >
            <span style={{ fontSize:18 }}>💬</span>
            Send via WhatsApp Only
          </button>
        </div>
      </div>
  )
}

/* ── HELPERS ── */
function SectionCard({ title, iconPath, subtitle, children }) {
  return (
      <div style={{
        background:'#fff', borderRadius:20,
        boxShadow:'0 4px 20px rgba(10,22,40,0.07)',
        border:'1px solid rgba(10,22,40,0.05)',
        overflow:'hidden', animation:'fadeUp 0.4s ease',
      }}>
        <div style={{
          padding:'14px 18px 12px',
          borderBottom:'1px solid #F0F3FB',
          display:'flex', alignItems:'center', gap:10,
          background:'linear-gradient(135deg,#FAFBFF,#F0F4FF)',
        }}>
          <div style={{
            width:36, height:36, borderRadius:10, flexShrink:0,
            background:'linear-gradient(135deg,#DBEAFE,#E0F2FE)',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 2px 8px rgba(25,118,210,0.15)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1976D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={iconPath} />
            </svg>
          </div>
          <div>
            <p style={{ fontSize:15, fontWeight:800, color:'#0A1628', margin:0 }}>{title}</p>
            {subtitle && <p style={{ fontSize:11, color:'#9CA3AF', margin:0 }}>{subtitle}</p>}
          </div>
        </div>
        <div style={{ padding:'16px 18px', display:'flex', flexDirection:'column', gap:14 }}>
          {children}
        </div>
      </div>
  )
}

function FieldWrap({ label, children, err }) {
  return (
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {label && (
            <label style={{ fontSize:12, fontWeight:700, color:'#4B5563', letterSpacing:0.3 }}>
              {label}
            </label>
        )}
        {children}
        {err && (
            <p style={{ margin:0, fontSize:12, color:'#DC2626', fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {err}
            </p>
        )}
      </div>
  )
}