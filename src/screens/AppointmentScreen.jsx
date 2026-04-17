import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalStore } from '../store/globalStore'
import { saveUserProfile } from '../services/localStorageService'
import AppBar from '../components/AppBar'

const GENDERS = ['Male', 'Female', 'Other']
const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']

const ADMIN_WHATSAPP = '919638190964'

function openWA(number, message) {
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank', 'noopener')
}

export default function AppointmentScreen() {
  const nav = useNavigate()
  const { userData, selectedDoctor, adminInfo, resetSession, setUserData } = useGlobalStore()

  const [name, setName] = useState(userData?.name || '')
  const [email, setEmail] = useState(userData?.email || '')
  const [mobile, setMobile] = useState(userData?.mobile || '')
  const [age, setAge] = useState(userData?.age || '')
  const [gender, setGender] = useState(userData?.gender || 'Male')
  const [selDate, setSelDate] = useState('')
  const [selTime, setSelTime] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrs, setFieldErrs] = useState({})
  const [success, setSuccess] = useState(false)

  const dateInputRef = useRef(null)

  const catName = userData?.selectedCategoryName || 'General Consultation (To be checked)'
  const subName = userData?.selectedSubCategoryName || ''
  const todayStr = new Date().toISOString().split('T')[0]
  const maxStr = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  function validate() {
    const e = {}
    if (!name.trim()) e.name = 'Name is required'
    if (!email.trim()) e.email = 'Email is required'
    else if (!/^[^@]+@[^@]+\.[^@]+/.test(email.trim())) e.email = 'Enter a valid email'
    if (!mobile.trim()) e.mobile = 'Mobile is required'
    else if (!/^[6-9]\d{9}$/.test(mobile.trim())) e.mobile = 'Enter valid 10-digit mobile'
    if (!age.trim()) e.age = 'Age is required'
    setFieldErrs(e)
    return Object.keys(e).length === 0
  }

  function fmtDate(d) {
    if (!d) return ''
    const dt = new Date(d + 'T00:00:00')
    return `${dt.getDate().toString().padStart(2, '0')}/${(dt.getMonth() + 1).toString().padStart(2, '0')}/${dt.getFullYear()}`
  }

  async function submitAppointment() {
    if (!validate()) return
    if (!selDate) { setError('Please select an appointment date'); return }
    if (!selTime) { setError('Please select a time slot'); return }
    setError('')
    setIsSubmitting(true)

    const updated = {
      ...userData,
      name: name.trim(), email: email.trim(),
      mobile: mobile.trim(), age: age.trim(), gender,
      appointmentDate: selDate, appointmentTime: selTime,
    }
    setUserData(updated)
    saveUserProfile(updated)

    await new Promise(r => setTimeout(r, 400))

    const sub = subName ? ` › ${subName}` : ''
    const doctorNum = selectedDoctor?.whatsapp || (adminInfo?.whatsapp) || ADMIN_WHATSAPP
    openWA(doctorNum,
      `🏥 *New Appointment — HealMedEngg*\n\n` +
      `👤 *Patient:* ${name.trim()}\n` +
      `📱 *Mobile:* ${mobile.trim()}\n` +
      `📧 *Email:* ${email.trim()}\n` +
      `🎂 *Age:* ${age.trim()} | *Gender:* ${gender}\n\n` +
      `🩺 *Problem:* ${catName}${sub}\n\n` +
      `📅 *Date:* ${fmtDate(selDate)}\n` +
      `⏰ *Time:* ${selTime}\n\n` +
      `Please confirm the appointment. 🙏`
    )

    setIsSubmitting(false)
    setSuccess(true)
    setTimeout(() => { resetSession?.(); nav('/categories', { replace: true }) }, 3500)
  }

  if (success) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg,#091525 0%,#1255B8 55%,#0088A3 100%)',
      fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif", padding: 24, boxSizing: 'border-box',
    }}>
      <style>{`
        @keyframes successPop { from{opacity:0;transform:scale(0.6)} to{opacity:1;transform:scale(1)} }
        @keyframes floatBob   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>
      <div style={{ background: '#fff', borderRadius: 28, padding: '48px 40px', textAlign: 'center', maxWidth: 440, width: '100%', animation: 'successPop 0.5s cubic-bezier(.34,1.56,.64,1)', boxShadow: '0 40px 80px rgba(0,0,0,0.3)' }}>
        <div style={{ width: 96, height: 96, borderRadius: '50%', margin: '0 auto 24px', background: 'linear-gradient(135deg,#E8F5E9,#C8E6C9)', border: '3px solid #81C784', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'floatBob 2s ease infinite' }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0A1628', margin: '0 0 10px' }}>Appointment Requested! 🎉</h2>
        <p style={{ color: '#6B7280', fontSize: 15, margin: '0 0 24px', lineHeight: 1.6 }}>
          Your appointment details have been sent to the doctor via WhatsApp. They will confirm soon.
        </p>
        <div style={{ background: '#F0F4FF', borderRadius: 16, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Doctor', val: selectedDoctor?.name || 'Our Specialist' },
            { label: 'Date', val: fmtDate(selDate) },
            { label: 'Time', val: selTime },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#9CA3AF' }}>{r.label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0A1628' }}>{r.val}</span>
            </div>
          ))}
        </div>
        <p style={{ color: '#9CA3AF', fontSize: 12, margin: 0 }}>Redirecting to home in a moment...</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F0F4FF', fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }

        .appt-container { max-width:1280px; margin:0 auto; width:100%; box-sizing:border-box; }
        .appt-pad { padding:24px 20px 40px; }
        @media(min-width:640px)  { .appt-pad { padding:28px 32px 48px; } }
        @media(min-width:1024px) { .appt-pad { padding:32px 56px 56px; } }

        .appt-grid { display:grid; grid-template-columns:1fr; gap:20px; }
        @media(min-width:900px)  { .appt-grid { grid-template-columns:1fr 1fr; } }

        .section-card { background:#fff; border-radius:20px; box-shadow:0 4px 20px rgba(10,22,40,0.07); border:1px solid rgba(10,22,40,0.05); overflow:hidden; animation:fadeUp 0.4s ease; }
        .section-card-header { padding:18px 20px; border-bottom:1px solid #F0F3FB; display:flex; align-items:center; gap:12; background:linear-gradient(135deg,#FAFBFF,#F0F4FF); }
        .section-card-body   { padding:20px; display:flex; flex-direction:column; gap:16px; }

        .appt-field-wrap { display:flex; align-items:center; gap:10; background:#F8FAFF; border:2px solid #E5E9F5; border-radius:13px; padding:0 14px; transition:border-color 0.18s, box-shadow 0.18s; overflow:hidden; }
        .appt-field-wrap:focus-within { border-color:#1976D2; box-shadow:0 0 0 3px rgba(25,118,210,0.1); background:#F0F7FF; }
        .appt-field-wrap input { flex:1; padding:14px 0; border:none; background:transparent; outline:none; font-size:14px; color:#0A1628; font-weight:500; font-family:inherit; }
        .appt-field-wrap input::placeholder { color:#9CA3AF; }

        .appt-select { width:100%; padding:14px; background:#F8FAFF; border:2px solid #E5E9F5; border-radius:13px; font-size:14px; color:#0A1628; font-weight:500; font-family:inherit; appearance:none; -webkit-appearance:none; cursor:pointer; outline:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2.2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; padding-right:36px; transition:all 0.18s; }
        .appt-select:focus { border-color:#1976D2; box-shadow:0 0 0 3px rgba(25,118,210,0.1); }

        .time-btn { padding:11px 16px; border-radius:11px; font-size:13px; font-weight:700; cursor:pointer; transition:all 0.18s; border:2px solid #E5E9F5; background:#F8FAFF; color:#374151; font-family:inherit; }
        .time-btn:hover { border-color:#93C5FD; transform:translateY(-2px); box-shadow:0 4px 12px rgba(25,118,210,0.15); }
        .time-btn.active { background:linear-gradient(135deg,#1976D2,#0097A7); color:#fff; border-color:transparent; box-shadow:0 4px 16px rgba(25,118,210,0.4); transform:translateY(-2px); }

        .date-wrap { position:relative; display:block; cursor:pointer; }
        .date-face { display:flex; align-items:center; gap:10; background:#F8FAFF; border:2px solid #E5E9F5; border-radius:13px; padding:14px; pointer-events:none; transition:border-color 0.18s; }
        .date-wrap.filled .date-face { border-color:#1976D2; background:#F0F7FF; box-shadow:0 0 0 3px rgba(25,118,210,0.1); }
        .date-wrap input[type="date"] { position:absolute; inset:0; width:100%; height:100%; opacity:0; cursor:pointer; z-index:10; border:none; }

        .sticky-bar { position:sticky; bottom:0; background:#fff; padding:16px 20px max(env(safe-area-inset-bottom,0px),20px); box-shadow:0 -8px 30px rgba(10,22,40,0.10); flex-shrink:0; box-sizing:border-box; }
        @media(min-width:640px) { .sticky-bar { padding:18px 32px; } }
        @media(min-width:1024px) { .sticky-bar { padding:20px 56px; } }
        .sticky-bar-inner { max-width:1280px; margin:0 auto; display:flex; gap:14px; align-items:center; }

        .book-btn { flex:1; padding:17px 24px; border-radius:14px; border:none; cursor:pointer; background:linear-gradient(135deg,#1976D2,#0097A7); color:#fff; font-size:16px; font-weight:800; font-family:inherit; display:flex; align-items:center; justify-content:center; gap:10; transition:all 0.2s; box-shadow:0 6px 24px rgba(25,118,210,0.4); }
        .book-btn:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(25,118,210,0.5); }
        .book-btn:disabled { opacity:0.7; cursor:not-allowed; transform:none; }
      `}</style>

      <AppBar title="Book Appointment" />

      {/* Doctor hero banner */}
      {selectedDoctor && (
        <div style={{ background: 'linear-gradient(100deg,#091525 0%,#1255B8 55%,#0088A3 100%)', width: '100%', boxSizing: 'border-box' }}>
          <div className="appt-container" style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.09)', borderRadius: 16, padding: '16px 20px', border: '1px solid rgba(255,255,255,0.14)' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0, background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, margin: '0 0 2px', letterSpacing: 0.8, textTransform: 'uppercase' }}>Assigned Doctor</p>
                <p style={{ color: '#fff', fontWeight: 800, fontSize: 16, margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedDoctor.name}</p>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, margin: 0 }}>{selectedDoctor.specialization}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, background: 'rgba(105,240,174,0.15)', border: '1px solid rgba(105,240,174,0.35)', borderRadius: 20, padding: '6px 13px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#69F0AE' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#69F0AE' }}>Verified</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp notice */}
      <div className="appt-container" style={{ padding: '16px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#F0FDF4', border: '1.5px solid #86EFAC', borderRadius: 13, padding: '13px 16px' }}>
          <span style={{ fontSize: 22 }}>💬</span>
          <p style={{ fontSize: 13, color: '#166534', margin: 0, fontWeight: 600 }}>Your appointment will be confirmed directly via <strong>WhatsApp</strong> — no payment needed right now</p>
        </div>
      </div>

      {/* Scrollable form */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div className="appt-container appt-pad" style={{ boxSizing: 'border-box' }}>
          <div className="appt-grid">

            {/* LEFT: Patient Details */}
            <div className="section-card">
              <div className="section-card-header">
                <div style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg,#DBEAFE,#E0F2FE)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(25,118,210,0.15)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1976D2" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 800, color: '#0A1628', margin: 0 }}>Patient Details</p>
                  <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Fill in your personal information</p>
                </div>
              </div>
              <div className="section-card-body">
                <FieldWrap label="Full Name" err={fieldErrs.name}>
                  <div className="appt-field-wrap">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1976D2" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    <input type="text" placeholder="Enter your full name" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                </FieldWrap>

                <FieldWrap label="Email Address" err={fieldErrs.email}>
                  <div className="appt-field-wrap">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1976D2" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                    <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                </FieldWrap>

                <FieldWrap label="Mobile Number" err={fieldErrs.mobile}>
                  <div className="appt-field-wrap">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1976D2" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
                    <input type="tel" placeholder="10-digit number" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} />
                  </div>
                </FieldWrap>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <FieldWrap label="Age" err={fieldErrs.age}>
                    <div className="appt-field-wrap">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1976D2" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                      <input type="tel" placeholder="Age" value={age} onChange={e => setAge(e.target.value.replace(/\D/g, '').slice(0, 3))} />
                    </div>
                  </FieldWrap>
                  <FieldWrap label="Gender">
                    <select className="appt-select" value={gender} onChange={e => setGender(e.target.value)}>
                      {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </FieldWrap>
                </div>
              </div>
            </div>

            {/* RIGHT: Appointment Details */}
            <div className="section-card">
              <div className="section-card-header">
                <div style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg,#DBEAFE,#E0F2FE)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(25,118,210,0.15)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1976D2" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 800, color: '#0A1628', margin: 0 }}>Appointment Details</p>
                  <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Choose your date &amp; time slot</p>
                </div>
              </div>
              <div className="section-card-body">
                <FieldWrap label="Appointment Date">
                  <div
                    className={`date-wrap${selDate ? ' filled' : ''}`}
                    onClick={() => dateInputRef.current?.showPicker?.() || dateInputRef.current?.click()}
                  >
                    <div className="date-face">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1976D2" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                      <span style={{ flex: 1, fontSize: 14, fontWeight: selDate ? 700 : 400, color: selDate ? '#0A1628' : '#9CA3AF' }}>
                        {selDate ? fmtDate(selDate) : 'Click to select date'}
                      </span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.2" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
                    </div>
                    <input ref={dateInputRef} type="date" min={todayStr} max={maxStr} value={selDate}
                      onChange={e => { setSelDate(e.target.value); setError('') }}
                    />
                  </div>
                </FieldWrap>

                <FieldWrap label="Select Time Slot">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
                    {TIME_SLOTS.map(slot => (
                      <button key={slot} className={`time-btn${selTime === slot ? ' active' : ''}`}
                        onClick={() => { setSelTime(slot); setError('') }}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </FieldWrap>

                {error && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FEF2F2', border: '1px solid #FECACA', padding: '12px 14px', borderRadius: 12 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    <span style={{ fontSize: 13, color: '#DC2626', fontWeight: 600 }}>{error}</span>
                  </div>
                )}

                {/* Summary */}
                <div style={{ background: 'linear-gradient(135deg,#EFF6FF,#E0F2FE)', border: '1.5px solid #BFDBFE', borderRadius: 13, padding: '16px 18px' }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#1D4ED8', margin: '0 0 10px', letterSpacing: 0.3 }}>BOOKING SUMMARY</p>
                  {[
                    { label: 'Category', val: catName + (subName ? ` › ${subName}` : '') },
                    { label: 'Doctor', val: selectedDoctor?.name || 'Our Specialist' },
                    { label: 'Date', val: selDate ? fmtDate(selDate) : '—' },
                    { label: 'Time', val: selTime || '—' },
                  ].map(r => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: '#6B7280' }}>{r.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#0A1628', textAlign: 'right', maxWidth: '55%' }}>{r.val}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid #BFDBFE', marginTop: 8, paddingTop: 10 }}>
                    <p style={{ fontSize: 12, color: '#3B82F6', margin: 0, fontWeight: 600 }}>✅ Appointment via WhatsApp — Doctor will confirm shortly</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="sticky-bar">
        <div className="sticky-bar-inner">
          <button className="book-btn" onClick={submitAppointment} disabled={isSubmitting}>
            {isSubmitting ? (
              <><div style={{ width: 20, height: 20, borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} /><span>Booking...</span></>
            ) : (
              <><span style={{ fontSize: 20 }}>💬</span> Confirm via WhatsApp</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function FieldWrap({ label, children, err }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 700, color: '#4B5563', letterSpacing: 0.3, textTransform: 'uppercase' }}>{label}</label>}
      {children}
      {err && (
        <p style={{ margin: 0, fontSize: 12, color: '#DC2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          {err}
        </p>
      )}
    </div>
  )
}