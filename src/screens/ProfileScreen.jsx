import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalStore } from '../store/globalStore'
import { saveUserProfile } from '../services/localStorageService'

const GENDERS = ['Male', 'Female', 'Other']

export default function ProfileScreen() {
    const nav = useNavigate()
    const { userData, setUserData } = useGlobalStore()
    const [name, setName] = useState(userData?.name || '')
    const [email, setEmail] = useState(userData?.email || '')
    const [age, setAge] = useState(userData?.age || '')
    const [gender, setGender] = useState(userData?.gender || 'Male')
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [saved, setSaved] = useState(false)

    function validate() {
        const e = {}
        if (!name.trim()) e.name = 'Full name is required'
        if (!email.trim()) e.email = 'Email is required'
        else if (!/^[^@]+@[^@]+\.[^@]+/.test(email.trim())) e.email = 'Enter a valid email address'
        if (!age.trim()) e.age = 'Age is required'
        else if (Number(age) < 1 || Number(age) > 120) e.age = 'Enter a valid age'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    async function save() {
        if (!validate()) return
        setIsLoading(true)
        const updated = { ...userData, name: name.trim(), email: email.trim(), age: age.trim(), gender, isProfileComplete: true }
        setUserData(updated)
        saveUserProfile(updated)
        setSaved(true)
        await new Promise(r => setTimeout(r, 600))
        setIsLoading(false)
        nav('/categories', { replace: true })
    }

    if (saved) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg,#0A1628,#0D2137,#0A3D4A)', fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif" }}>
            <div style={{ textAlign: 'center', color: '#fff' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(0,230,118,0.2)', border: '2px solid #00E676', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <span className="material-icons" style={{ fontSize: 36, color: '#00E676' }}>check</span>
                </div>
                <p style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>Profile Saved!</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Taking you to home...</p>
            </div>
        </div>
    )

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#0A1628 0%,#0D2137 45%,#0A3D4A 100%)', fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif", display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to { transform: rotate(360deg) } }
        select option { color: #0A1628; }
        .pf-wrap { width:100%; max-width:600px; min-height:100vh; display:flex; flex-direction:column; }
        .pf-field-wrap { display:flex; align-items:center; background:#F8FAFF; border:2px solid #E5E9F5; border-radius:13px; overflow:hidden; transition:border-color 0.18s, box-shadow 0.18s; }
        .pf-field-wrap:focus-within { border-color:#2979FF; box-shadow:0 0 0 3px rgba(41,121,255,0.1); background:#F0F5FF; }
        .pf-field-wrap input { flex:1; padding:14px 14px 14px 0; font-size:15px; color:#0A1628; background:transparent; border:none; outline:none; font-family:inherit; font-weight:600; }
        .pf-field-wrap input::placeholder { color:#9CA3AF; font-weight:400; }
        .pf-icon { padding:14px 12px 14px 14px; display:flex; align-items:center; }
        .pf-select { padding:14px; font-size:15px; color:#0A1628; background:#F8FAFF; border:2px solid #E5E9F5; border-radius:13px; outline:none; cursor:pointer; appearance:none; font-family:inherit; font-weight:600; width:100%; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2.2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; padding-right:36px; transition:border-color 0.18s; }
        .pf-select:focus { border-color:#2979FF; box-shadow:0 0 0 3px rgba(41,121,255,0.1); }
      `}</style>

            <div className="pf-wrap">
                {/* Dark header */}
                <div style={{ padding: '44px 32px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    <div style={{ position: 'relative', marginBottom: 18 }}>
                        <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(0,188,212,0.2),rgba(41,121,255,0.2))', border: '2px solid rgba(0,188,212,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="material-icons" style={{ fontSize: 44, color: '#00BCD4' }}>person_outline</span>
                        </div>
                        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#2979FF,#0097A7)', border: '2px solid #0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="material-icons" style={{ fontSize: 14, color: '#fff' }}>edit</span>
                        </div>
                    </div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>Complete Your Profile</h1>
                    <p style={{ color: 'rgba(255,255,255,0.48)', fontSize: 13, textAlign: 'center', margin: 0 }}>This info is auto-filled when booking appointments</p>

                    {/* Step bar */}
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 24 }}>
                        {['Verified ✓', 'Profile', 'Explore'].map((s, i) => (
                            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: i < 2 ? 'linear-gradient(135deg,#2979FF,#0097A7)' : 'rgba(255,255,255,0.1)', border: i < 2 ? 'none' : '1.5px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {i === 0
                                            ? <span className="material-icons" style={{ fontSize: 15, color: '#fff' }}>check</span>
                                            : <span style={{ fontSize: 12, fontWeight: 800, color: i === 1 ? '#fff' : 'rgba(255,255,255,0.35)' }}>{i + 1}</span>}
                                    </div>
                                    <span style={{ fontSize: 10, fontWeight: i === 1 ? 700 : 400, whiteSpace: 'nowrap', color: i < 2 ? '#fff' : 'rgba(255,255,255,0.3)' }}>{s}</span>
                                </div>
                                {i < 2 && <div style={{ width: 40, height: 2, background: i === 0 ? '#2979FF' : 'rgba(255,255,255,0.15)', margin: '0 6px', marginBottom: 18 }} />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* White form card */}
                <div style={{ flex: 1, background: '#fff', borderRadius: '28px 28px 0 0', padding: '32px 32px 80px', animation: 'slideUp 0.5s 0.1s ease both' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 26 }}>
                        <div style={{ width: 4, height: 24, borderRadius: 2, background: 'linear-gradient(180deg,#2979FF,#00BCD4)' }} />
                        <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0A1628', margin: 0 }}>Personal Information</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Full Name */}
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 7, letterSpacing: 0.4, textTransform: 'uppercase' }}>Full Name</label>
                            <div className="pf-field-wrap">
                                <div className="pf-icon"><span className="material-icons" style={{ fontSize: 18, color: '#2979FF' }}>person</span></div>
                                <input type="text" placeholder="Enter your full name" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            {errors.name && <ErrMsg msg={errors.name} />}
                        </div>

                        {/* Email */}
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 7, letterSpacing: 0.4, textTransform: 'uppercase' }}>Email Address</label>
                            <div className="pf-field-wrap">
                                <div className="pf-icon"><span className="material-icons" style={{ fontSize: 18, color: '#2979FF' }}>email</span></div>
                                <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            {errors.email && <ErrMsg msg={errors.email} />}
                        </div>

                        {/* Age + Gender */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                                <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 7, letterSpacing: 0.4, textTransform: 'uppercase' }}>Age</label>
                                <div className="pf-field-wrap">
                                    <div className="pf-icon"><span className="material-icons" style={{ fontSize: 18, color: '#2979FF' }}>cake</span></div>
                                    <input type="tel" placeholder="e.g. 25" value={age} onChange={e => setAge(e.target.value.replace(/\D/g, '').slice(0, 3))} />
                                </div>
                                {errors.age && <ErrMsg msg={errors.age} />}
                            </div>
                            <div>
                                <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 7, letterSpacing: 0.4, textTransform: 'uppercase' }}>Gender</label>
                                <select className="pf-select" value={gender} onChange={e => setGender(e.target.value)}>
                                    {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Verified mobile */}
                        <div style={{ background: '#EFF6FF', borderRadius: 13, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span className="material-icons" style={{ fontSize: 19, color: '#2563EB' }}>phone_android</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: 10, color: '#6B7280', margin: '0 0 1px', fontWeight: 700, letterSpacing: 0.5 }}>VERIFIED MOBILE</p>
                                <p style={{ fontSize: 15, color: '#1D4ED8', fontWeight: 700, margin: 0 }}>+91 {userData?.mobile || '—'}</p>
                            </div>
                            <span className="material-icons" style={{ fontSize: 22, color: '#16A34A' }}>verified</span>
                        </div>

                        {/* Error summary */}
                        {Object.keys(errors).length > 0 && (
                            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 13, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span className="material-icons" style={{ fontSize: 18, color: '#DC2626' }}>error_outline</span>
                                <p style={{ fontSize: 13, color: '#DC2626', margin: 0, fontWeight: 600 }}>Please fill in all highlighted fields</p>
                            </div>
                        )}

                        {/* Save button */}
                        <button type="button" onClick={save} disabled={isLoading} style={{ width: '100%', padding: '17px', borderRadius: 14, border: 'none', background: isLoading ? 'linear-gradient(135deg,#93C5FD,#67E8F9)' : 'linear-gradient(135deg,#2979FF,#0097A7)', cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#fff', fontSize: 16, fontWeight: 800, boxShadow: '0 6px 24px rgba(41,121,255,0.35)', marginTop: 8, fontFamily: 'inherit', transition: 'all 0.2s' }}>
                            {isLoading
                                ? <><div style={{ width: 22, height: 22, borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} /><span>Saving...</span></>
                                : <><span className="material-icons" style={{ fontSize: 22 }}>check_circle</span>Save &amp; Continue</>
                            }
                        </button>

                        {/* Skip
                        <button type="button" onClick={() => nav('/categories', { replace:true })} style={{ width:'100%', padding:'15px', borderRadius:14, background:'transparent', border:'2px solid #E5E9F5', cursor:'pointer', color:'#9CA3AF', fontSize:14, fontWeight:600, fontFamily:'inherit' }}>
                            Skip for now
                        </button> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

function ErrMsg({ msg }) {
    return (
        <p style={{ fontSize: 12, color: '#DC2626', margin: '5px 0 0', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
            <span className="material-icons" style={{ fontSize: 13 }}>error_outline</span>
            {msg}
        </p>
    )
}