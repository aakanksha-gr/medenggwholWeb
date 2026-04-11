import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalStore } from '../store/globalStore'

const SCREEN_MAP = {
  '1': [
    {
      title: 'Fever Symptoms',
      question: 'Select the symptoms you are experiencing',
      type: 'multiple',
      options: [
        { id: 'f_symp_1', text: 'Headache' },
        { id: 'f_symp_2', text: 'Muscle pain / Weakness' },
        { id: 'f_symp_3', text: 'Runny Nose' },
        { id: 'f_symp_4', text: 'Sore Throat' },
        { id: 'f_symp_5', text: 'Cough' },
        { id: 'f_symp_6', text: 'Difficulty Breathing' },
        { id: 'f_symp_7', text: 'Nausea' },
        { id: 'f_symp_8', text: 'Abdominal Pain / Vomiting' },
      ],
    },
    {
      title: 'Lifestyle & Exposure',
      question: 'Have you eaten food from outside (restaurant, street food, or takeaway) recently?',
      type: 'yesno',
      yesId: 'f_out_yes', noId: 'f_out_no'
    },
    {
      title: 'Lifestyle & Exposure',
      question: 'Have you consumed cold foods or drinks such as ice cream or cold drinks recently?',
      type: 'yesno',
      yesId: 'f_cold_yes', noId: 'f_cold_no'
    },
    {
      title: 'Lifestyle & Exposure',
      question: 'Have you undergone severe body stress such as an intense workout or heavy physical exertion recently?',
      type: 'yesno',
      yesId: 'f_stress_yes', noId: 'f_stress_no'
    },
    {
      title: 'Lifestyle & Exposure',
      question: 'Have you recently travelled to a new place or climate?',
      type: 'yesno',
      yesId: 'f_travel_yes', noId: 'f_travel_no'
    }
  ],
  '2': [
    {
      title: 'Menstrual Cycle',
      question: 'Are your menstrual periods irregular (cycle longer than 35 days or unpredictable)?',
      type: 'yesno',
      yesId: 'p_irreg_yes', noId: 'p_irreg_no'
    },
    {
      title: 'Mood & Energy',
      question: 'Do you experience mood swings, anxiety, or fatigue around menstrual cycles?',
      type: 'yesno',
      yesId: 'p_mood_yes', noId: 'p_mood_no'
    },
    {
      title: 'Body Hair',
      question: 'Do you have excess facial or body hair (chin, upper lip, chest, abdomen)?',
      type: 'yesno',
      yesId: 'p_hair_yes', noId: 'p_hair_no'
    },
    {
      title: 'Skin & Hair',
      question: 'Have you experienced any of the following?',
      type: 'multiple',
      options: [
        { id: 'p_hl', text: 'Hair loss' },
        { id: 'p_acne', text: 'Acne' }
      ]
    },
    {
      title: 'Weight',
      question: 'Have you gained weight easily, especially around the abdomen?',
      type: 'yesno',
      yesId: 'p_gain_yes', noId: 'p_gain_no'
    },
    {
      title: 'Skin Changes',
      question: 'Do you have dark skin patches on neck, underarms, or groin?',
      type: 'yesno',
      yesId: 'p_dark_yes', noId: 'p_dark_no'
    }
  ],
  '3': [
    {
      title: 'Dietary Habits',
      question: 'Select the meals you have throughout the day',
      type: 'multiple',
      options: [
        { id: 't_m_bf', text: 'Breakfast' },
        { id: 't_m_lu', text: 'Lunch' },
        { id: 't_m_dn', text: 'Dinner' },
        { id: 't_m_sn', text: 'Snacks' }
      ]
    },
    {
      title: 'Dietary Habits',
      question: 'Do you eat fried foods more than 2 days per week?',
      type: 'yesno',
      yesId: 't_fried_yes', noId: 't_fried_no'
    },
    {
      title: 'Dietary Habits',
      question: 'Do you consume sugary foods or sweets more than 2 days per week?',
      type: 'yesno',
      yesId: 't_sugar_yes', noId: 't_sugar_no'
    },
    {
      title: 'Dietary Habits',
      question: 'Do you consume non-vegetarian food (meat, fish, eggs)?',
      type: 'yesno',
      yesId: 't_nv_yes', noId: 't_nv_no'
    },
    {
      title: 'Stress & Mental Health',
      question: 'Have you experienced any major stress or emotional events in the last 1–2 years? (Examples: family conflict, financial problems, loss of a loved one, work stress)',
      type: 'yesno',
      yesId: 't_stress_yes', noId: 't_stress_no'
    },
    {
      title: 'Medical History',
      question: 'Select if you are suffering from any of the below mentioned diseases',
      type: 'multiple',
      options: [
        { id: 't_d_th', text: 'Thyroid' },
        { id: 't_d_bp', text: 'Blood pressure' },
        { id: 't_d_db', text: 'Diabetes' }
      ]
    },
    {
      title: 'Lifestyle',
      question: 'Do you spend long hours sitting (desk work)?',
      type: 'yesno',
      yesId: 't_sit_yes', noId: 't_sit_no'
    }
  ]
}

