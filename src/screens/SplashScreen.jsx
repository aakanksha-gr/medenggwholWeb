import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalStore } from '../store/globalStore'
import { loadUserProfile } from '../services/localStorageService'

export default function SplashScreen() {
  const nav = useNavigate()
  const { setCategories, setAdmin, setInputScreens, setSolutions, setUserData } = useGlobalStore()

  useEffect(() => {
    async function init() {
      try {
        const catRes = await fetch('/json/health_categories.json')
        const catData = await catRes.json()
        setCategories(catData.categories || [])
        if (catData.admin) setAdmin(catData.admin)
        const solRes = await fetch('/json/patient_input_solution_screens.json')
        const solData = await solRes.json()
        setInputScreens(solData.screens || [])
        setSolutions(solData.solutions || [])
      } catch (e) { console.error('JSON load error:', e) }
      await new Promise(r => setTimeout(r, 2600))
      const { isLoggedIn, userData } = loadUserProfile()
      if (isLoggedIn && userData) { setUserData(userData); nav('/categories', { replace: true }) }
      else nav('/login', { replace: true })
    }
    init()
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0A1628 0%, #0D2137 40%, #0A3D4A 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
    }}>
      {/* Ambient blobs */}
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%', top: -100, right: -100,
        background: 'radial-gradient(circle, rgba(0,188,212,0.15) 0%, transparent 70%)', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', width: 300, height: 300, borderRadius: '50%', bottom: -50, left: -80,
        background: 'radial-gradient(circle, rgba(41,121,255,0.18) 0%, transparent 70%)', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', width: 200, height: 200, borderRadius: '50%', top: '40%', left: '10%',
        background: 'radial-gradient(circle, rgba(0,230,118,0.08) 0%, transparent 70%)', pointerEvents: 'none'
      }} />

      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      <style>{`
        @keyframes pulseRing {
          0%   { transform: scale(1);   opacity: 0.6; }
          50%  { transform: scale(1.18); opacity: 0.2; }
          100% { transform: scale(1);   opacity: 0.6; }
        }
        @keyframes floatUp {
          0%   { opacity:0; transform: translateY(30px); }
          100% { opacity:1; transform: translateY(0); }
        }
        @keyframes spinLoader {
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0%,100% { opacity:0.6; } 50% { opacity:1; }
        }
        .splash-logo  { animation: floatUp 0.8s ease forwards; }
        .splash-title { animation: floatUp 0.8s 0.3s ease both; }
        .splash-sub   { animation: floatUp 0.8s 0.5s ease both; }
        .splash-load  { animation: floatUp 0.8s 0.8s ease both; }
        .pulse-ring   { animation: pulseRing 2s ease-in-out infinite; }
        .spin         { animation: spinLoader 1s linear infinite; }
      `}</style>

      {/* Logo area */}
      <div className="splash-logo" style={{ position: 'relative', marginBottom: 40 }}>
        {/* pulse rings */}
        <div className="pulse-ring" style={{
          position: 'absolute', inset: -20, borderRadius: '50%',
          border: '2px solid rgba(0,188,212,0.3)',
        }} />
        <div className="pulse-ring" style={{
          position: 'absolute', inset: -40, borderRadius: '50%',
          border: '1px solid rgba(0,188,212,0.15)',
          animationDelay: '0.4s',
        }} />
        <div style={{
          width: 110, height: 110, borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(0,188,212,0.25), rgba(41,121,255,0.25))',
          border: '1.5px solid rgba(0,188,212,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(12px)',
        }}>
          <span className="material-icons" style={{ fontSize: 56, color: '#00BCD4' }}>health_and_safety</span>
        </div>
      </div>

      {/* Title */}
      <div className="splash-title" style={{ textAlign: 'center', marginBottom: 12 }}>
        <h1 style={{
          fontSize: 36, fontWeight: 800, margin: 0,
          background: 'linear-gradient(90deg, #00BCD4, #2979FF, #00E676)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: -0.5,
        }}>HealMedEngg</h1>
      </div>

      <p className="splash-sub" style={{
        color: 'rgba(255,255,255,0.5)', fontSize: 15,
        margin: '0 0 60px', letterSpacing: 1, textTransform: 'uppercase',
      }}>
        Your Health · Our Priority
      </p>

      {/* Loader */}
      <div className="splash-load" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div className="spin" style={{
          width: 32, height: 32, borderRadius: '50%',
          border: '2.5px solid rgba(0,188,212,0.2)',
          borderTopColor: '#00BCD4',
        }} />
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, letterSpacing: 1 }}>Loading...</p>
      </div>
    </div>
  )
}