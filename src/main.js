import './style.css'

const currencies = [
  { code: 'JPY', names: { fr: 'Yen japonais', en: 'Japanese yen', ja: '日本円' }, flag: '🇯🇵' },
  { code: 'EUR', names: { fr: 'Euro', en: 'Euro', ja: 'ユーロ' }, flag: '🇪🇺' },
  { code: 'USD', names: { fr: 'Dollar américain', en: 'US dollar', ja: '米ドル' }, flag: '🇺🇸' },
  { code: 'GBP', names: { fr: 'Livre sterling', en: 'British pound', ja: '英ポンド' }, flag: '🇬🇧' },
  { code: 'CHF', names: { fr: 'Franc suisse', en: 'Swiss franc', ja: 'スイスフラン' }, flag: '🇨🇭' },
  { code: 'CAD', names: { fr: 'Dollar canadien', en: 'Canadian dollar', ja: 'カナダドル' }, flag: '🇨🇦' },
  { code: 'AUD', names: { fr: 'Dollar australien', en: 'Australian dollar', ja: '豪ドル' }, flag: '🇦🇺' },
  { code: 'CNY', names: { fr: 'Yuan chinois', en: 'Chinese yuan', ja: '人民元' }, flag: '🇨🇳' },
  { code: 'XOF', names: { fr: 'Franc CFA d’Afrique de l’Ouest', en: 'West African CFA franc', ja: '西アフリカCFAフラン' }, flag: '🌍' },
  { code: 'XAF', names: { fr: 'Franc CFA d’Afrique centrale', en: 'Central African CFA franc', ja: '中部アフリカCFAフラン' }, flag: '🌍' },
]