export default function PatientInputScreen() {
  const nav = useNavigate()
  const { userData, setUserData } = useGlobalStore()

  const screens = SCREEN_MAP[String(userData?.selectedCategoryId)] || SCREEN_MAP['1']

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})

  const screen = screens[step]

  // For modern UI styling
  const progressPercent = ((step + 1) / screens.length) * 100

  function toggleMultiple(id) {
    setAnswers(prev => {
      const current = new Set(prev[step] || [])
      if (current.has(id)) current.delete(id)
      else current.add(id)
      return { ...prev, [step]: Array.from(current) }
    })
  }

  function selectSingle(id) {
    setAnswers(prev => ({ ...prev, [step]: [id] }))
  }

  function next() {
    // Basic validation: user must select at least one answer to proceed
    if (!answers[step] || answers[step].length === 0) return

    if (step === screens.length - 1) {
      const allIds = Object.values(answers).flat()
      setUserData({
        ...userData,
        allSelectedIds: allIds
      })
      nav('/solution')
    } else {
      setStep(step + 1)
    }
  }

  function handleBack() {
    if (step === 0) {
      nav('/categories')
    } else {
      setStep(step - 1)
    }
  }

  return (
    <div style={{
      height: '100dvh', // Fixed viewport height
      overflowY: 'auto',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #F0F4FF, #E6FAFA)',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      alignItems: 'center'
    }}>
      <style>{`
        .pis-hdr-inner, .pis-inner { width: 100%; max-width: 800px; margin: 0 auto; }
        .pis-hdr { padding: 20px 24px; }
        .pis-inner { flex: 1; padding: 32px 24px; display: flex; flex-direction: column; }
        .pis-q { font-size: 24px; font-weight: 800; color: #0F172A; line-height: 1.3; margin: 0; }
        .pis-opt-wrap { display: flex; flex-direction: column; gap: 14px; flex: 1; }
        
        @media(min-width: 768px) {
          .pis-hdr { padding: 24px 40px; }
          .pis-inner { padding: 48px 40px; }
          .pis-q { font-size: 34px; }
          .pis-opt-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-content: start; }
        }
      `}</style>
      
      {/* HEADER WITH PROGRESS */}
      <div style={{
        width: '100%',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div className="pis-hdr-inner pis-hdr">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button onClick={handleBack} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748B' }}>
            <span className="material-icons" style={{ fontSize: 22 }}>arrow_back_ios_new</span>
          </button>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: 1 }}>
            {userData?.selectedCategoryName || 'Questionnaire'}
          </span>
          <div style={{ width: 22 }} /> {/* Placeholder for balance */}
        </div>
        
        {/* Progress bar */}
        <div style={{ width: '100%', height: 6, background: '#E2E8F0', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #3B82F6, #06B6D4)', transition: 'width 0.4s ease', borderRadius: 10 }} />
        </div>
        <p style={{ margin: '8px 0 0', fontSize: 12, color: '#94A3B8', textAlign: 'right', fontWeight: 600 }}>
          Step {step + 1} of {screens.length}
        </p>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="pis-inner">
        
        <div style={{ marginBottom: 40 }}>
          <h3 style={{ fontSize: 14, color: '#06B6D4', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            {screen.title}
          </h3>
          <h1 className="pis-q">
            {screen.question}
          </h1>
          {screen.type === 'multiple' && (
            <p style={{ marginTop: 12, fontSize: 14, color: '#64748B', fontWeight: 600 }}>
              (Select all that apply)
            </p>
          )}
        </div>

        {/* OPTIONS GENERATOR */}
        <div className="pis-opt-wrap">
          {screen.type === 'yesno' ? (
            <>
              <InputOption 
                selected={answers[step]?.includes(screen.yesId)}
                text="Yes"
                onClick={() => selectSingle(screen.yesId)}
              />
              <InputOption 
                selected={answers[step]?.includes(screen.noId)}
                text="No"
                onClick={() => selectSingle(screen.noId)}
              />
            </>
          ) : (
            screen.options.map(opt => (
              <InputOption 
                key={opt.id}
                selected={answers[step]?.includes(opt.id)}
                text={opt.text}
                multiple={true}
                onClick={() => toggleMultiple(opt.id)}
              />
            ))
          )}
        </div>

        {/* BOTTOM ACTION */}
        <div style={{ paddingTop: 30, marginTop: 'auto', gridColumn: '1 / -1' }}>
          <button
            onClick={next}
            disabled={!answers[step] || answers[step].length === 0}
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: 20,
              background: (!answers[step] || answers[step].length === 0) 
                ? '#E2E8F0' 
                : 'linear-gradient(135deg, #3B82F6, #06B6D4)',
              color: (!answers[step] || answers[step].length === 0) ? '#94A3B8' : '#fff',
              fontSize: 16,
              fontWeight: 800,
              border: 'none',
              cursor: (!answers[step] || answers[step].length === 0) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: (!answers[step] || answers[step].length === 0) ? 'none' : '0 8px 24px rgba(59, 130, 246, 0.25)',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ paddingLeft: 12 }}>{step === screens.length - 1 ? 'Analyze Results' : 'Continue'}</span>
            <span className="material-icons" style={{ paddingRight: 8 }}>{step === screens.length - 1 ? 'analytics' : 'arrow_forward'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function InputOption({ selected, text, onClick, multiple }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '18px 20px',
        borderRadius: 16,
        background: selected ? 'rgba(59, 130, 246, 0.08)' : '#fff',
        border: selected ? '2px solid #3B82F6' : '2px solid transparent',
        boxShadow: selected ? 'none' : '0 4px 16px rgba(0,0,0,0.04)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textAlign: 'left'
      }}
    >
      <div style={{
        width: 24,
        height: 24,
        borderRadius: multiple ? 6 : '50%',
        border: selected ? 'none' : '2px solid #CBD5E1',
        background: selected ? '#3B82F6' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        flexShrink: 0,
        transition: 'all 0.2s'
      }}>
        {selected && <span className="material-icons" style={{ fontSize: 16, color: '#fff' }}>done</span>}
      </div>
      <span style={{ 
        fontSize: 15, 
        fontWeight: selected ? 700 : 600, 
        color: selected ? '#1E3A8A' : '#475569',
        lineHeight: 1.4
      }}>
        {text}
      </span>
    </button>
  )
}