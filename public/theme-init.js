(() => {
  const root = document.documentElement
  const themeColor = document.querySelector('meta[name="theme-color"]')
  const colorScheme = window.matchMedia('(prefers-color-scheme: dark)')
  let preference = 'system'

  const applyTheme = () => {
    const theme = preference === 'system' ? (colorScheme.matches ? 'dark' : 'light') : preference
    root.dataset.themeMode = preference
    root.dataset.theme = theme
    themeColor.content = theme === 'dark' ? '#171d19' : '#f8f8f5'
  }

  const readPreference = (saved) => {
    preference = saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system'
    applyTheme()
  }

  try {
    readPreference(localStorage.getItem('yenly-theme-mode'))
  } catch (error) {
    console.warn('Yenly could not read the saved theme preference.', error)
    applyTheme()
  }

  colorScheme.addEventListener('change', () => {
    if (preference === 'system') applyTheme()
  })
  window.addEventListener('storage', (event) => {
    if (event.key === 'yenly-theme-mode') readPreference(event.newValue)
  })
})()