const translations = {
  fr: {
    pageTitle: 'Yenly — Convertisseur de yen japonais',
    description: 'Convertissez le yen japonais en euros et autres devises avec des taux de change actualisés.',
    brand: 'Yenly, accueil',
    headerNote: 'Le change, en toute simplicité',
    convert: 'Convertir',
    heroEyebrow: 'VOTRE COMPAGNON DE VOYAGE',
    heroTitle: 'Le Japon, à portée<br />de <span>conversion.</span>',
    heroDescription: 'Un taux clair, un calcul instantané. Préparez votre prochain départ l’esprit léger.',
    heroTrust: 'Taux de change mis à jour en temps réel',
    artLocation: "JAPON · 35° 41' N",
    artStamp: 'VOYAGE',
    converterEyebrow: 'CONVERTISSEUR DE DEVISES',
    converterTitle: 'Combien vaut votre yen ?',
    sending: 'Vous envoyez',
    receiving: 'Vous recevez environ',
    amountAccessible: 'Montant à convertir',
    fromCurrency: 'Devise de départ',
    toCurrency: 'Devise d’arrivée',
    swap: 'Inverser les devises',
    loading: 'Récupération des taux…',
    unavailable: 'Taux indisponibles',
    refreshed: 'Taux actualisés',
    amountInvalid: 'Saisissez un montant valide pour voir la conversion.',
    rateLoading: 'Chargement du taux…',
    rateUnavailable: 'Le taux sera affiché dès que le service sera disponible.',
    error: 'Impossible de récupérer les taux de change. Vérifiez votre connexion puis réessayez. ({detail})',
    update: 'Actualiser',
    tryWith: 'Essayez avec',
    footerMade: 'Fait avec soin pour vos voyages.',
    footerDisclaimer: 'Les taux sont indicatifs et peuvent varier.',
    languages: 'Langue',
    quickAmounts: 'Montants rapides',
    themeDark: 'Activer le mode sombre',
    themeLight: 'Activer le mode clair',
    install: 'Installer',
    installHelp: 'Pour installer Yenly, appuyez sur Partager dans Safari, puis sur « Sur l’écran d’accueil ».',
  },
  en: {
    pageTitle: 'Yenly — Japanese Yen Converter',
    description: 'Convert Japanese yen to euros and other currencies using updated exchange rates.',
    brand: 'Yenly, home',
    headerNote: 'Currency exchange, made simple',
    convert: 'Convert',
    heroEyebrow: 'YOUR TRAVEL COMPANION',
    heroTitle: 'Japan, just a<br />conversion <span>away.</span>',
    heroDescription: 'Clear rates, instant calculations. Get ready for your next trip with peace of mind.',
    heroTrust: 'Exchange rates updated live',
    artLocation: "JAPAN · 35° 41' N",
    artStamp: 'TRAVEL',
    converterEyebrow: 'CURRENCY CONVERTER',
    converterTitle: 'What’s your yen worth?',
    sending: 'You send',
    receiving: 'You receive approx.',
    amountAccessible: 'Amount to convert',
    fromCurrency: 'From currency',
    toCurrency: 'To currency',
    swap: 'Swap currencies',
    loading: 'Fetching exchange rates…',
    unavailable: 'Rates unavailable',
    refreshed: 'Rates updated',
    amountInvalid: 'Enter a valid amount to see the conversion.',
    rateLoading: 'Loading exchange rate…',
    rateUnavailable: 'The rate will appear when the service is available.',
    error: 'Unable to retrieve exchange rates. Check your connection and try again. ({detail})',
    update: 'Refresh',
    tryWith: 'Try with',
    footerMade: 'Made with care for your travels.',
    footerDisclaimer: 'Rates are indicative and may vary.',
    languages: 'Language',
    quickAmounts: 'Quick amounts',
    themeDark: 'Enable dark mode',
    themeLight: 'Enable light mode',
    install: 'Install',
    installHelp: 'To install Yenly, tap Share in Safari, then choose “Add to Home Screen”.',
  },
  ja: {
    pageTitle: 'Yenly — 日本円の通貨換算',
    description: '最新の為替レートで、日本円をユーロや各国の通貨に換算できます。',
    brand: 'Yenly ホーム',
    headerNote: 'かんたん、シンプルな通貨換算',
    convert: '換算する',
    heroEyebrow: '旅のおともに',
    heroTitle: '日本旅行を、<br /><span>もっと身近に。</span>',
    heroDescription: 'わかりやすい為替レートで、すぐに換算。次の旅の準備を気軽に始めましょう。',
    heroTrust: '為替レートをリアルタイムで更新',
    artLocation: '日本 · 北緯35°41′',
    artStamp: '旅行',
    converterEyebrow: '通貨換算',
    converterTitle: '円はいくらになる？',
    sending: '換算する金額',
    receiving: '換算後の金額（目安）',
    amountAccessible: '換算する金額',
    fromCurrency: '換算前の通貨',
    toCurrency: '換算後の通貨',
    swap: '通貨を入れ替える',
    loading: '為替レートを取得中…',
    unavailable: 'レートを取得できません',
    refreshed: 'レート更新',
    amountInvalid: '換算する金額を正しく入力してください。',
    rateLoading: '為替レートを読み込み中…',
    rateUnavailable: 'サービスが利用可能になるとレートが表示されます。',
    error: '為替レートを取得できません。接続を確認して、もう一度お試しください。（{detail}）',
    update: '更新',
    tryWith: '金額を選ぶ',
    footerMade: '旅のために心を込めて。',
    footerDisclaimer: '表示レートは目安です。実際のレートと異なる場合があります。',
    languages: '言語',
    quickAmounts: '金額を選ぶ',
    themeDark: 'ダークモードにする',
    themeLight: 'ライトモードにする',
    install: 'インストール',
    installHelp: 'Yenlyをインストールするには、Safariの共有ボタンをタップし、「ホーム画面に追加」を選択してください。',
  },
}

const localeByLanguage = { fr: 'fr-FR', en: 'en-GB', ja: 'ja-JP' }
const currencyOptions = (language) => currencies
  .map(({ code, names }) => `<option value="${code}">${code} — ${names[language]}</option>`)
  .join('')

