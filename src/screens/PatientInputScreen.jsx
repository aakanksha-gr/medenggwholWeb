import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalStore } from '../store/globalStore'
import { motion, AnimatePresence } from 'framer-motion'

const SCREEN_MAP = {
  '1': [
    {
      title: 'Fever Symptoms',
      question: 'Level of Fever',
      type: 'multiple',
      options: [
        { id: 'f_symp_1', text: 'Mild', img: "/images/fever_mild.png" },
        { id: 'f_symp_2', text: 'Moderate', img: "/images/fever_moderate.png" },
        { id: 'f_symp_3', text: 'Severe', img: "/images/fever_severe.png" },
      ],
    },
    {
      title: 'Select Symptoms',
      question: 'Select the Physical Symptoms',
      baseImg: "/images/healthy_woman_fullbody.png",
      type: 'bodymap',
      options: [
        { id: 'f_body_head', text: 'Headache', px: 48, py: 5, ly: 27 },
        { id: 'f_body_weak', text: 'Weakness', px: 48, py: 22, ly: 45 },
        { id: 'f_body_muscle', text: 'Muscle pain', px: 52, py: 56, ly: 75 },
      ],
    },
    {
      title: 'Select Symptoms',
      question: 'Select the Internal Symptoms',
      type: 'bodymap',
      baseImg: '/images/lungs.png',
      options: [
        { id: 'f_body_nose', text: 'Runny Nose', px: 50, py: 13, ly: 15 },
        { id: 'f_body_throat', text: 'Sore Throat', px: 50, py: 21, ly: 35 },
        { id: 'f_body_cough', text: 'Cough', px: 44, py: 28, ly: 55 },
        { id: 'f_body_breath', text: 'Difficulty Breathing', px: 52, py: 45, ly: 75 },
      ],
    },
    {
      title: 'Select Symptoms',
      question: 'Select the Digestive Symptoms',
      type: 'bodymap',
      baseImg: '/images/nausea_vomiting_woman.png',
      options: [
        { id: 'f_body_nausea', text: 'Nausea', px: 35, py: 30, ly: 30 },
        { id: 'f_body_vomiting', text: 'Vomiting', px: 28, py: 36, ly: 50 },
        { id: 'f_body_abdominal_pain', text: 'Abdominal Pain', px: 60, py: 72, ly: 72 },
      ],
    },
    {
      title: 'Dietary Habits',
      question: 'Have you eaten food from outside (restaurant, street food, or takeaway) recently?',
      image: "/images/junkfood_street_food_girl.png",
      type: 'yesno',
      yesId: 'f_food_yes', noId: 'f_food_no'
    },
    {
      title: 'Dietary Habits',
      question: 'Have you consumed cold foods or drinks such as ice cream or cold drinks recently?',
      image: "/images/icecream_happy_girl.png",
      type: 'yesno',
      yesId: 'f_icecream_yes', noId: 'f_icecream_no'
    },
    {
      title: 'Lifestyle and Exposure',
      question: 'Have you undergone severe body stress such as an intense workout or heavy physical exertion recently?',
      image: "/images/exercise_gym_running.png",
      type: 'yesno',
      yesId: 'f_exercise_yes', noId: 'f_exercise_no'
    },
    {
      title: 'Lifestyle and Exposure',
      question: 'Have you recently travelled to a new place or climate?',
      image: "/images/cold_girl_shivering.png",
      type: 'yesno',
      yesId: 'f_travel_yes', noId: 'f_travel_no'
    }
  ],
  '2': [
    {
      title: 'Menstrual Cycle',
      question: 'Are your menstrual periods irregular (cycle longer than 35 days or unpredictable)?',
      image: "/images/pcod_period_calendar_pain.png",
      type: 'yesno',
      yesId: 'p_irreg_yes', noId: 'p_irreg_no'
    },
    {
      title: 'Mood & Energy',
      question: 'Do you experience mood swings, anxiety, or fatigue around menstrual cycles?',
      image: "/images/pcod_mood_swing_fatigue.png",
      type: 'yesno',
      yesId: 'p_mood_yes', noId: 'p_mood_no'
    },
    {
      title: 'Body Hair',
      question: 'Do you have excess facial or body hair (chin, upper lip, chest, abdomen)?',
      image: "/images/pcod_clear_skin_after.png",
      type: 'yesno',
      yesId: 'p_hair_yes', noId: 'p_hair_no'
    },
    {
      title: 'Skin & Hair',
      question: 'Have you experienced any of the following?',
      type: 'bodymap',
      baseImg: "/images/pcod_acne_face_closeup.png",
      options: [
        { id: 'p_hl', text: 'Hair loss', px: 35, py: 8, ly: 37 },
        { id: 'p_acne', text: 'Acne', px: 55, py: 30, ly: 60 }
      ]
    },
    {
      title: 'Weight',
      question: 'Have you gained weight easily, especially around the abdomen?',
      image: "/images/obesity_overweight_woman.png",
      type: 'yesno',
      yesId: 'p_gain_yes', noId: 'p_gain_no'
    },
    {
      title: 'Skin Changes',
      question: 'Do you have dark skin patches on neck, underarms, or groin?',
      image: "/images/pcod_armpit_hair_symptom.png",
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
        { id: 't_m_bf', text: 'Breakfast', img: "/images/diet_breakfast.png" },
        { id: 't_m_lu', text: 'Lunch', img: "/images/diet_lunch.png" },
        { id: 't_m_sn', text: 'Snacks', img: "/images/diet_snack.png" },
        { id: 't_m_dn', text: 'Dinner', img: "/images/diet_dinner.png" }
      ]
    },
    {
      title: 'Dietary Habits',
      question: 'Do you eat fried foods more than 2 days per week?',
      image: "/images/junkfood_samosa_man.png",
      type: 'yesno',
      yesId: 't_fried_yes', noId: 't_fried_no'
    },
    {
      title: 'Dietary Habits',
      question: 'Do you consume sugary foods or sweets more than 2 days per week?',
      image: "/images/junkfood_sweets_donuts.png",
      type: 'yesno',
      yesId: 't_sugar_yes', noId: 't_sugar_no'
    },
    {
      title: 'Dietary Habits',
      question: 'Do you consume non-vegetarian food (meat, fish, eggs)?',
      image: "/images/junkfood_fried_chicken.png",
      type: 'yesno',
      yesId: 't_nv_yes', noId: 't_nv_no'
    },
    {
      title: 'Stress & Mental Health',
      question: 'Have you experienced any major stress or emotional events in the last 1–2 years? \n (Examples: family conflict, financial problems, loss of a loved one, work stress)',
      image: "/images/stand_stress.png",
      type: 'yesno',
      yesId: 't_stress_yes', noId: 't_stress_no'
    },
    {
      title: 'Medical History',
      question: 'Select if you are suffering from any of the below mentioned diseases',
      baseImg: "/images/thyroid_inner_part.png",
      type: 'bodymap',
      options: [
        { id: 't_d_th', text: 'Thyroid', px: 46, py: 17, ly: 28 },
        { id: 't_d_bp', text: 'Blood pressure', px: 46, py: 35, ly: 50 },
        { id: 't_d_db', text: 'Diabetes', px: 49, py: 41, ly: 68 }
      ]
    },
    {
      title: 'Lifestyle',
      question: 'Do you spend long hours sitting (desk work)?',
      image: "/images/stress_man_laptop.png",
      type: 'yesno',
      yesId: 't_sit_yes', noId: 't_sit_no'
    }
  ],
  '4': [
    {
      title: 'Academic Environment',
      question: 'Do you feel that teachers do not interact properly, do not explain concepts clearly, or create fear about studies/exams?',
      image: "/images/stress_teacher_student.png",
      type: 'yesno',
      yesId: 's_teacher_yes', noId: 's_teacher_no'
    },
    {
      title: 'Social Environment',
      question: 'Do you feel stressed because your friends are performing better than you?',
      image: "/images/peer_pressure.png",
      type: 'yesno',
      yesId: 's_friends_yes', noId: 's_friends_no'
    },
    {
      title: 'Parental Environment',
      question: 'Do you feel parental pressure?',
      image: "/images/parental_pressure.png",
      type: 'yesno',
      yesId: 's_parent_yes', noId: 's_parent_no'
    },
    {
      title: 'Focus & Concentration',
      question: 'Do you find it difficult to concentrate on studies or tasks?',
      image: "/images/focus_issues.png",
      type: 'yesno',
      yesId: 's_focus_yes', noId: 's_focus_no'
    },
    {
      title: 'Mental Health History',
      question: 'Have you had any mental health concerns before?',
      image: "/images/stand_stress.png",
      type: 'yesno',
      yesId: 's_mental_yes', noId: 's_mental_no'
    },
    {
      title: 'Medication',
      question: 'Are you currently taking any medication related to stress, anxiety, or focus?',
      image: "/images/medication.png",
      type: 'yesno',
      yesId: 's_medication_yes', noId: 's_medication_no'
    }
  ],
  '5': [
    {
      title: 'Dietary Habits',
      question: 'Select the meals you have throughout the day',
      type: 'multiple',
      options: [
        { id: 'diab_m_bf', text: 'Breakfast', img: "/images/diet_breakfast.png" },
        { id: 'diab_m_lu', text: 'Lunch', img: "/images/diet_lunch.png" },
        { id: 'diab_m_sn', text: 'Snacks', img: "/images/diet_snack.png" },
        { id: 'diab_m_dn', text: 'Dinner', img: "/images/diet_dinner.png" }
      ]
    },
    {
      title: 'Dietary Habits',
      question: 'Do you eat fried foods more than 2 days per week?',
      image: "/images/junkfood_samosa_man.png",
      type: 'yesno',
      yesId: 'diab_fried_yes', noId: 'diab_fried_no'
    },
    {
      title: 'Dietary Habits',
      question: 'Do you consume sugary foods or sweets more than 2 days per week?',
      image: "/images/junkfood_sweets_donuts.png",
      type: 'yesno',
      yesId: 'diab_sugar_yes', noId: 'diab_sugar_no'
    },
    {
      title: 'Dietary Habits',
      question: 'Do you consume non-vegetarian food (meat, fish, eggs)?',
      image: "/images/junkfood_fried_chicken.png",
      type: 'yesno',
      yesId: 'diab_nv_yes', noId: 'diab_nv_no'
    },
    {
      title: 'Stress & Mental Health',
      question: 'Have you experienced any major stress or emotional events in the last 1–2 years? \n Examples: family conflict, financial problems, loss of a loved one, work stress.',
      image: "/images/stand_stress.png",
      type: 'yesno',
      yesId: 'diab_stress_yes', noId: 'diab_stress_no'
    },
    {
      title: 'Medical History',
      question: 'Select if you are suffering from any of the below mentioned diseases',
      baseImg: "/images/thyroid_inner_part.png",
      type: 'bodymap',
      options: [
        { id: 'diab_d_th', text: 'Thyroid', px: 46, py: 17, ly: 28 },
        { id: 'diab_d_bp', text: 'Blood pressure', px: 46, py: 35, ly: 50 },
      ]
    },
    {
      title: 'Lifestyle',
      question: 'Do you spend long hours sitting (desk work)?',
      image: "/images/stress_man_laptop.png",
      type: 'yesno',
      yesId: 'diab_sit_yes', noId: 'diab_sit_no'
    },
    {
      title: 'Lifestyle',
      question: 'Do you currently smoke or use tobacco products?',
      image: "/images/smoking.png",
      type: 'yesno',
      yesId: 'diab_smoke_yes', noId: 'diab_smoke_no'
    },
    {
      title: 'Lifestyle',
      question: 'Do you consume alcohol?',
      image: "/images/alcohol.png",
      type: 'yesno',
      yesId: 'diab_alcohol_yes', noId: 'diab_alcohol_no'
    },
    {
      title: 'Lifestyle',
      question: 'Do you exercise regularly?',
      image: "/images/exercise.png",
      type: 'yesno',
      yesId: 'diab_exercise_yes', noId: 'diab_exercise_no'
    },
    {
      title: 'Lifestyle',
      question: 'How many hours do you sit daily?',
      image: "/images/sit_hours.png",
      type: 'multiple',
      options: [
        { id: 'diab_hours_sit_eq', text: '8 Hours' },
        { id: 'diab_hours_sit_gt', text: 'More than 8 Hours' },
        { id: 'diab_hours_sit_lt', text: 'Less than 8 Hours' }
      ]
    },
    {
      title: 'Physical Symptoms',
      question: 'Do you experience frequent urination (especially at night)?',
      image: "/images/urination.png",
      type: 'yesno',
      yesId: 'diab_frequent_urination_yes', noId: 'diab_frequent_urination_no'
    },
    {
      title: 'Physical Symptoms',
      question: 'Do you experience excessive thirst?',
      image: "/images/thirst.png",
      type: 'yesno',
      yesId: 'diab_excessive_thirst_yes', noId: 'diab_excessive_thirst_no'
    },
    {
      title: 'Physical Symptoms',
      question: 'Do you experience unexplained weight loss?',
      image: "/images/weight_loss.png",
      type: 'yesno',
      yesId: 'diab_unexplained_weight_loss_yes', noId: 'diab_unexplained_weight_loss_no'
    },
    {
      title: 'Physical Symptoms',
      question: 'Do you experience increased hunger?',
      image: "/images/hunger.png",
      type: 'yesno',
      yesId: 'diab_hunger_yes', noId: 'diab_hunger_no'
    },
    {
      title: 'Physical Symptoms',
      question: 'Do you experience fatigue or weakness?',
      image: "/images/weakness.png",
      type: 'yesno',
      yesId: 'diab_fatigue_yes', noId: 'diab_fatigue_no'
    },
    {
      title: 'Physical Symptoms',
      question: 'Do you experience blurred vision?',
      image: "/images/blurred_vision.png",
      type: 'yesno',
      yesId: 'diab_blurred_vision_yes', noId: 'diab_blurred_vision_no'
    },
    {
      title: 'Physical Symptoms',
      question: 'Do you experience slow healing of wounds?',
      image: "/images/slow_healing.png",
      type: 'yesno',
      yesId: 'diab_slow_healing_yes', noId: 'diab_slow_healing_no'
    },
    {
      title: 'Family History',
      question: 'Do you have a family history of diabetes?',
      image: "/images/diabetes_family_history.png",
      type: 'yesno',
      yesId: 'diab_family_yes', noId: 'diab_family_no'
    },
    {
      title: 'Medication',
      question: 'Are you on any medication?',
      image: "/images/diabetes_medication.png",
      type: 'yesno',
      yesId: 'diab_medication_yes', noId: 'diab_medication_no'
    }
  ],
  '6': [
    {
      title: 'Medical Symptoms',
      question: 'Select if you are suffering from any of the below mentioned diseases',
      baseImg: "/images/blood_pressure_headache.png",
      type: 'bodymap',
      options: [
        { id: 'bp_d_ha', text: 'Headache', px: 52, py: 9, ly: 26 },
        { id: 'bp_d_dz', text: 'Dizziness', px: 54, py: 18, ly: 45 },
        { id: 'bp_d_bv', text: 'Blurred Vision', px: 60, py: 30, ly: 65 },
      ]
    },
    {
      title: 'Physical Symptoms',
      question: 'Do you experience fatigue or weakness? ',
      image: "/images/weakness.png",
      type: 'yesno',
      yesId: 'bp_fatigue_yes', noId: 'bp_fatigue_no'
    },
    {
      title: 'Medical Symptoms',
      question: 'Select if you are suffering from any of the below mentioned diseases',
      baseImg: "/images/chest_pain.png",
      type: 'bodymap',
      options: [
        { id: 'bp_d_sb', text: 'Shortness of Breath', px: 40, py: 17, ly: 37 },
        { id: 'bp_d_cp', text: 'Chest Pain', px: 55, py: 40, ly: 60 }
      ]
    },
    {
      title: 'Physical Symptoms',
      question: 'Do you experience shortness of breath?',
      image: "/images/shortness_of_breath.png",
      type: 'yesno',
      yesId: 'bp_shortness_of_breath_yes', noId: 'bp_shortness_of_breath_no'
    },
    {
      title: 'Physical Symptoms',
      question: 'Do you experience nosebleeds?',
      image: "/images/nosebleed.png",
      type: 'yesno',
      yesId: 'bp_nosebleed_yes', noId: 'bp_nosebleed_no'
    },
    {
      title: 'Dietary Habits',
      question: 'Select the meals you have throughout the day',
      type: 'multiple',
      options: [
        { id: 'bp_m_bf', text: 'Breakfast', img: "/images/diet_breakfast.png" },
        { id: 'bp_m_lu', text: 'Lunch', img: "/images/diet_lunch.png" },
        { id: 'bp_m_sn', text: 'Snacks', img: "/images/diet_snack.png" },
        { id: 'bp_m_dn', text: 'Dinner', img: "/images/diet_dinner.png" }
      ]
    },
    {
      title: 'Dietary Habits',
      question: 'Do you eat fried foods more than 2 days per week?',
      image: "/images/junkfood_samosa_man.png",
      type: 'yesno',
      yesId: 'bp_fried_yes', noId: 'bp_fried_no'
    },
    {
      title: 'Dietary Habits',
      question: 'Do you consume sugary foods or sweets more than 2 days per week?',
      image: "/images/junkfood_sweets_donuts.png",
      type: 'yesno',
      yesId: 'bp_sugar_yes', noId: 'bp_sugar_no'
    },
    {
      title: 'Dietary Habits',
      question: 'Do you consume non-vegetarian food (meat, fish, eggs)?',
      image: "/images/junkfood_fried_chicken.png",
      type: 'yesno',
      yesId: 'bp_nv_yes', noId: 'bp_nv_no'
    },
    {
      title: 'Stress & Mental Health',
      question: 'Have you experienced any major stress or emotional events in the last 1–2 years? \n Examples: family conflict, financial problems, loss of a loved one, work stress.',
      image: "/images/stand_stress.png",
      type: 'yesno',
      yesId: 'bp_stress_yes', noId: 'bp_stress_no'
    },
    {
      title: 'Medical History',
      question: 'Select if you are suffering from any of the below mentioned diseases',
      baseImg: "/images/thyroid_inner_part.png",
      type: 'bodymap',
      options: [
        { id: 'bp_d_th', text: 'Thyroid', px: 46, py: 17, ly: 28 },
        { id: 'bp_d_db', text: 'Diabetes', px: 49, py: 41, ly: 68 }
      ]
    },
    {
      title: 'Lifestyle',
      question: 'Do you spend long hours sitting (desk work)?',
      image: "/images/stress_man_laptop.png",
      type: 'yesno',
      yesId: 'bp_sit_yes', noId: 'bp_sit_no'
    },
    {
      title: 'Lifestyle',
      question: 'Do you currently smoke or use tobacco products?',
      image: "/images/smoking.png",
      type: 'yesno',
      yesId: 'bp_smoke_yes', noId: 'bp_smoke_no'
    },
    {
      title: 'Lifestyle',
      question: 'Do you consume alcohol?',
      image: "/images/alcohol.png",
      type: 'yesno',
      yesId: 'bp_alcohol_yes', noId: 'bp_alcohol_no'
    },
    {
      title: 'Lifestyle',
      question: 'Do you exercise regularly?',
      image: "/images/exercise.png",
      type: 'yesno',
      yesId: 'bp_exercise_yes', noId: 'bp_exercise_no'
    },
    {
      title: 'Lifestyle',
      question: 'How many hours do you sit daily?',
      image: "/images/sit_hours.png",
      type: 'multiple',
      options: [
        { id: 'bp_hours_sit_eq', text: '8 Hours' },
        { id: 'bp_hours_sit_gt', text: 'More than 8 Hours' },
        { id: 'bp_hours_sit_lt', text: 'Less than 8 Hours' }
      ]
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
        .pis-opt-wrap { display: grid; gap: 16px; flex: 1; align-content: start; }
        .pis-opt-grid { grid-template-columns: 1fr; }
        
        @media(min-width: 480px) {
          .pis-opt-grid-image { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
        }

        @media(min-width: 768px) {
          .pis-hdr { padding: 24px 40px; }
          .pis-inner { padding: 48px 40px; }
          .pis-q { font-size: 34px; }
          .pis-opt-grid { grid-template-columns: 1fr 1fr; }
          .pis-opt-grid-image { grid-template-columns: repeat(3, 1fr); }
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

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: 40 }}
          >
            <h3 style={{ fontSize: 14, color: '#06B6D4', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              {screen.title}
            </h3>
            <h1 className="pis-q">
              {screen.question.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < screen.question.split('\n').length - 1 && <br />}
                </span>
              ))}
            </h1>
            {screen.type === 'multiple' && (
              <p style={{ marginTop: 12, fontSize: 14, color: '#64748B', fontWeight: 600 }}>
                (Select all that apply)
              </p>
            )}

            {screen.image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  margin: '24px auto 0',
                  width: '30%',
                  borderRadius: 24,
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  border: '1.5px solid rgba(0,0,0,0.05)',
                  backgroundColor: '#fff'
                }}
              >
                <img src={screen.image} alt="Question visual" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* OPTIONS GENERATOR */}
        {screen.type === 'bodymap' ? (
          <BodyMapSelect
            screen={screen}
            selectedIds={answers[step] || []}
            onToggle={toggleMultiple}
          />
        ) : (
          <div className={`pis-opt-wrap ${screen.options?.some(o => o.img) ? 'pis-opt-grid-image' : 'pis-opt-grid'}`}>
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
                  img={opt.img}
                  multiple={true}
                  onClick={() => toggleMultiple(opt.id)}
                />
              ))
            )}
          </div>
        )}

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

