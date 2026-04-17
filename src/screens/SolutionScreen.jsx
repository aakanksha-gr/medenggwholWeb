import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalStore } from '../store/globalStore'

function buildSolution(userData) {
    const ids = new Set(userData?.allSelectedIds || [])
    const hasAny = (...arr) => arr.some(id => ids.has(id))
    const catId = Number(userData?.selectedCategoryId)

    if (ids.size === 0 && !catId) {
        return {
            title: 'No Data Found',
            color: '#64748B',
            sections: [
                { title: 'Information', content: 'Please complete an assessment first.' }
            ]
        }
    }

    // FEVER & INFECTIONS
    if (catId === 1 || hasAny('f_symp_1', 'f_symp_2', 'f_symp_3', 'f_body_head', 'f_body_weak', 'f_body_nose', 'f_body_throat', 'f_body_cough', 'f_body_breath', 'f_body_nausea', 'f_body_vomiting')) {
        let isEmergency = ids.has('f_body_breath'); // Difficulty breathing

        let symptomsDetected = [];
        if (ids.has('f_body_head')) symptomsDetected.push('Headache');
        if (ids.has('f_body_weak')) symptomsDetected.push('Weakness');
        if (ids.has('f_body_nose')) symptomsDetected.push('Congestion');
        if (ids.has('f_body_throat')) symptomsDetected.push('Sore Throat');
        if (ids.has('f_body_cough')) symptomsDetected.push('Cough');
        if (hasAny('f_body_nausea', 'f_body_vomiting', 'f_body_abdominal_pain')) symptomsDetected.push('Digestive distress');

        let causes = [];
        if (ids.has('f_food_yes')) causes.push('Outside food');
        if (ids.has('f_icecream_yes')) causes.push('Cold intake');
        if (ids.has('f_travel_yes')) causes.push('Climate change/Travel');
        if (ids.has('f_exercise_yes')) causes.push('Physical overexertion');

        return {
            title: isEmergency ? 'Urgent Attention Required 🚨' : 'Fever & Infection Assessment',
            color: isEmergency ? '#EF4444' : '#F59E0B',
            icon: isEmergency ? 'emergency' : 'thermostat',
            sections: [
                {
                    title: 'Symptom Profile',
                    content: symptomsDetected.length > 0 ? `Detected: ${symptomsDetected.join(' • ')}.` : 'General fever symptoms reported.'
                },
                {
                    title: 'Analysis',
                    content: isEmergency ? 'Severe respiratory distress detected. Please seek medical help immediately.' : 'Your symptoms suggest an acute infection, likely viral or related to recent lifestyle/exposure factors.'
                },
                {
                    title: 'Possible Triggers',
                    content: causes.length > 0 ? causes.join(' • ') : 'Seasonal exposure or viral transmission.'
                },
                {
                    title: 'Recommendation',
                    content: 'Maintain bed rest, stay hydrated with electrolyte fluids, and monitor temperature regularly. Avoid cold/fried foods. Consult a doctor if fever exceeds 101°F.'
                }
            ]
        }
    }

    // PCOS & HORMONAL HEALTH
    if (catId === 2 || hasAny('p_irreg_yes', 'p_mood_yes', 'p_hair_yes', 'p_hl', 'p_acne', 'p_gain_yes', 'p_dark_yes')) {
        let symptomsDetected = [];
        if (ids.has('p_irreg_yes')) symptomsDetected.push('Irregular periods');
        if (ids.has('p_mood_yes')) symptomsDetected.push('Mood swings/Fatigue');
        if (ids.has('p_hair_yes')) symptomsDetected.push('Excess body hair');
        if (ids.has('p_hl')) symptomsDetected.push('Hair thinning');
        if (ids.has('p_acne')) symptomsDetected.push('Acne/Skin issues');
        if (ids.has('p_gain_yes')) symptomsDetected.push('Weight gain');
        if (ids.has('p_dark_yes')) symptomsDetected.push('Dark skin patches');

        let score = symptomsDetected.length;

        return {
            title: score >= 3 ? 'High Probability of PCOS' : 'Hormonal Assessment',
            color: '#EC4899',
            icon: 'water_drop',
            sections: [
                {
                    title: 'Symptom Match',
                    content: symptomsDetected.length > 0 ? `Identified Indicators: ${symptomsDetected.join(' • ')}.` : 'General hormonal concerns reported.'
                },
                {
                    title: 'Clinical Analysis',
                    content: score >= 3 ? 'You exhibit multiple primary markers of Polycystic Ovary Syndrome (PCOS). This requires clinical confirmation through blood work and imaging.' : 'You have a few indicators that may suggest mild hormonal imbalance or the early stages of a metabolic shift.'
                },
                {
                    title: 'Recommended Tests',
                    content: 'Standard diagnostic protocol includes a Pelvic Ultrasound (for cystic ovaries) and a hormonal blood panel (LH, FSH, Testosterone, and Fasting Insulin).'
                },
                {
                    title: 'Lifestyle Management',
                    content: 'Focus on a low-glycemic diet to manage insulin resistance. Regular strength training and stress management are key to balancing hormones naturally.'
                }
            ]
        }
    }

    // OBESITY AND WEIGHT GAIN (Category 3)
    if (catId === 3 || hasAny('t_fried_yes', 't_sugar_yes', 't_nv_yes', 't_stress_yes', 't_sit_yes', 't_d_th', 't_d_bp', 't_d_db')) {
        let riskFactors = [];
        if (ids.has('t_fried_yes')) riskFactors.push('High fried food intake');
        if (ids.has('t_sugar_yes')) riskFactors.push('Frequent sugary foods');
        if (ids.has('t_sit_yes')) riskFactors.push('Sedentary lifestyle');
        if (ids.has('t_stress_yes')) riskFactors.push('Elevated stress levels');
        if (ids.has('t_d_th')) riskFactors.push('Thyroid-related metabolic shift');

        let complications = [];
        if (ids.has('t_d_bp')) complications.push('Blood Pressure');
        if (ids.has('t_d_db')) complications.push('Diabetes');

        let mealsCount = ['t_m_bf', 't_m_lu', 't_m_sn', 't_m_dn'].filter(m => ids.has(m)).length;

        return {
            title: 'Obesity and Weight Gain Assessment',
            color: '#3B82F6',
            icon: 'monitor_weight',
            sections: [
                {
                    title: 'Weight Management Profile',
                    content: complications.length > 0 ? `Metabolic risk factors identified: ${complications.join(' • ')}.` : 'Currently focused on preventive weight management.'
                },
                {
                    title: 'Nutrition & Lifestyle',
                    content: mealsCount < 3 ? 'Irregular meal patterns detected. Consistent nutrition is critical for stabilizing weight and metabolism.' : 'Standard meal frequency reported. Focus on reducing caloric density from fats and sugars.'
                },
                {
                    title: 'Risk Factors',
                    content: riskFactors.length > 0 ? `Factors contributing to weight gain: ${riskFactors.join(' • ')}.` : 'No significant lifestyle risk factors identified.'
                },
                {
                    title: 'Actionable Advice',
                    content: 'Prioritize a high-fiber, protein-rich diet to manage satiety. Aim for 150 minutes of moderate activity weekly and monitor portion sizes to combat steady weight gain.'
                }
            ]
        }
    }

    // STRESS & ANXIETY (Category 4)
    if (catId === 4 || hasAny('s_teacher_yes', 's_friends_yes', 's_parent_yes', 's_focus_yes', 's_mental_yes', 's_medication_yes')) {
        let sources = [];
        if (ids.has('s_teacher_yes')) sources.push('Academic Environment (Teaching/Exam fear)');
        if (ids.has('s_friends_yes')) sources.push('Social Pressure (Peer performance)');
        if (ids.has('s_parent_yes')) sources.push('Parental Expectations');

        let hasFocusIssues = ids.has('s_focus_yes');
        let needsClinicalCare = hasAny('s_mental_yes', 's_medication_yes');

        return {
            title: 'Academic & Social Stress Assessment',
            color: '#8B5CF6',
            icon: 'psychology',
            sections: [
                {
                    title: 'Environmental Stressors',
                    content: sources.length > 0
                        ? `Significant strain detected from: ${sources.join(' • ')}.`
                        : 'General academic and social strain detected.'
                },
                {
                    title: 'Concentration & Focus',
                    content: hasFocusIssues
                        ? 'Your stress level is currently high enough to disrupt your cognitive focus. This "brain fog" is a common physiological response to academic pressure.'
                        : 'You show resilience in maintaining concentration despite external pressures.'
                },
                {
                    title: 'Clinical & Medical Note',
                    content: needsClinicalCare
                        ? 'Given your history or current medication, please ensure you discuss these specific academic stressors with a professional to prevent burnout.'
                        : 'No prior mental health history reported. Focus on proactive stress management to maintain your wellbeing.'
                },
                {
                    title: 'Actionable Advice',
                    content: 'Counteract exam fear by practicing mock tests in a low-pressure setting. If peer comparison is a trigger, shift focus to your personal growth milestones. Schedule a daily "worry window" to process these thoughts outside of study hours.'
                }
            ]
        }
    }

    // DIABETES (Category 5)
    if (catId === 5 || hasAny('diab_frequent_urination_yes', 'diab_excessive_thirst_yes', 'diab_unexplained_weight_loss_yes', 'diab_hunger_yes', 'diab_fatigue_yes', 'diab_blurred_vision_yes', 'diab_slow_healing_yes')) {
        let symptomsCount = ['diab_frequent_urination_yes', 'diab_excessive_thirst_yes', 'diab_unexplained_weight_loss_yes', 'diab_hunger_yes', 'diab_fatigue_yes', 'diab_blurred_vision_yes', 'diab_slow_healing_yes'].filter(id => ids.has(id)).length;

        let riskFactors = [];
        if (ids.has('diab_family_yes')) riskFactors.push('Genetic History');
        if (ids.has('diab_smoke_yes')) riskFactors.push('Tobacco Use');
        if (ids.has('diab_alcohol_yes')) riskFactors.push('Alcohol Consumption');
        if (ids.has('diab_hours_sit_gt')) riskFactors.push('Sedentary Behavior (>8 hrs sitting)');
        if (ids.has('diab_sugar_yes')) riskFactors.push('High Sugar Intake');

        let skippedMeals = !ids.has('diab_m_bf') || !ids.has('diab_m_lu') || !ids.has('diab_m_dn');

        return {
            title: 'Diabetes & Metabolic Risk Profile',
            color: '#10B981',
            icon: 'bloodtype',
            sections: [
                {
                    title: 'Risk Level Analysis',
                    content: (symptomsCount >= 3 || ids.has('diab_family_yes'))
                        ? `Elevated risk detected based on ${symptomsCount} physical markers and hereditary factors.`
                        : 'Moderate metabolic risk identified; preventive measures are highly recommended.'
                },
                {
                    title: 'Lifestyle & Environmental Impact',
                    content: `${riskFactors.length > 0 ? `Risk factors detected: ${riskFactors.join(' • ')}.` : 'Minimal lifestyle risk factors identified.'} ${skippedMeals ? 'Note: Skipping primary meals increases the risk of glycemic instability.' : ''}`
                },
                {
                    title: 'Clinical Comorbidities',
                    content: hasAny('diab_d_th', 'diab_d_bp')
                        ? 'Existing Thyroid or Blood Pressure issues compound your metabolic risk and require a unified management approach.'
                        : 'No significant chronic comorbid conditions reported.'
                },
                {
                    title: 'Specialist Advice',
                    content: 'We strongly recommend a Fasting Blood Sugar and HbA1c screening. Shift to a low-glycemic diet, eliminate refined sugars, and incorporate short walks throughout the day to counter the effects of prolonged sitting.'
                }
            ]
        }
    }

    // BLOOD PRESSURE (Category 6)
    if (catId === 6 || hasAny('bp_d_ha', 'bp_d_dz', 'bp_d_bv', 'bp_d_cp', 'bp_d_sb', 'bp_nosebleed_yes', 'bp_fatigue_yes')) {
        let clinicalSymptoms = [];
        if (ids.has('bp_d_ha')) clinicalSymptoms.push('Severe Headaches');
        if (ids.has('bp_d_cp')) clinicalSymptoms.push('Chest Pain');
        if (ids.has('bp_d_sb') || ids.has('bp_shortness_of_breath_yes')) clinicalSymptoms.push('Shortness of Breath');
        if (ids.has('bp_nosebleed_yes')) clinicalSymptoms.push('Nosebleed');
        if (ids.has('bp_d_dz')) clinicalSymptoms.push('Dizziness');
        if (ids.has('bp_d_bv')) clinicalSymptoms.push('Blurred Vision');
        if (ids.has('bp_fatigue_yes')) clinicalSymptoms.push('Chronic Fatigue');

        let lifestyleRisks = [];
        if (ids.has('bp_smoke_yes')) lifestyleRisks.push('Tobacco Use');
        if (ids.has('bp_alcohol_yes')) lifestyleRisks.push('Alcohol Consumption');
        if (ids.has('bp_hours_sit_gt')) lifestyleRisks.push('Extreme Sedentary Behavior (>8 hrs)');
        if (ids.has('bp_fried_yes')) lifestyleRisks.push('High Fried Food Intake');
        if (ids.has('bp_sugar_yes')) lifestyleRisks.push('High Sugar/Sweet Intake');
        if (ids.has('bp_nv_yes')) lifestyleRisks.push('High Meat/Non-Veg Diet');
        if (ids.has('bp_stress_yes')) lifestyleRisks.push('Major Life Stressors');

        let hasHistory = hasAny('bp_d_th', 'bp_d_db');
        let irregularMeals = !ids.has('bp_m_bf') || !ids.has('bp_m_lu') || !ids.has('bp_m_dn');

        return {
            title: 'Cardiovascular Health Profile',
            color: '#EF4444',
            icon: 'monitor_heart',
            sections: [
                {
                    title: 'Clinical Symptom Analysis',
                    content: clinicalSymptoms.length > 0
                        ? `Caution: Detected symptoms include ${clinicalSymptoms.join(' • ')}. These markers combined with BP fluctuations require proactive monitoring.`
                        : 'Routine cardiovascular check requested; no acute hypertensive symptoms reported.'
                },
                {
                    title: 'Lifestyle & Heart Risk Factors',
                    content: `${lifestyleRisks.length > 0 ? `Vascular stressors identified: ${lifestyleRisks.join(' • ')}.` : 'Lifestyle habits reported are supportive of heart health.'} ${irregularMeals ? 'Warning: Irregular meal patterns can impact vascular tone stability.' : ''}`
                },
                {
                    title: 'Medical Comorbidities',
                    content: hasHistory
                        ? 'Underlying Thyroid or Diabetes issues increase your risk of secondary hypertension and cardiac complications.'
                        : 'No significant comorbid medical history reported.'
                },
                {
                    title: 'Path to Heart Wellness',
                    content: 'Immediate: Conduct a 7-day BP log (morning/night). Lifestyle: Adopt a DASH-style diet (low sodium, high potassium), ensure 150 min of cardio weekly, and implement stress management like 4-7-8 breathing exercises.'
                }
            ]
        }
    }

    return {
        title: 'General Health Assessment',
        color: '#10B981',
        icon: 'health_and_safety',
        sections: [
            { title: 'Status', content: 'No immediate severe risks detected based on your input.' },
            { title: 'Advice', content: 'Maintain a healthy lifestyle, stay hydrated, and consult a doctor if any symptoms persist.' }
        ]
    }
}

