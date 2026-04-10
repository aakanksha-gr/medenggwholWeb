import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalStore } from '../store/globalStore'
import { saveUserProfile, isProfileComplete, loadUserProfile } from '../services/localStorageService'

async function sendWhatsAppOtp(phone, otp) {
  const res = await fetch('https://medenggwhol-backend.onrender.com/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: `91${phone}`, otp }),
  })
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch { throw new Error('Bad response from server') }
  if (!data.success) throw new Error(data.error || 'WhatsApp failed')
  return data
}

export default function LoginScreen() {
  const nav = useNavigate()
  const { setUserData } = useGlobalStore()

  const [mobile,      setMobile]      = useState('')
  const [errorMsg,    setErrorMsg]    = useState('')
  const [isLoading,   setIsLoading]   = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [otpSent,     setOtpSent]     = useState(false)
  const [otpBoxes,    setOtpBoxes]    = useState(['','','','','',''])
  const [resendTimer, setResendTimer] = useState(0)

  const correctOtp = useRef('')
  const otpRefs    = useRef([])
  const timerRef   = useRef(null)

  function validate() {
    if (!/^[6-9]\d{9}$/.test(mobile.trim())) {
      setErrorMsg('Enter a valid 10-digit Indian mobile number')
      return false
    }
    setErrorMsg('')
    return true
  }

  async function onVerified() {
    if (isProfileComplete()) {
      const { userData: saved } = loadUserProfile()
      if (saved) setUserData(saved)
      nav('/categories', { replace: true })
    } else {
      const p = { mobile: mobile.trim(), isLoggedIn: true, isProfileComplete: false }
      setUserData(p)
      saveUserProfile(p)
      nav('/profile', { replace: true })
    }
  }

  async function sendOtp() {
    if (!validate()) return
    setIsLoading(true)
    setErrorMsg('')
    const otp = String(Math.floor(100000 + Math.random() * 900000))
    correctOtp.current = otp
    try {
      await sendWhatsAppOtp(mobile.trim(), otp)
      setOtpSent(true)
      setOtpBoxes(['','','','','',''])
      setIsLoading(false)
      startTimer()
      setTimeout(() => otpRefs.current[0]?.focus(), 400)
    } catch (err) {
      setIsLoading(false)
      setErrorMsg('Failed: ' + err.message)
    }
  }

  function handleBoxChange(i, val) {
    if (!/^\d*$/.test(val)) return
    const next = [...otpBoxes]
    next[i] = val.slice(-1)
    setOtpBoxes(next)
    if (val && i < 5) otpRefs.current[i + 1]?.focus()
    if (next.every(d => d !== '') && next.join('').length === 6) verifyOtp(next.join(''))
  }

  function handleBoxKey(i, e) {
    if (e.key === 'Backspace' && !otpBoxes[i] && i > 0) otpRefs.current[i - 1]?.focus()
  }

  async function verifyOtp(code = otpBoxes.join('')) {
    if (code.length !== 6) { setErrorMsg('Enter the complete 6-digit OTP'); return }
    setIsVerifying(true)
    setErrorMsg('')
    await new Promise(r => setTimeout(r, 600))
    if (code === correctOtp.current) {
      clearInterval(timerRef.current)
      correctOtp.current = ''
      setIsVerifying(false)
      await onVerified()
    } else {
      setIsVerifying(false)
      setErrorMsg('Wrong OTP. Please try again.')
      setOtpBoxes(['','','','','',''])
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    }
  }

  function startTimer() {
    setResendTimer(30)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setResendTimer(t => { if (t <= 1) { clearInterval(timerRef.current); return 0 } return t - 1 })
    }, 1000)
  }

  async function handleResend() {
    setOtpBoxes(['','','','','',''])
    setErrorMsg('')
    setOtpSent(false)
    clearInterval(timerRef.current)
    setResendTimer(0)
    correctOtp.current = ''
    await sendOtp()
  }

  function handleBack() {
    setOtpSent(false)
    setOtpBoxes(['','','','','',''])
    setErrorMsg('')
    clearInterval(timerRef.current)
    setResendTimer(0)
    correctOtp.current = ''
  }

  return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg,#0A1628 0%,#0D2137 50%,#0A3D4A 100%)',
        fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif",
        display: 'flex', alignItems: 'stretch',
      }}>
        <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes msgIn   { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        input::placeholder { color: #9CA3AF; }

        /* ── Desktop layout ── */
        .login-root {
          width: 100%; display: flex;
          min-height: 100vh;
        }
        /* Left decorative panel — hidden on mobile */
        .login-deco {
          display: none;
        }
        @media(min-width: 900px) {
          .login-deco {
            display: flex; flex: 1;
            align-items: center; justify-content: center;
            flex-direction: column; gap: 24px;
            padding: 48px;
            position: relative; overflow: hidden;
          }
          .login-form-panel {
            width: 480px; flex-shrink: 0;
            display: flex; flex-direction: column;
            background: #fff;
            overflow-y: auto;
          }
        }
        .login-form-panel {
          flex: 1;
          display: flex; flex-direction: column;
          background: #fff;
          overflow-y: auto;
        }

        .otp-box {
          width: 46px; height: 54px; border-radius: 12px;
          text-align: center; font-size: 22px; font-weight: 800;
          border: 2px solid #E5E9F5;
          background: #F8FAFF; color: #0A1628;
          outline: none; transition: border-color 0.15s, background 0.15s;
          font-family: inherit;
        }
        .otp-box.filled { border-color: #2979FF; background: #EEF3FF; }
        .otp-box:focus  { border-color: #2979FF; background: #EEF3FF; }
      `}</style>

        <div className="login-root">
          {/* ── LEFT DECORATIVE PANEL (desktop only) ── */}
          <div className="login-deco">
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'radial-gradient(circle,rgba(255,255,255,0.03) 1px,transparent 1px)',
              backgroundSize: '28px 28px', pointerEvents: 'none',
            }} />
            <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', top: -80, right: -80, background: 'radial-gradient(circle,rgba(0,188,212,0.15) 0%,transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', width: 250, height: 250, borderRadius: '50%', bottom: '20%', left: -60, background: 'radial-gradient(circle,rgba(41,121,255,0.15) 0%,transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(0,188,212,0.25),rgba(41,121,255,0.25))', border: '2px solid rgba(0,188,212,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
                <span className="material-icons" style={{ fontSize: 48, color: '#00BCD4' }}>health_and_safety</span>
              </div>
              <h1 style={{ fontSize: 42, fontWeight: 900, margin: '0 0 10px', background: 'linear-gradient(90deg,#00BCD4,#2979FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: -1 }}>
                HealMedEngg
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, letterSpacing: 1, marginBottom: 48 }}>YOUR HEALTH · OUR PRIORITY</p>

              {[
                { icon: 'verified_user', text: 'Verified Medical Professionals' },
                { icon: 'flash_on', text: 'Instant WhatsApp Consultations' },
                { icon: 'lock', text: 'Your data is private & secure' },
              ].map(f => (
                  <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '14px 20px', marginBottom: 12, textAlign: 'left' }}>
                    <span className="material-icons" style={{ fontSize: 20, color: '#00BCD4' }}>{f.icon}</span>
                    <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, fontWeight: 600 }}>{f.text}</span>
                  </div>
              ))}
            </div>
          </div>

          {/* ── FORM PANEL ── */}
          <div className="login-form-panel">
            {/* Mobile header (hidden on desktop) */}
            <div style={{ padding: '40px 24px 28px', background: 'linear-gradient(160deg,#0A1628,#0D2137,#0A3D4A)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(0,188,212,0.2),rgba(41,121,255,0.2))', border: '1.5px solid rgba(0,188,212,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <span className="material-icons" style={{ fontSize: 34, color: '#00BCD4' }}>health_and_safety</span>
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 4px', background: 'linear-gradient(90deg,#00BCD4,#2979FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>HealMedEngg</h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, letterSpacing: 0.8, margin: 0 }}>YOUR HEALTH · OUR PRIORITY</p>
            </div>

            {/* White form area */}
            <div style={{ flex: 1, padding: '32px 28px 60px', overflowY: 'auto', animation: 'slideUp 0.45s 0.1s ease both' }}>
              {!otpSent ? (
                  <>
                    <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0A1628', margin: '0 0 4px' }}>Welcome back 👋</h2>
                    <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 32px' }}>Sign in with your mobile number</p>

                    <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 8, display: 'block', letterSpacing: 0.4, textTransform: 'uppercase' }}>Mobile Number</label>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#F8FAFF', border: '2px solid #E5E9F5', borderRadius: 14, overflow: 'hidden', marginBottom: 6, transition: 'border-color 0.2s' }}>
                      <div style={{ padding: '14px 14px 14px 16px', display: 'flex', alignItems: 'center', gap: 6, borderRight: '2px solid #E5E9F5', background: '#F0F4FF', flexShrink: 0 }}>
                        <span className="material-icons" style={{ fontSize: 16, color: '#2979FF' }}>phone_android</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#2979FF' }}>+91</span>
                      </div>
                      <input type="tel" inputMode="numeric" maxLength={10} value={mobile}
                             onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                             onKeyDown={e => e.key === 'Enter' && sendOtp()}
                             placeholder="10-digit mobile number"
                             style={{ flex: 1, padding: '14px 16px', fontSize: 15, background: 'transparent', border: 'none', outline: 'none', color: '#0A1628', fontWeight: 600, fontFamily: 'inherit' }}
                      />
                    </div>
                    <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 24 }}>OTP will be sent to your WhatsApp</p>

                    {errorMsg && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '11px 14px', marginBottom: 16, animation: 'msgIn 0.25s ease' }}>
                          <span className="material-icons" style={{ fontSize: 16, color: '#DC2626', flexShrink: 0 }}>error_outline</span>
                          <p style={{ fontSize: 13, color: '#DC2626', margin: 0, fontWeight: 600 }}>{errorMsg}</p>
                        </div>
                    )}

                    <button onClick={sendOtp} disabled={isLoading} style={{ width: '100%', padding: '15px 20px', borderRadius: 14, border: 'none', background: isLoading ? 'linear-gradient(135deg,#93C5FD,#67E8F9)' : 'linear-gradient(135deg,#2979FF,#0097A7)', cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#fff', fontSize: 15, fontWeight: 700, boxShadow: '0 4px 20px rgba(41,121,255,0.35)', marginBottom: 12, fontFamily: 'inherit' }}>
                      {isLoading
                          ? <><div style={{ width: 20, height: 20, borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} /><span>Sending to WhatsApp...</span></>
                          : <><span className="material-icons" style={{ fontSize: 18 }}>send</span>Send OTP via WhatsApp</>
                      }
                    </button>

                    {/* <button onClick={() => nav('/categories', { replace: true })} style={{ width: '100%', padding: '13px', borderRadius: 14, background: 'transparent', border: '2px solid #E5E9F5', cursor: 'pointer', color: '#6B7280', fontSize: 14, fontWeight: 600, marginBottom: 28, fontFamily: 'inherit' }}>
                      Skip for now
                    </button> */}

                    <div style={{ background: '#EFF6FF', borderRadius: 12, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span className="material-icons" style={{ fontSize: 16, color: '#2563EB' }}>lock</span>
                      <p style={{ fontSize: 12, color: '#1D4ED8', margin: 0 }}>OTP via <strong>WhatsApp</strong> · Your number is never shared</p>
                    </div>
                  </>
              ) : (
                  <>
                    <button onClick={handleBack} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F0F4FF', border: 'none', borderRadius: 12, padding: '9px 14px', cursor: 'pointer', color: '#2979FF', fontSize: 13, fontWeight: 700, marginBottom: 24, fontFamily: 'inherit' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2979FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                      Back
                    </button>

                    <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0A1628', margin: '0 0 4px' }}>Enter OTP</h2>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 24px' }}>Sent to WhatsApp +91 {mobile}</p>

                    <div style={{ background: '#F0FDF4', border: '1.5px solid #86EFAC', borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center', marginBottom: 28 }}>
                      <span className="material-icons" style={{ fontSize: 22, color: '#16A34A', flexShrink: 0 }}>chat</span>
                      <div>
                        <p style={{ fontSize: 13, color: '#166534', margin: 0, fontWeight: 700 }}>OTP sent to your WhatsApp ✅</p>
                        <p style={{ fontSize: 12, color: '#16A34A', margin: '3px 0 0' }}>Check WhatsApp on +91 {mobile}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
                      {otpBoxes.map((d, i) => (
                          <input key={i} ref={el => otpRefs.current[i] = el}
                                 type="tel" inputMode="numeric" maxLength={1} value={d}
                                 className={`otp-box${d ? ' filled' : ''}`}
                                 onChange={e => handleBoxChange(i, e.target.value)}
                                 onKeyDown={e => handleBoxKey(i, e)}
                          />
                      ))}
                    </div>

                    {errorMsg && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '11px 14px', marginBottom: 16, animation: 'msgIn 0.25s ease' }}>
                          <span className="material-icons" style={{ fontSize: 16, color: '#DC2626', flexShrink: 0 }}>error_outline</span>
                          <p style={{ fontSize: 13, color: '#DC2626', margin: 0, fontWeight: 600 }}>{errorMsg}</p>
                        </div>
                    )}

                    <button onClick={() => verifyOtp()} disabled={isVerifying} style={{ width: '100%', padding: '15px 20px', borderRadius: 14, border: 'none', background: isVerifying ? 'linear-gradient(135deg,#93C5FD,#67E8F9)' : 'linear-gradient(135deg,#2979FF,#0097A7)', cursor: isVerifying ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#fff', fontSize: 15, fontWeight: 700, boxShadow: '0 4px 20px rgba(41,121,255,0.35)', marginBottom: 16, fontFamily: 'inherit' }}>
                      {isVerifying
                          ? <><div style={{ width: 20, height: 20, borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} /><span>Verifying...</span></>
                          : <><span className="material-icons" style={{ fontSize: 18 }}>check_circle_outline</span>Verify &amp; Continue</>
                      }
                    </button>

                    <div style={{ textAlign: 'center' }}>
                      {resendTimer > 0
                          ? <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>Resend in <strong style={{ color: '#374151' }}>{resendTimer}s</strong></p>
                          : <button onClick={handleResend} style={{ fontSize: 13, fontWeight: 700, color: '#2979FF', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>Resend OTP</button>
                      }
                    </div>
                  </>
              )}
            </div>
          </div>
        </div>
      </div>
  )
}