function InputOption({ selected, text, onClick, multiple, img }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, translateY: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: img ? 'column' : 'row',
        alignItems: img ? 'stretch' : 'center',
        padding: img ? '12px' : '18px 20px',
        borderRadius: 24,
        background: selected ? 'rgba(59, 130, 246, 0.08)' : '#fff',
        border: selected ? '2.5px solid #3B82F6' : '2.5px solid transparent',
        boxShadow: selected ? '0 8px 24px rgba(59, 130, 246, 0.12)' : '0 4px 16px rgba(0,0,0,0.04)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textAlign: img ? 'center' : 'left',
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {img && (
        <div style={{
          width: '100%',
          aspectRatio: '1/1',
          borderRadius: 18,
          overflow: 'hidden',
          marginBottom: 12,
          border: '1px solid rgba(0,0,0,0.05)',
          flexShrink: 0,
          background: '#F8FAFC'
        }}>
          <img src={img} alt={text} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: img ? 'center' : 'flex-start',
        width: '100%',
        padding: img ? '4px 0 8px' : '0'
      }}>
        <div style={{
          width: 22,
          height: 22,
          borderRadius: multiple ? 6 : '50%',
          border: selected ? 'none' : '2px solid #CBD5E1',
          background: selected ? '#3B82F6' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
          flexShrink: 0,
          transition: 'all 0.2s'
        }}>
          {selected && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="material-icons"
              style={{ fontSize: 14, color: '#fff' }}
            >
              done
            </motion.span>
          )}
        </div>
        <span style={{
          fontSize: 16,
          fontWeight: selected ? 800 : 600,
          color: selected ? '#1E3A8A' : '#475569',
          lineHeight: 1.2
        }}>
          {text}
        </span>
      </div>
    </motion.button>
  )
}

