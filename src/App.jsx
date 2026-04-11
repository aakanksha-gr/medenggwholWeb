import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useGlobalStore } from './store/globalStore'
import { loadUserProfile } from './services/localStorageService'

import SplashScreen       from './screens/SplashScreen'
import LoginScreen        from './screens/LoginScreen'
import ProfileScreen      from './screens/ProfileScreen'
import CategoryScreen     from './screens/CategoryScreen'
import SubCategoryScreen  from './screens/SubCategoryScreen'
import PatientInputScreen from './screens/PatientInputScreen'
import SolutionScreen     from './screens/SolutionScreen'
import AppointmentScreen  from './screens/AppointmentScreen'

export default function App() {
  const { setCategories, setAdmin, setInputScreens, setSolutions, setUserData, healthCategories } = useGlobalStore()

  useEffect(() => {
    if (healthCategories.length === 0 && window.location.pathname !== '/') {
      const initSilent = async () => {
        try {
          const catRes = await fetch('/json/health_categories.json')
          const catData = await catRes.json()
          setCategories(catData.categories || [])
          if (catData.admin) setAdmin(catData.admin)

          const solRes = await fetch('/json/patient_input_solution_screens.json')
          const solData = await solRes.json()
          setInputScreens(solData.screens || [])
          setSolutions(solData.solutions || [])

          const { userData } = loadUserProfile()
          if (userData) {
            setUserData(userData)
          }
        } catch (e) {
          console.error('Silent init failed:', e)
        }
      }
      initSilent()
    }
  }, [healthCategories.length, setCategories, setAdmin, setInputScreens, setSolutions, setUserData])
  return (
      <div className="app-shell">
        <Routes>
          <Route path="/"               element={<SplashScreen />}       />
          <Route path="/login"          element={<LoginScreen />}        />
          <Route path="/profile"        element={<ProfileScreen />}      />
          <Route path="/categories"     element={<CategoryScreen />}     />
          <Route path="/sub-categories" element={<SubCategoryScreen />}  />
          <Route path="/patient-input"  element={<PatientInputScreen />} />
          <Route path="/solution"       element={<SolutionScreen />}     />
          <Route path="/appointment"    element={<AppointmentScreen />}  />
          {/* Payment route preserved for future but not linked in UI */}
          {/* <Route path="/payment" element={<PaymentScreen />} /> */}
          <Route path="*"               element={<Navigate to="/" replace />} />
        </Routes>
      </div>
  )
}