const app = document.querySelector('#app')

app.innerHTML = `
  <div class="page-shell">
    <header class="topbar">
      <a class="brand" href="#" aria-label="Yenly, accueil">
        <span class="brand-mark" aria-hidden="true">¥</span>
        <span>yenly<span class="brand-dot">.</span></span>
      </a>
      <div class="topbar-note"><span class="live-dot"></span> <span data-i18n="headerNote">Le change, en toute simplicité</span></div>
      <div class="topbar-actions">
        <div class="language-switch" role="group" aria-label="Langue">
          <button type="button" class="language-button is-active" data-language="fr" aria-pressed="true">FR</button>
          <button type="button" class="language-button" data-language="en" aria-pressed="false">EN</button>
          <button type="button" class="language-button" data-language="ja" aria-pressed="false">JP</button>
        </div>
        <button class="install-button" id="install" type="button" hidden><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg><span data-i18n="install">Installer</span></button>
        <button class="theme-toggle" id="theme-toggle" type="button" aria-pressed="false" aria-label="Activer le mode sombre" title="Activer le mode sombre">
          <svg class="sun-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.7"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
          <svg class="moon-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.2 15.1A8.6 8.6 0 0 1 8.9 3.8 8.7 8.7 0 1 0 20.2 15.1Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <a class="topbar-link" href="#convertisseur"><span data-i18n="convert">Convertir</span> <span aria-hidden="true">↗</span></a>
      </div>
    </header>

    <main>
      <section class="hero" aria-labelledby="page-title">
        <div class="hero-copy">
          <p class="eyebrow"><span class="eyebrow-line"></span> <span data-i18n="heroEyebrow">VOTRE COMPAGNON DE VOYAGE</span></p>
          <h1 id="page-title" data-i18n="heroTitle">Le Japon, à portée<br />de <span>conversion.</span></h1>
          <p class="hero-description" data-i18n="heroDescription">Un taux clair, un calcul instantané. Préparez votre prochain départ l’esprit léger.</p>
          <div class="hero-trust"><span aria-hidden="true">✦</span> <span data-i18n="heroTrust">Taux de change mis à jour en temps réel</span></div>
        </div>

        <div class="hero-art" aria-hidden="true">
          <div class="sun"></div>
          <div class="art-caption"><span>日本</span><span data-i18n="artLocation">JAPON · 35° 41' N</span></div>
          <svg class="mountain-art" viewBox="0 0 560 390" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M37 328 205 113l41 52 68-96 212 259H37Z" fill="#F8F3E9"/>
            <path d="m205 113 41 52 38-54-29-8-19-24-31 34Z" fill="#fffdf8"/>
            <path d="M0 328h560v62H0z" fill="#D9E7DD"/>
            <path d="M75 328c57-23 119-25 185-3 72 24 141 17 229-5" stroke="#B4CABB" stroke-width="2"/>
            <path d="M46 355c89-24 168-26 236-7 80 22 161 17 237-6" stroke="#B4CABB" stroke-width="2"/>
            <path d="M374 328c4-48 18-73 43-73s38 25 43 73" fill="#6D887A"/>
            <path d="M360 288c36-18 83-18 116 0M370 275c27-15 69-15 96 0M384 261c19-12 47-12 68 0" stroke="#F8F3E9" stroke-width="7" stroke-linecap="round"/>
            <path d="M421 255v73" stroke="#6D887A" stroke-width="3"/>
            <path d="M402 328c4-35 11-50 20-50s16 15 20 50" fill="#6D887A"/>
          </svg>
          <div class="art-stamp">旅<br /><span data-i18n="artStamp">VOYAGE</span></div>
        </div>
      </section>

      <section class="converter-section" id="convertisseur" aria-labelledby="converter-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow"><span class="eyebrow-line"></span> <span data-i18n="converterEyebrow">CONVERTISSEUR DE DEVISES</span></p>
            <h2 id="converter-title" data-i18n="converterTitle">Combien vaut votre yen ?</h2>
          </div>
          <div class="update-chip"><span class="live-dot"></span><span id="rate-status">Récupération des taux…</span></div>
        </div>

        <div class="converter-card">
          <div class="conversion-fields">
            <div class="currency-field">
              <label for="amount" data-i18n="sending">Vous envoyez</label>
              <div class="amount-row">
                <input id="amount" type="text" value="10000" inputmode="decimal" enterkeyhint="done" autocapitalize="off" autocomplete="off" spellcheck="false" aria-label="Montant à convertir" />
                <span class="currency-flag" id="from-flag" aria-hidden="true">🇯🇵</span>
                <select id="from-currency" aria-label="Devise de départ"></select>
              </div>
              <p class="field-hint" id="from-name">Yen japonais</p>
            </div>

            <button class="swap-button" id="swap" type="button" aria-label="Inverser les devises" title="Inverser les devises">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 7h12m0 0-3-3m3 3-3 3M17 17H5m0 0 3 3m-3-3 3-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>

            <div class="currency-field result-field">
              <label for="to-currency" data-i18n="receiving">Vous recevez environ</label>
              <div class="amount-row">
                <output id="result" aria-live="polite">—</output>
                <span class="currency-flag" id="to-flag" aria-hidden="true">🇪🇺</span>
                <select id="to-currency" aria-label="Devise d’arrivée"></select>
              </div>
              <p class="field-hint" id="to-name">Euro</p>
            </div>
          </div>

          <div class="converter-divider"></div>
          <div class="converter-bottom">
            <div class="rate-line"><span class="rate-icon" aria-hidden="true">↗</span><span id="rate-line">Chargement du taux…</span></div>
            <button class="refresh-button" id="refresh" type="button"><span aria-hidden="true">↻</span> <span data-i18n="update">Actualiser</span></button>
          </div>
          <p class="error-message" id="error-message" role="alert" hidden></p>
        </div>

        <div class="quick-amounts" aria-label="Montants rapides">
          <span data-i18n="tryWith">Essayez avec</span>
          <button type="button" data-amount="10000">¥10 000</button>
          <button type="button" data-amount="50000">¥50 000</button>
          <button type="button" data-amount="100000">¥100 000</button>
        </div>
      </section>

      <footer class="footer"><span data-i18n="footerMade">Fait avec soin pour vos voyages.</span><span data-i18n="footerDisclaimer">Les taux sont indicatifs et peuvent varier.</span></footer>
    </main>
  </div>
`

