import { create } from 'zustand'
import { saveUserProfile } from '../services/localStorageService'

const defaultUser = {
  uid: '', name: '', mobile: '', email: '', age: '', gender: 'Male',
  isLoggedIn: false, isProfileComplete: false,
  selectedCategoryId: 0, selectedCategoryName: '',
  selectedSubCategoryId: 0, selectedSubCategoryName: '',
  appointmentDate: '', appointmentTime: '',
  inputAnswers: {},
}

export const useGlobalStore = create((set, get) => ({
  healthCategories: [],
  inputScreens: [],
  solutions: [],
  adminInfo: null,
  selectedDoctor: null,
  userData: { ...defaultUser },

  setCategories: (cats) => set({ healthCategories: cats }),
  setAdmin: (info) => set({ adminInfo: info }),
  setInputScreens: (screens) => set({ inputScreens: screens }),
  setSolutions: (sols) => set({ solutions: sols }),

  selectDoctor: (categoryId) => {
    const cat = get().healthCategories.find(c => c.id === categoryId)
    set({ selectedDoctor: cat?.doctor ?? null })
  },

  setUserData: (patch) =>
    set(s => {
      const newUserData = { ...s.userData, ...patch }
      saveUserProfile(newUserData)
      return { userData: newUserData }
    }),

  resetSession: () =>
    set(s => ({
      userData: {
        ...s.userData,
        selectedCategoryId: 0, selectedCategoryName: '',
        selectedSubCategoryId: 0, selectedSubCategoryName: '',
        appointmentDate: '', appointmentTime: '',
        inputAnswers: {},
      },
      selectedDoctor: null,
    })),

  logout: () => set({ userData: { ...defaultUser }, selectedDoctor: null }),
}))
