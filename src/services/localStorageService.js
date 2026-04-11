const K = {
  uid:'uid', name:'name', mobile:'mobile', email:'email', age:'age',
  gender:'gender', isLoggedIn:'isLoggedIn', isProfileComplete:'isProfileComplete',
  selectedCategoryId: 'selectedCategoryId', selectedCategoryName: 'selectedCategoryName',
  selectedSubCategoryId: 'selectedSubCategoryId', selectedSubCategoryName: 'selectedSubCategoryName'
}

export function saveUserProfile(user) {
  try {
    localStorage.setItem(K.uid,               user.uid    || '')
    localStorage.setItem(K.name,              user.name   || '')
    localStorage.setItem(K.mobile,            user.mobile || '')
    localStorage.setItem(K.email,             user.email  || '')
    localStorage.setItem(K.age,               user.age    || '')
    localStorage.setItem(K.gender,            user.gender || 'Male')
    localStorage.setItem(K.isLoggedIn,        String(user.isLoggedIn        ?? false))
    localStorage.setItem(K.isProfileComplete, String(user.isProfileComplete ?? false))
    localStorage.setItem(K.selectedCategoryId,      String(user.selectedCategoryId || 0))
    localStorage.setItem(K.selectedCategoryName,    user.selectedCategoryName || '')
    localStorage.setItem(K.selectedSubCategoryId,   String(user.selectedSubCategoryId || 0))
    localStorage.setItem(K.selectedSubCategoryName, user.selectedSubCategoryName || '')
  } catch (e) { console.error(e) }
}

export function loadUserProfile() {
  try {
    const isLoggedIn = localStorage.getItem(K.isLoggedIn) === 'true';
    return {
      isLoggedIn: isLoggedIn,
      userData: {
        uid:              localStorage.getItem(K.uid)    || '',
        name:             localStorage.getItem(K.name)   || '',
        mobile:           localStorage.getItem(K.mobile) || '',
        email:            localStorage.getItem(K.email)  || '',
        age:              localStorage.getItem(K.age)    || '',
        gender:           localStorage.getItem(K.gender) || 'Male',
        isLoggedIn:       isLoggedIn,
        isProfileComplete: localStorage.getItem(K.isProfileComplete) === 'true',
        selectedCategoryId: Number(localStorage.getItem(K.selectedCategoryId)) || 0,
        selectedCategoryName: localStorage.getItem(K.selectedCategoryName) || '',
        selectedSubCategoryId: Number(localStorage.getItem(K.selectedSubCategoryId)) || 0,
        selectedSubCategoryName: localStorage.getItem(K.selectedSubCategoryName) || '',
      },
    }
  } catch { return { isLoggedIn: false, userData: null } }
}

export function clearAll() { try { localStorage.clear() } catch (_) {} }

export function isProfileComplete() {
  return localStorage.getItem(K.isProfileComplete) === 'true'
}