const amountInput = document.querySelector('#amount')
const fromSelect = document.querySelector('#from-currency')
const toSelect = document.querySelector('#to-currency')
const resultOutput = document.querySelector('#result')
const fromFlag = document.querySelector('#from-flag')
const toFlag = document.querySelector('#to-flag')
const fromName = document.querySelector('#from-name')
const toName = document.querySelector('#to-name')
const rateLine = document.querySelector('#rate-line')
const rateStatus = document.querySelector('#rate-status')
const errorMessage = document.querySelector('#error-message')
const refreshButton = document.querySelector('#refresh')
const swapButton = document.querySelector('#swap')
const quickAmountButtons = document.querySelectorAll('[data-amount]')
const languageButtons = document.querySelectorAll('[data-language]')
const translatableElements = document.querySelectorAll('[data-i18n]')
const languageSwitch = document.querySelector('.language-switch')
const metaDescription = document.querySelector('meta[name="description"]')
const brandLink = document.querySelector('.brand')
const quickAmounts = document.querySelector('.quick-amounts')
const themeToggle = document.querySelector('#theme-toggle')
const installButton = document.querySelector('#install')
const themeColorMeta = document.querySelector('meta[name="theme-color"]')
const appleStatusMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
let rates = null
let ratesDate = null
let ratesBase = null
let currentLanguage = 'fr'
let ratesError = null
let activeRateRequest = null
let rateRequestId = 0
let installPrompt = null
let hasExplicitThemePreference = false