function BodyMapSelect({ screen, selectedIds, onToggle }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640

  return (
    <div style={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      width: '100%',
      minHeight: isMobile ? 'auto' : 500,
      gap: isMobile ? 32 : 32,
      position: 'relative',
      background: 'white',
      borderRadius: 32,
      padding: isMobile ? '16px' : '24px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
      overflow: 'hidden',
      alignItems: isMobile ? 'center' : 'stretch'
    }}>
      {/* Left/Top: Body Image */}
      <div style={{
        flex: isMobile ? '0 0 auto' : '0 0 45%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: isMobile ? '100%' : 'auto',
        maxHeight: isMobile ? 400 : 'none'
      }}>
        <img
          src={screen.baseImg}
          alt="Body mapping"
          style={{ height: '100%', width: 'auto', maxWidth: '100%', objectFit: 'contain', borderRadius: 20 }}
        />

        {/* SVG Lines */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
          {screen.options.map((opt, idx) => {
            const isSelected = selectedIds.includes(opt.id)
            if (isMobile) return null

            const labelY = opt.ly !== undefined ? opt.ly : (15 + (idx * 35))
            return (
              <motion.line
                key={`line-${opt.id}`}
                x1={`${opt.px}%`}
                y1={`${opt.py}%`}
                x2="100%"
                y2={`${labelY}%`}
                stroke={isSelected ? '#3B82F6' : '#E2E8F0'}
                strokeWidth={isSelected ? 3 : 1.5}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              />
            )
          })}
        </svg>

        {/* Highlight points on body */}
        {screen.options.map(opt => {
          const isSelected = selectedIds.includes(opt.id)
          return (
            <motion.div
              key={`dot-${opt.id}`}
              style={{
                position: 'absolute',
                left: `${opt.px}%`,
                top: `${opt.py}%`,
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: isSelected ? '#3B82F6' : '#fff',
                border: `3px solid ${isSelected ? '#fff' : '#CBD5E1'}`,
                transform: 'translate(-50%, -50%)',
                boxShadow: isSelected ? '0 0 15px rgba(59, 130, 246, 0.6)' : '0 2px 4px rgba(0,0,0,0.1)',
                zIndex: 2
              }}
              animate={{
                scale: isSelected ? 1.4 : 1,
                backgroundColor: isSelected ? '#3B82F6' : '#fff'
              }}
            />
          )
        })}
      </div>

      {/* Right/Bottom: Labels */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: isMobile ? 12 : 32,
        paddingRight: isMobile ? 0 : 10,
        width: isMobile ? '100%' : 'auto',
        zIndex: 2
      }}>
        {screen.options.map((opt, idx) => {
          const isSelected = selectedIds.includes(opt.id)
          return (
            <motion.button
              key={opt.id}
              whileHover={{ x: 10, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onToggle(opt.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '20px 24px',
                borderRadius: 24,
                background: isSelected ? 'linear-gradient(135deg, #EFF6FF, #DBEAFE)' : '#fff',
                border: isSelected ? '2.5px solid #3B82F6' : '1.5px solid #E2E8F0',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: isSelected ? '0 8px 20px rgba(59, 130, 246, 0.15)' : '0 4px 12px rgba(0,0,0,0.03)',
                transition: 'all 0.3s ease',
                width: '100%'
              }}
            >
              <div style={{
                width: 24,
                height: 24,
                borderRadius: 8,
                border: isSelected ? 'none' : '2px solid #CBD5E1',
                background: isSelected ? '#3B82F6' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
                flexShrink: 0
              }}>
                {isSelected && <span className="material-icons" style={{ fontSize: 16, color: '#fff' }}>done</span>}
              </div>
              <span style={{
                fontSize: 17,
                fontWeight: isSelected ? 800 : 600,
                color: isSelected ? '#1E40AF' : '#475569',
                letterSpacing: '-0.01em'
              }}>
                {opt.text}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}