export default function SolutionScreen() {
    const nav = useNavigate()
    const { userData } = useGlobalStore()

    const solution = useMemo(() => buildSolution(userData), [userData])

    // Convert hex color to rgba for soft backgrounds
    const hexToRgba = (hex, alpha) => {
        let r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    return (
        <div style={{
            height: '100dvh', // Fixed viewport height to enable internal scrolling
            background: 'linear-gradient(135deg, #F8FAFC, #E2E8F0)',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflowX: 'hidden',
            overflowY: 'auto',
            alignItems: 'center'
        }}>
            <style>{`
                .ss-hdr { padding: 40px 24px 24px; position: relative; z-index: 1; width: 100%; max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; text-align: center; }
                .ss-content { flex: 1; padding: 0 24px 40px; position: relative; z-index: 1; width: 100%; max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; }
                .ss-grid { display: flex; flex-direction: column; gap: 16px; width: 100%; }
                .ss-actions { margin-top: auto; padding-top: 24px; display: flex; flex-direction: column; gap: 12px; width: 100%; }
                
                @media(min-width: 768px) {
                    .ss-hdr { padding: 60px 40px 40px; max-width: 1000px; }
                    .ss-content { padding: 0 40px 60px; max-width: 1000px; }
                    .ss-title { font-size: 42px !important; }
                    .ss-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
                    .ss-actions { flex-direction: row; justify-content: center; margin-top: 40px; }
                    .ss-actions button { flex: 1; }
                }
            `}</style>

            {/* Background decorative blobs */}
            <div style={{
                position: 'absolute', top: -100, right: -50,
                width: 300, height: 300, borderRadius: '50%',
                background: hexToRgba(solution.color, 0.15),
                filter: 'blur(60px)', pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute', bottom: -50, left: -50,
                width: 250, height: 250, borderRadius: '50%',
                background: hexToRgba(solution.color, 0.1),
                filter: 'blur(50px)', pointerEvents: 'none'
            }} />

            {/* HEADER */}
            <div className="ss-hdr">
                <div style={{
                    width: 72, height: 72, borderRadius: 24,
                    background: hexToRgba(solution.color, 0.15),
                    color: solution.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 20,
                    boxShadow: `0 8px 32px ${hexToRgba(solution.color, 0.2)}`
                }}>
                    <span className="material-icons" style={{ fontSize: 36 }}>
                        {solution.icon || 'analytics'}
                    </span>
                </div>

                <h1 className="ss-title" style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: '#0F172A',
                    margin: '0 0 12px',
                    lineHeight: 1.2,
                    letterSpacing: '-0.5px'
                }}>
                    {solution.title}
                </h1>
                <p style={{ fontSize: 15, color: '#64748B', maxWidth: '80%', margin: 0, fontWeight: 500 }}>
                    Based on your personalized questionnaire assessment.
                </p>
            </div>

            {/* CONTENT CARDS */}
            <div className="ss-content">
                <div className="ss-grid">
                    {solution.sections.map((sec, i) => (
                        <div
                            key={i}
                            style={{
                                background: 'rgba(255, 255, 255, 0.7)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.5)',
                                borderRadius: 24,
                                padding: '24px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                                transform: 'translateZ(0)' // Hardware acceleration
                            }}
                        >
                            <h3 style={{
                                fontSize: 14,
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                color: solution.color,
                                margin: '0 0 10px'
                            }}>
                                {sec.title}
                            </h3>
                            <p style={{
                                fontSize: 16,
                                color: '#334155',
                                lineHeight: 1.6,
                                margin: 0,
                                fontWeight: 600
                            }}>
                                {sec.content}
                            </p>
                        </div>
                    ))}

                </div>

                {/* CALL TO ACTION BUTTONS */}
                <div className="ss-actions">
                    <button
                        onClick={() => nav('/appointment')}
                        style={{
                            padding: '18px',
                            borderRadius: '20px',
                            background: `linear-gradient(135deg, ${solution.color}, ${hexToRgba(solution.color, 0.8)})`,
                            color: '#fff',
                            fontSize: 16,
                            fontWeight: 800,
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 10,
                            boxShadow: `0 12px 32px ${hexToRgba(solution.color, 0.3)}`,
                            transition: 'all 0.2s ease',
                            width: '100%'
                        }}
                    >
                        <span className="material-icons" style={{ fontSize: 20 }}>calendar_month</span>
                        Consult a Specialist
                    </button>

                    <button
                        onClick={() => nav('/categories')}
                        style={{
                            padding: '18px',
                            borderRadius: '20px',
                            background: 'transparent',
                            color: '#64748B',
                            fontSize: 16,
                            fontWeight: 700,
                            border: '2px solid rgba(148, 163, 184, 0.3)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease',
                            width: '100%'
                        }}
                    >
                        Finish Assessment
                    </button>
                </div>
            </div>

        </div>
    )
}