function getInitialTheme() {
  try {
    const savedTheme = localStorage.getItem('yenly-theme')
    if (savedTheme === 'light' || savedTheme === 'dark') {
      hasExplicitThemePreference = true
      return savedTheme
    }
  } catch (error) {
    console.warn('Yenly could not read the saved theme preference.', error)
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function setTheme(theme, persist = false) {
  document.documentElement.dataset.theme = theme
  themeColorMeta.content = theme === 'dark' ? '#171d19' : '#f8f8f5'
  appleStatusMeta.content = theme === 'dark' ? 'black-translucent' : 'default'
  themeToggle.setAttribute('aria-pressed', String(theme === 'dark'))

  const labelKey = theme === 'dark' ? 'themeLight' : 'themeDark'
  themeToggle.setAttribute('aria-label', translations[currentLanguage][labelKey])
  themeToggle.title = translations[currentLanguage][labelKey]

  if (persist) {
    try {
      localStorage.setItem('yenly-theme', theme)
      hasExplicitThemePreference = true
    } catch (error) {
      console.warn('Yenly could not save the theme preference.', error)
    }
  }
}

fromSelect.value = 'JPY'
toSelect.value = 'EUR'

function getCurrency(code) {
  return currencies.find((currency) => currency.code === code)
}

function formatNumber(value, currency, maximumFractionDigits = 2) {
  return new Intl.NumberFormat(localeByLanguage[currentLanguage], {
    style: 'currency',
    currency,
    minimumFractionDigits: Math.min(2, maximumFractionDigits),
    maximumFractionDigits,
  }).format(value)
}

function getNumberSymbols(language) {
  const parts = new Intl.NumberFormat(localeByLanguage[language]).formatToParts(12345.6)
  return {
    group: parts.find((part) => part.type === 'group')?.value,
    decimal: parts.find((part) => part.type === 'decimal')?.value || '.',
  }
}

function parseLocalizedNumber(value, language) {
  const trimmedValue = value.trim()
  if (!trimmedValue) return Number.NaN

  const { group, decimal } = getNumberSymbols(language)
  let normalized = trimmedValue.replace(/[\s\u00a0\u202f\u2009']/g, '')
  if (group && group !== decimal) normalized = normalized.split(group).join('')

  if (decimal !== '.') {
    if (normalized.includes(decimal)) {
      normalized = normalized.replace(decimal, '.')
    }
  }

  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(normalized)) return Number.NaN
  return Number(normalized)
}

function formatAmount(value, language, useGrouping = true) {
  return new Intl.NumberFormat(localeByLanguage[language], {
    useGrouping,
    maximumFractionDigits: 6,
  }).format(value)
}

function renderConversion() {
  const amount = parseLocalizedNumber(amountInput.value, currentLanguage)
  const from = fromSelect.value
  const to = toSelect.value
  const fromCurrency = getCurrency(from)
  const toCurrency = getCurrency(to)

  fromFlag.textContent = fromCurrency.flag
  toFlag.textContent = toCurrency.flag
  fromName.textContent = fromCurrency.names[currentLanguage]
  toName.textContent = toCurrency.names[currentLanguage]

  if (!Number.isFinite(amount) || amount < 0) {
    resultOutput.textContent = '—'
    rateLine.textContent = translations[currentLanguage].amountInvalid
    return
  }

  if (!rates) {
    resultOutput.textContent = '—'
    rateLine.textContent = ratesError
      ? translations[currentLanguage].rateUnavailable
      : translations[currentLanguage].rateLoading
    return
  }

  if (ratesBase !== from || !Number.isFinite(rates[to])) {
    resultOutput.textContent = '—'
    rateLine.textContent = translations[currentLanguage].rateLoading
    return
  }

  const convertedAmount = amount * rates[to]
  const exchangeRate = rates[to]
  const resultDigits = new Intl.NumberFormat(localeByLanguage[currentLanguage], {
    style: 'currency',
    currency: to,
  }).resolvedOptions().maximumFractionDigits
  resultOutput.textContent = formatNumber(convertedAmount, to, resultDigits)
  rateLine.textContent = `1 ${from} = ${new Intl.NumberFormat(localeByLanguage[currentLanguage], {
    maximumSignificantDigits: 6,
  }).format(exchangeRate)} ${to}`
}

function updateRateStatus() {
  const copy = translations[currentLanguage]
  if (ratesError) {
    rateStatus.textContent = copy.unavailable
  } else if (!rates) {
    rateStatus.textContent = copy.loading
  } else {
    rateStatus.textContent = `${copy.refreshed} · ${new Intl.DateTimeFormat(localeByLanguage[currentLanguage], {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Paris',
    }).format(ratesDate)}`
  }
}

function setLanguage(language) {
  const currentAmount = parseLocalizedNumber(amountInput.value, currentLanguage)
  currentLanguage = language
  const copy = translations[language]
  if (Number.isFinite(currentAmount) && currentAmount >= 0) {
    amountInput.value = formatAmount(currentAmount, language, document.activeElement !== amountInput)
  }
  document.documentElement.lang = language
  amountInput.lang = localeByLanguage[language]
  amountInput.inputMode = 'decimal'
  document.title = copy.pageTitle
  metaDescription.content = copy.description
  brandLink.setAttribute('aria-label', copy.brand)
  quickAmounts.setAttribute('aria-label', copy.quickAmounts)

  translatableElements.forEach((element) => {
    const key = element.dataset.i18n
    element.innerHTML = copy[key]
  })

  const selectedFrom = fromSelect.value || 'JPY'
  const selectedTo = toSelect.value || 'EUR'
  fromSelect.innerHTML = currencyOptions(language)
  toSelect.innerHTML = currencyOptions(language)
  fromSelect.value = selectedFrom
  toSelect.value = selectedTo
  swapButton.setAttribute('aria-label', copy.swap)
  swapButton.title = copy.swap
  languageSwitch.setAttribute('aria-label', copy.languages)
  amountInput.setAttribute('aria-label', copy.amountAccessible)
  fromSelect.setAttribute('aria-label', copy.fromCurrency)
  toSelect.setAttribute('aria-label', copy.toCurrency)
  languageButtons.forEach((button) => {
    const active = button.dataset.language === language
    button.classList.toggle('is-active', active)
    button.setAttribute('aria-pressed', String(active))
  })
  quickAmountButtons.forEach((button) => {
    const formattedAmount = formatAmount(Number(button.dataset.amount), language, true)
    button.textContent = language === 'fr' ? `${formattedAmount} ¥` : `¥${formattedAmount}`
  })
  setTheme(document.documentElement.dataset.theme || 'light')
  if (ratesError) {
    errorMessage.textContent = copy.error.replace('{detail}', ratesError)
  }
  updateRateStatus()
  renderConversion()
}

async function loadRates() {
  if (activeRateRequest) activeRateRequest.abort()
  const controller = new AbortController()
  activeRateRequest = controller
  const requestId = ++rateRequestId
  const requestedBase = fromSelect.value

  rates = null
  ratesDate = null
  ratesBase = null
  ratesError = null
  refreshButton.disabled = true
  errorMessage.hidden = true
  updateRateStatus()
  renderConversion()

  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${requestedBase}`, {
      signal: controller.signal,
    })
    if (!response.ok) {
      throw new Error(`Le service a répondu avec le statut ${response.status}.`)
    }

    const data = await response.json()
    if (
      data.result !== 'success'
      || data.base_code !== requestedBase
      || !data.rates
      || !data.time_last_update_utc
    ) {
      throw new Error('Le service de taux a renvoyé une réponse invalide.')
    }

    const newRates = data.rates
    if (!currencies.every(({ code }) => Number.isFinite(newRates[code]) && newRates[code] > 0)) {
      throw new Error('Le service ne fournit pas tous les taux nécessaires.')
    }

    if (requestId !== rateRequestId) return
    rates = newRates
    ratesDate = new Date(data.time_last_update_utc)
    ratesBase = requestedBase
    updateRateStatus()
    renderConversion()
  } catch (error) {
    if (requestId !== rateRequestId || error.name === 'AbortError') return
    ratesError = error.message
    rates = null
    ratesDate = null
    ratesBase = null
    updateRateStatus()
    errorMessage.textContent = translations[currentLanguage].error.replace('{detail}', ratesError)
    errorMessage.hidden = false
    resultOutput.textContent = '—'
    rateLine.textContent = translations[currentLanguage].rateUnavailable
  } finally {
    if (requestId === rateRequestId) {
      activeRateRequest = null
      refreshButton.disabled = false
    }
  }
}

themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
  setTheme(nextTheme, true)
})

const colorSchemePreference = window.matchMedia('(prefers-color-scheme: dark)')
colorSchemePreference.addEventListener?.('change', (event) => {
  if (!hasExplicitThemePreference) setTheme(event.matches ? 'dark' : 'light')
})

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault()
  installPrompt = event
  installButton.hidden = false
})

window.addEventListener('appinstalled', () => {
  installPrompt = null
  installButton.hidden = true
})

const isIosDevice = /iPhone|iPad|iPod/.test(navigator.userAgent)
  || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
if (isIosDevice && !window.matchMedia('(display-mode: standalone)').matches) {
  installButton.hidden = false
}

installButton.addEventListener('click', async () => {
  if (!installPrompt) {
    window.alert(translations[currentLanguage].installHelp)
    return
  }

  await installPrompt.prompt()
  await installPrompt.userChoice
  installPrompt = null
  installButton.hidden = true
})

setTheme(getInitialTheme())

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .catch((error) => console.error('Yenly could not register its offline app service.', error))
  })
}

languageButtons.forEach((button) => {
  button.addEventListener('click', () => setLanguage(button.dataset.language))
})
amountInput.addEventListener('input', renderConversion)
amountInput.addEventListener('focus', () => {
  const amount = parseLocalizedNumber(amountInput.value, currentLanguage)
  if (!Number.isFinite(amount)) return

  const selectionStart = amountInput.selectionStart ?? amountInput.value.length
  const selectionEnd = amountInput.selectionEnd ?? selectionStart
  const digitsBeforeStart = (amountInput.value.slice(0, selectionStart).match(/\d/g) || []).length
  const digitsBeforeEnd = (amountInput.value.slice(0, selectionEnd).match(/\d/g) || []).length
  amountInput.value = formatAmount(amount, currentLanguage, false)

  const positionForDigitCount = (digitCount) => {
    if (digitCount === 0) return 0
    let digitsSeen = 0
    for (let index = 0; index < amountInput.value.length; index += 1) {
      if (/\d/.test(amountInput.value[index])) digitsSeen += 1
      if (digitsSeen === digitCount) return index + 1
    }
    return amountInput.value.length
  }

  amountInput.setSelectionRange(positionForDigitCount(digitsBeforeStart), positionForDigitCount(digitsBeforeEnd))
})
amountInput.addEventListener('blur', () => {
  const amount = parseLocalizedNumber(amountInput.value, currentLanguage)
  if (Number.isFinite(amount) && amount >= 0) {
    amountInput.value = formatAmount(amount, currentLanguage)
  }
})
fromSelect.addEventListener('change', loadRates)
toSelect.addEventListener('change', loadRates)
swapButton.addEventListener('click', () => {
  swapButton.classList.toggle('is-swapped')
  const previousFrom = fromSelect.value
  fromSelect.value = toSelect.value
  toSelect.value = previousFrom
  loadRates()
})
quickAmountButtons.forEach((button) => {
  button.addEventListener('click', () => {
    amountInput.value = button.dataset.amount
    renderConversion()
  })
})
refreshButton.addEventListener('click', loadRates)

setLanguage(currentLanguage)
loadRates()
