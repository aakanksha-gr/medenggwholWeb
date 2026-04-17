import { useNavigate } from 'react-router-dom'

export default function AppBar({ title, showBack = true, onBack, rightContent }) {
    const nav = useNavigate()
    function handleBack() { if (onBack) onBack(); else nav('/categories') }

    return (
        <>
            <style>{`
        .ab-wrap {
          width: 100%;
          background: linear-gradient(135deg, #0A1628 0%, #1565C0 60%, #0097A7 100%);
          position: sticky; top: 0; z-index: 200;
          box-shadow: 0 2px 20px rgba(10,22,40,0.3);
        }
        .ab-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center;
          padding: 0 20px; height: 62px;
          box-sizing: border-box; gap: 14px;
        }
        @media(min-width: 640px) { .ab-inner { padding: 0 32px; } }
        @media(min-width: 1024px) { .ab-inner { padding: 0 48px; } }

        .ab-back {
          width: 38px; height: 38px; border-radius: 11px;
          background: rgba(255,255,255,0.13);
          border: 1.5px solid rgba(255,255,255,0.22);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0;
          transition: background 0.15s, transform 0.12s;
          padding: 0; outline: none;
        }
        .ab-back:hover { background: rgba(255,255,255,0.22); }
        .ab-back:active { transform: scale(0.91); }

        .ab-title {
          flex: 1; font-size: 17px; font-weight: 800;
          color: #fff; white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis;
          letter-spacing: -0.2px;
          font-family: 'Plus Jakarta Sans', 'Segoe UI', sans-serif;
        }
      `}</style>
            <div className="ab-wrap">
                <div className="ab-inner">
                    {showBack ? (
                        <button className="ab-back" onClick={handleBack} aria-label="Go back">
                            <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
                                 stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>
                    ) : <div style={{ width: 38, flexShrink: 0 }} />}
                    <span className="ab-title">{title}</span>
                    {rightContent
                        ? <div style={{ flexShrink: 0 }}>{rightContent}</div>
                        : <div style={{ width: 38, flexShrink: 0 }} />}
                </div>
            </div>
        </>
    )
}