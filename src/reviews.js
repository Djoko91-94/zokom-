import { isSupabaseConfigured, supabase } from './supabase.js'

const categoryDefinitions = [
  {
    value: 'restaurant',
    label: 'Restauration',
    subcategories: [
      { value: 'affordable', label: 'Abordable' },
      { value: 'halal', label: 'Halal' },
      { value: 'no-pork', label: 'Sans porc' },
      { value: 'african', label: 'Cuisine africaine' },
      { value: 'ramen', label: 'Ramen' },
      { value: 'other', label: 'Autre restauration' },
    ],
  },
  {
    value: 'shopping',
    label: 'Shopping & bonnes affaires',
    subcategories: [
      { value: 'thrift', label: 'Friperies' },
      { value: 'tax-free', label: 'Détaxe' },
      { value: 'pharmacy', label: 'Pharmacies' },
      { value: 'other', label: 'Autre shopping' },
    ],
  },
  {
    value: 'services',
    label: 'Services pratiques',
    subcategories: [
      { value: 'currency-exchange', label: 'Bureaux de change' },
      { value: 'foreign-atm', label: 'Distributeurs pour cartes étrangères' },
      { value: 'pocket-wifi', label: 'Pocket Wi-Fi' },
      { value: 'esim', label: 'eSIM' },
      { value: 'other', label: 'Autre service' },
    ],
  },
  {
    value: 'visits',
    label: 'Lieux à visiter',
    subcategories: [
      { value: 'neighborhood', label: 'Quartiers' },
      { value: 'other', label: 'Autre lieu à visiter' },
    ],
  },
]

const setupMessage = document.querySelector('#review-setup-message')
const app = document.querySelector('#review-app')
const placeSearch = document.querySelector('#place-search')
const categoryFilter = document.querySelector('#category-filter')
const subcategoryFilter = document.querySelector('#subcategory-filter')
const areaFilter = document.querySelector('#area-filter')
const placeSort = document.querySelector('#place-sort')
const directoryStatus = document.querySelector('#directory-status')
const placeList = document.querySelector('#place-list')
const selectedPlacePanel = document.querySelector('#selected-place-panel')
const selectedPlaceName = document.querySelector('#selected-place-name')
const selectedPlaceNameJapanese = document.querySelector('#selected-place-name-ja')
const selectedPlaceAddress = document.querySelector('#selected-place-address')
const selectedPlaceBudget = document.querySelector('#selected-place-budget')
const selectedPlacePractical = document.querySelector('#selected-place-practical')
const selectedPlaceMaps = document.querySelector('#selected-place-maps')
const selectedPlaceWebsite = document.querySelector('#selected-place-website')
const selectedPlaceStatus = document.querySelector('#selected-place-status')
const reviewList = document.querySelector('#review-list')
const openReviewFormButton = document.querySelector('#open-review-form')
const closeSelectedPlaceButton = document.querySelector('#close-selected-place')
const signedOutPanel = document.querySelector('#signed-out-panel')
const signedInPanel = document.querySelector('#signed-in-panel')
const signedInLabel = document.querySelector('#signed-in-label')
const signOutButton = document.querySelector('#sign-out')
const authForm = document.querySelector('#auth-form')
const authModeButtons = document.querySelectorAll('[data-auth-mode]')
const displayNameField = document.querySelector('#display-name-field')
const displayNameInput = document.querySelector('#display-name')
const authPassword = document.querySelector('#auth-password')
const authSubmit = document.querySelector('#auth-submit')
const authStatus = document.querySelector('#auth-status')
const reviewForm = document.querySelector('#review-form')
const reviewSubmit = document.querySelector('#review-submit')
const reviewSubmitStatus = document.querySelector('#review-submit-status')
const moderatorPanel = document.querySelector('#moderator-panel')
const moderationList = document.querySelector('#moderation-list')
const moderationStatus = document.querySelector('#moderation-status')
const placeForm = document.querySelector('#place-form')
const placeSubmitStatus = document.querySelector('#place-submit-status')
const placeCategoryInput = document.querySelector('#place-category')
const placeSubcategoryInput = document.querySelector('#place-subcategory')

const state = {
  places: [],
  stats: new Map(),
  selectedPlace: null,
  session: null,
  authMode: 'signup',
  isModerator: false,
}

function setStatus(element, message, kind = 'info') {
  element.textContent = message
  element.dataset.status = kind
}

function createElement(tagName, className, text) {
  const element = document.createElement(tagName)
  if (className) element.className = className
  if (text !== undefined) element.textContent = text
  return element
}

function formatReviewCount(count) {
  return new Intl.NumberFormat('fr-FR').format(count)
}

function getPriceDetails(place) {
  const minimum = place.price_min_jpy === null || place.price_min_jpy === undefined
    ? null
    : Number(place.price_min_jpy)
  const maximum = place.price_max_jpy === null || place.price_max_jpy === undefined
    ? null
    : Number(place.price_max_jpy)

  if (Number.isSafeInteger(minimum) && Number.isSafeInteger(maximum) && maximum >= minimum) {
    return {
      label: `Prix : ¥${formatReviewCount(minimum)} – ¥${formatReviewCount(maximum)} / personne`,
      amount: Math.round((minimum + maximum) / 2),
      convertLabel: 'Convertir le prix moyen',
    }
  }

  const legacyBudget = place.budget_jpy === null || place.budget_jpy === undefined
    ? null
    : Number(place.budget_jpy)
  if (Number.isSafeInteger(legacyBudget) && legacyBudget >= 0) {
    return {
      label: `Budget indicatif : ¥${formatReviewCount(legacyBudget)} / personne`,
      amount: legacyBudget,
      convertLabel: 'Convertir ce budget',
    }
  }

  return null
}

function getMapsUrl(place) {
  const savedMapsUrl = safeExternalUrl(place.maps_url)
  if (savedMapsUrl) return savedMapsUrl

  const query = [place.name_ja, place.name, place.address, place.neighborhood]
    .filter(Boolean)
    .join(' ')
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

function createPlacePracticalInfo(place) {
  const entries = [
    ['Horaires', place.opening_hours],
    ['Métro', place.nearest_station],
  ].filter(([, value]) => value)
  if (entries.length === 0) return null

  const info = createElement('div', 'place-practical-info')
  entries.forEach(([label, value]) => {
    const row = createElement('p')
    row.append(createElement('strong', '', `${label} : `), document.createTextNode(value))
    info.append(row)
  })
  return info
}

function updatePlacePrice(element, place) {
  const price = getPriceDetails(place)
  element.hidden = !price
  element.replaceChildren()
  if (!price) return

  const label = createElement('span', '', price.label)
  const convertLink = createElement('a', '', price.convertLabel)
  convertLink.href = `/?amount=${encodeURIComponent(price.amount)}`
  element.append(label, convertLink)
}

function getCategoryDefinition(category) {
  return categoryDefinitions.find((definition) => definition.value === category)
}

function getCategoryLabel(category) {
  return getCategoryDefinition(category)?.label || 'Autre'
}

function getSubcategoryLabel(category, subcategory) {
  return getCategoryDefinition(category)?.subcategories
    .find((definition) => definition.value === subcategory)?.label || 'Autre'
}

function populateSubcategoryFilter() {
  const selectedCategory = categoryFilter.value
  const selectedValue = subcategoryFilter.value
  const definitions = selectedCategory
    ? [getCategoryDefinition(selectedCategory)].filter(Boolean)
    : categoryDefinitions
  const options = definitions.flatMap((category) => category.subcategories.map((subcategory) => ({
    value: `${category.value}:${subcategory.value}`,
    label: selectedCategory ? subcategory.label : `${category.label} · ${subcategory.label}`,
  })))

  subcategoryFilter.replaceChildren(
    new Option('Tous les types', ''),
    ...options.map((option) => new Option(option.label, option.value)),
  )
  if (options.some((option) => option.value === selectedValue)) {
    subcategoryFilter.value = selectedValue
  }
}

function populatePlaceSubcategories(category, selectedValue = '') {
  const definition = getCategoryDefinition(category)
  const subcategories = definition?.subcategories || []
  placeSubcategoryInput.replaceChildren(
    ...subcategories.map((subcategory) => new Option(subcategory.label, subcategory.value)),
  )
  placeSubcategoryInput.value = subcategories.some((subcategory) => subcategory.value === selectedValue)
    ? selectedValue
    : subcategories[0]?.value || ''
}

function safeExternalUrl(value) {
  if (!value) return null

  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
      ? url.href
      : null
  } catch {
    return null
  }
}

function makeExternalLink(url, label, className = '') {
  const safeUrl = safeExternalUrl(url)
  if (!safeUrl) return null

  const link = createElement('a', className, label)
  link.href = safeUrl
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  return link
}

function renderPlaceCard(place) {
  const stats = state.stats.get(place.id) || { review_count: 0, average_rating: null }
  const card = createElement('article', 'place-card')
  const top = createElement('div', 'place-card-top')
  const label = createElement('span', 'directory-card-label', `${getCategoryLabel(place.category)} · ${getSubcategoryLabel(place.category, place.subcategory)}`)
  const neighborhood = createElement('span', 'place-neighborhood', place.neighborhood)
  const heading = createElement('h3', '', place.name)
  const japaneseName = place.name_ja ? createElement('p', 'place-name-ja', place.name_ja) : null
  const address = createElement('p', 'place-address', place.address)
  const description = createElement('p', 'place-description', place.description)
  const rating = createElement('p', 'place-rating')
  const stars = createElement('span', 'rating-stars')
  const ratingText = stats.average_rating === null
    ? 'Pas encore noté'
    : `${Number(stats.average_rating).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} / 5`
  const countText = `${formatReviewCount(Number(stats.review_count))} avis`
  const actions = createElement('div', 'place-card-actions')
  const selectButton = createElement('button', 'text-button', 'Lire les avis')

  top.append(label, neighborhood)
  if (japaneseName) japaneseName.lang = 'ja'
  stars.setAttribute('aria-hidden', 'true')
  stars.textContent = stats.average_rating === null
    ? '☆☆☆☆☆'
    : `${'★'.repeat(Math.round(Number(stats.average_rating)))}${'☆'.repeat(5 - Math.round(Number(stats.average_rating)))}`
  rating.append(stars, createElement('strong', '', ratingText), createElement('span', '', countText))
  selectButton.type = 'button'
  selectButton.addEventListener('click', () => selectPlace(place))
  actions.append(selectButton)

  const websiteLink = makeExternalLink(place.website_url, 'Site officiel ↗')
  const mapsLink = makeExternalLink(getMapsUrl(place), 'Voir sur Google Maps ↗')
  const reviewPreview = stats.latest_review
    ? createElement(
      'blockquote',
      'place-review-preview',
      `« ${stats.latest_review.length > 150 ? `${stats.latest_review.slice(0, 147).trimEnd()}…` : stats.latest_review} »`,
    )
    : null
  const price = createElement('p', 'place-budget')
  updatePlacePrice(price, place)
  const practicalInfo = createPlacePracticalInfo(place)

  if (mapsLink) actions.append(mapsLink)
  if (websiteLink) actions.append(websiteLink)

  const content = [top, heading]
  if (japaneseName) content.push(japaneseName)
  content.push(address, description)
  if (practicalInfo) content.push(practicalInfo)
  if (!price.hidden) content.push(price)
  card.append(...content, rating)
  if (reviewPreview) card.append(reviewPreview)
  card.append(actions)
  return card
}

function renderPlaces() {
  const search = placeSearch.value.trim().toLocaleLowerCase('fr-FR')
  const category = categoryFilter.value
  const [subcategoryCategory, subcategory] = subcategoryFilter.value.split(':')
  const neighborhood = areaFilter.value
  const sortMode = placeSort.value
  const filteredPlaces = state.places
    .filter((place) => !category || place.category === category)
    .filter((place) => !subcategoryFilter.value
      || (place.category === subcategoryCategory && place.subcategory === subcategory))
    .filter((place) => !neighborhood || place.neighborhood === neighborhood)
    .filter((place) => {
      if (!search) return true
      return `${place.name} ${place.name_ja || ''} ${place.neighborhood} ${place.address} ${place.description} ${place.opening_hours || ''} ${place.nearest_station || ''} ${getCategoryLabel(place.category)} ${getSubcategoryLabel(place.category, place.subcategory)}`
        .toLocaleLowerCase('fr-FR')
        .includes(search)
    })
    .sort((first, second) => {
      const firstStats = state.stats.get(first.id) || { review_count: 0, average_rating: 0 }
      const secondStats = state.stats.get(second.id) || { review_count: 0, average_rating: 0 }
      if (sortMode === 'reviews') {
        return secondStats.review_count - firstStats.review_count || first.name.localeCompare(second.name, 'fr')
      }
      if (sortMode === 'name') return first.name.localeCompare(second.name, 'fr')
      return (secondStats.average_rating || 0) - (firstStats.average_rating || 0)
        || secondStats.review_count - firstStats.review_count
        || first.name.localeCompare(second.name, 'fr')
    })

  placeList.replaceChildren(...filteredPlaces.map(renderPlaceCard))

  if (state.places.length === 0) {
    setStatus(directoryStatus, 'Aucune adresse n’a encore été publiée. Revenez bientôt pour découvrir la sélection de Yenly.')
  } else if (filteredPlaces.length === 0) {
    setStatus(directoryStatus, 'Aucune adresse ne correspond à cette recherche.')
  } else {
    setStatus(directoryStatus, `${formatReviewCount(filteredPlaces.length)} adresse${filteredPlaces.length > 1 ? 's' : ''} à découvrir`)
  }
}

function updateStarSelection(rating) {
  document.querySelectorAll('.star-rating-options label').forEach((label) => {
    const value = Number(label.querySelector('input').value)
    label.classList.toggle('is-selected', value <= rating)
  })
}

function populateNeighborhoodFilter() {
  const currentValue = areaFilter.value
  const neighborhoods = [...new Set(state.places.map((place) => place.neighborhood))]
    .sort((first, second) => first.localeCompare(second, 'fr'))
  const options = [new Option('Tous les quartiers', ''), ...neighborhoods.map((name) => new Option(name, name))]
  areaFilter.replaceChildren(...options)
  if (neighborhoods.includes(currentValue)) areaFilter.value = currentValue
}

async function loadDirectory() {
  setStatus(directoryStatus, 'Chargement des adresses…')

  const [placesResult, statsResult] = await Promise.all([
    supabase.from('places')
      .select('id, slug, name, name_ja, category, subcategory, budget_jpy, price_min_jpy, price_max_jpy, neighborhood, address, description, opening_hours, nearest_station, maps_url, website_url')
      .eq('status', 'published')
      .order('name', { ascending: true }),
    supabase.from('place_review_stats')
      .select('place_id, review_count, average_rating, latest_review'),
  ])

  if (placesResult.error) throw placesResult.error
  if (statsResult.error) throw statsResult.error

  state.places = placesResult.data
  state.stats = new Map(statsResult.data.map((item) => [item.place_id, item]))
  populateNeighborhoodFilter()
  renderPlaces()
}

function renderReview(review) {
  const card = createElement('article', 'review-card')
  const header = createElement('div', 'review-card-header')
  const name = review.profiles?.display_name || 'Voyageur'
  const author = createElement('strong', '', name)
  const rating = createElement('span', 'rating-stars')
  const date = createElement('time', 'review-date')
  const title = createElement('h4', '', review.title)
  const body = createElement('p', '', review.body)
  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(review.created_at))

  rating.textContent = `${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}`
  rating.setAttribute('aria-label', `${review.rating} sur 5 étoiles`)
  date.dateTime = review.created_at
  date.textContent = formattedDate
  header.append(author, rating, date)
  card.append(header, title, body)
  return card
}

async function loadSelectedReviews() {
  if (!state.selectedPlace) return

  setStatus(selectedPlaceStatus, 'Chargement des avis…')
  const { data, error } = await supabase.from('reviews')
    .select('id, author_id, rating, title, body, status, created_at, profiles(display_name)')
    .eq('place_id', state.selectedPlace.id)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error

  const approvedReviews = data.filter((review) => review.status === 'approved')
  const ownPendingReview = data.find((review) => (
    review.author_id === state.session?.user.id && review.status === 'pending'
  ))
  const ownRejectedReview = data.find((review) => (
    review.author_id === state.session?.user.id && review.status === 'rejected'
  ))
  reviewList.replaceChildren(...approvedReviews.map(renderReview))

  if (ownPendingReview) {
    setStatus(selectedPlaceStatus, 'Votre avis est en cours de vérification.')
  } else if (ownRejectedReview) {
    setStatus(selectedPlaceStatus, 'Votre précédent avis n’a pas été publié. Vous pouvez en envoyer un nouveau après l’avoir modifié.')
  } else if (approvedReviews.length === 0) {
    setStatus(selectedPlaceStatus, 'Pas encore d’avis publié pour cette adresse. Vous pouvez partager la première expérience.')
  } else {
    setStatus(selectedPlaceStatus, `${formatReviewCount(approvedReviews.length)} avis publié${approvedReviews.length > 1 ? 's' : ''}`)
  }
}

function updateSelectedPlace() {
  if (!state.selectedPlace) {
    selectedPlacePanel.hidden = true
    reviewForm.hidden = true
    return
  }

  selectedPlacePanel.hidden = false
  selectedPlaceName.textContent = state.selectedPlace.name
  selectedPlaceNameJapanese.textContent = state.selectedPlace.name_ja || ''
  selectedPlaceNameJapanese.hidden = !state.selectedPlace.name_ja
  selectedPlaceAddress.textContent = `${state.selectedPlace.neighborhood} · ${state.selectedPlace.address}`
  updatePlacePrice(selectedPlaceBudget, state.selectedPlace)
  selectedPlacePractical.replaceChildren()
  const practicalInfo = createPlacePracticalInfo(state.selectedPlace)
  if (practicalInfo) selectedPlacePractical.append(practicalInfo)
  selectedPlaceMaps.href = getMapsUrl(state.selectedPlace)
  selectedPlaceMaps.hidden = false
  const websiteUrl = safeExternalUrl(state.selectedPlace.website_url)
  selectedPlaceWebsite.hidden = !websiteUrl
  if (websiteUrl) {
    selectedPlaceWebsite.href = websiteUrl
  } else {
    selectedPlaceWebsite.removeAttribute('href')
  }
  reviewForm.hidden = !state.session
}

function selectPlace(place) {
  state.selectedPlace = place
  reviewForm.reset()
  updateStarSelection(0)
  setStatus(reviewSubmitStatus, '')
  updateSelectedPlace()
  void loadSelectedReviews().catch((error) => {
    console.error('Yenly could not load reviews for this place.', error)
    setStatus(selectedPlaceStatus, 'Impossible de charger les avis. Réessayez dans quelques instants.', 'error')
  })
  selectedPlacePanel.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function setAuthMode(mode) {
  state.authMode = mode
  const isSignup = mode === 'signup'
  displayNameField.hidden = !isSignup
  displayNameInput.required = isSignup
  authPassword.autocomplete = isSignup ? 'new-password' : 'current-password'
  authSubmit.textContent = isSignup ? 'Créer mon compte' : 'Se connecter'
  authModeButtons.forEach((button) => {
    const active = button.dataset.authMode === mode
    button.classList.toggle('is-active', active)
    button.setAttribute('aria-pressed', String(active))
  })
  setStatus(authStatus, '')
}

async function updateModeratorAccess() {
  state.isModerator = false
  moderatorPanel.hidden = true
  if (!state.session) return

  const { data, error } = await supabase.from('review_moderators')
    .select('user_id')
    .eq('user_id', state.session.user.id)
    .maybeSingle()

  if (error) {
    console.error('Yenly could not check moderator access.', error)
    setStatus(directoryStatus, 'Impossible de vérifier les droits de modération. Réessayez après vous être reconnecté.', 'error')
    return
  }

  state.isModerator = Boolean(data)
  moderatorPanel.hidden = !state.isModerator
  if (state.isModerator) await loadModerationQueue()
}

function updateAuthPanels() {
  const isSignedIn = Boolean(state.session)
  signedOutPanel.hidden = isSignedIn
  signedInPanel.hidden = !isSignedIn
  signedInLabel.textContent = state.session?.user.email || ''
  reviewForm.hidden = !isSignedIn || !state.selectedPlace
  openReviewFormButton.textContent = isSignedIn ? 'Écrire un avis' : 'Connectez-vous pour écrire un avis'
}

async function applySession(session) {
  state.session = session
  updateAuthPanels()
  await updateModeratorAccess()
  if (state.selectedPlace) await loadSelectedReviews()
}

async function submitAuth(event) {
  event.preventDefault()
  const formData = new FormData(authForm)
  const email = String(formData.get('email')).trim().toLowerCase()
  const password = String(formData.get('password'))

  authSubmit.disabled = true
  setStatus(authStatus, state.authMode === 'signup' ? 'Création du compte…' : 'Connexion…')

  try {
    if (state.authMode === 'signup') {
      const displayName = String(formData.get('displayName')).trim()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
          emailRedirectTo: `${window.location.origin}/guide/`,
        },
      })
      if (error) throw error

      if (data.session) {
        setStatus(authStatus, 'Votre compte est créé. Vous pouvez maintenant laisser un avis.')
      } else {
        setStatus(authStatus, 'Consultez votre boîte e-mail pour confirmer votre compte, puis connectez-vous.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      authForm.reset()
      setStatus(authStatus, 'Vous êtes connecté.')
    }
  } catch (error) {
    console.error('Yenly authentication failed.', error)
    setStatus(authStatus, error.message || 'Impossible de vous connecter. Vérifiez vos informations et réessayez.', 'error')
  } finally {
    authSubmit.disabled = false
  }
}

async function signOut() {
  signOutButton.disabled = true
  const { error } = await supabase.auth.signOut()
  signOutButton.disabled = false
  if (error) {
    console.error('Yenly could not sign out.', error)
    setStatus(authStatus, 'La déconnexion a échoué. Réessayez.', 'error')
  }
}

async function submitReview(event) {
  event.preventDefault()
  if (!state.session || !state.selectedPlace) return

  const formData = new FormData(reviewForm)
  const review = {
    place_id: state.selectedPlace.id,
    author_id: state.session.user.id,
    rating: Number(formData.get('rating')),
    title: String(formData.get('title')).trim(),
    body: String(formData.get('body')).trim(),
    status: 'pending',
  }

  reviewSubmit.disabled = true
  setStatus(reviewSubmitStatus, 'Envoi de votre avis…')

  try {
    const { error } = await supabase.from('reviews')
      .upsert(review, { onConflict: 'place_id,author_id' })
    if (error) throw error
  } catch (error) {
    console.error('Yenly could not submit the review.', error)
    const message = error.code === '23514'
      ? 'Vérifiez que le titre et le commentaire respectent les longueurs demandées.'
      : error.message || 'Impossible d’envoyer votre avis. Réessayez.'
    setStatus(reviewSubmitStatus, message, 'error')
    reviewSubmit.disabled = false
    return
  }

  reviewForm.reset()
  updateStarSelection(0)
  setStatus(reviewSubmitStatus, 'Merci ! Votre avis sera visible après validation.')
  try {
    await Promise.all([loadSelectedReviews(), loadDirectory()])
  } catch (error) {
    console.error('Yenly saved the review but could not refresh the directory.', error)
    setStatus(reviewSubmitStatus, 'Votre avis est enregistré. Actualisez la page pour voir les dernières informations.', 'error')
  } finally {
    reviewSubmit.disabled = false
  }
}

function renderModerationCard(review) {
  const card = createElement('article', 'moderation-card')
  const place = review.places?.name || 'Adresse inconnue'
  const neighborhood = review.places?.neighborhood || ''
  const category = review.places?.category
    ? `${getCategoryLabel(review.places.category)} · ${getSubcategoryLabel(review.places.category, review.places.subcategory)}`
    : ''
  const author = review.profiles?.display_name || 'Voyageur'
  const heading = createElement('h4', '', review.title)
  const details = createElement('p', 'moderation-meta', `${place} · ${category} · ${neighborhood} · ${author} · ${review.rating}/5`)
  const body = createElement('p', '', review.body)
  const actions = createElement('div', 'moderation-actions')
  const approveButton = createElement('button', 'primary-button', 'Approuver')
  const rejectButton = createElement('button', 'secondary-button', 'Refuser')

  approveButton.type = 'button'
  rejectButton.type = 'button'
  approveButton.addEventListener('click', () => updateReviewStatus(review.id, 'approved'))
  rejectButton.addEventListener('click', () => updateReviewStatus(review.id, 'rejected'))
  actions.append(approveButton, rejectButton)
  card.append(details, heading, body, actions)
  return card
}

async function loadModerationQueue() {
  setStatus(moderationStatus, 'Chargement des avis en attente…')
  const { data, error } = await supabase.from('reviews')
    .select('id, rating, title, body, created_at, profiles(display_name), places(name, category, subcategory, neighborhood)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Yenly could not load pending reviews.', error)
    setStatus(moderationStatus, 'Impossible de charger la file de modération.', 'error')
    return
  }

  moderationList.replaceChildren(...data.map(renderModerationCard))
  setStatus(moderationStatus, data.length
    ? `${formatReviewCount(data.length)} avis à vérifier`
    : 'Aucun avis en attente.')
}

async function updateReviewStatus(reviewId, status) {
  setStatus(moderationStatus, status === 'approved' ? 'Publication de l’avis…' : 'Refus de l’avis…')
  const { data, error } = await supabase.from('reviews')
    .update({ status })
    .eq('id', reviewId)
    .select('id')
    .maybeSingle()

  if (error) {
    console.error('Yenly could not moderate a review.', error)
    setStatus(moderationStatus, 'La mise à jour a échoué. Vérifiez vos droits puis réessayez.', 'error')
    return
  }
  if (!data) {
    setStatus(moderationStatus, 'Cet avis n’est plus disponible. Rechargez la file de modération.', 'error')
    return
  }

  try {
    await Promise.all([loadModerationQueue(), loadDirectory()])
    if (state.selectedPlace) await loadSelectedReviews()
  } catch (refreshError) {
    console.error('Yenly moderated the review but could not refresh the page.', refreshError)
    setStatus(moderationStatus, 'La décision est enregistrée. Actualisez la page pour voir les dernières informations.', 'error')
  }
}

function slugify(value) {
  return value.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function submitPlace(event) {
  event.preventDefault()
  if (!state.session || !state.isModerator) return

  const formData = new FormData(placeForm)
  const placeName = String(formData.get('name')).trim()
  const minimumPriceValue = String(formData.get('priceMinJpy') || '').trim()
  const maximumPriceValue = String(formData.get('priceMaxJpy') || '').trim()
  const minimumPrice = minimumPriceValue ? Number(minimumPriceValue) : null
  const maximumPrice = maximumPriceValue ? Number(maximumPriceValue) : null
  const nameJapanese = String(formData.get('nameJa')).trim()
  if (!nameJapanese) {
    setStatus(placeSubmitStatus, 'Ajoutez le nom japonais du lieu.', 'error')
    return
  }
  if ((minimumPrice === null) !== (maximumPrice === null)) {
    setStatus(placeSubmitStatus, 'Saisissez les deux bornes du prix, ou laissez les deux vides.', 'error')
    return
  }
  if (minimumPrice !== null && (
    !Number.isSafeInteger(minimumPrice)
    || !Number.isSafeInteger(maximumPrice)
    || minimumPrice < 0
    || maximumPrice > 2147483647
    || maximumPrice < minimumPrice
  )) {
    setStatus(placeSubmitStatus, 'Saisissez des prix entiers valides et vérifiez que le maximum est supérieur ou égal au minimum.', 'error')
    return
  }

  const websiteUrl = String(formData.get('websiteUrl')).trim()
  const mapsUrl = String(formData.get('mapsUrl')).trim()
  const place = {
    slug: `${slugify(placeName) || 'place'}-${crypto.randomUUID().slice(0, 8)}`,
    name: placeName,
    name_ja: nameJapanese,
    category: String(formData.get('category')),
    subcategory: String(formData.get('subcategory')),
    budget_jpy: null,
    price_min_jpy: minimumPrice,
    price_max_jpy: maximumPrice,
    neighborhood: String(formData.get('neighborhood')).trim(),
    address: String(formData.get('address')).trim(),
    description: String(formData.get('description')).trim(),
    opening_hours: String(formData.get('openingHours')).trim() || null,
    nearest_station: String(formData.get('nearestStation')).trim() || null,
    maps_url: mapsUrl || null,
    website_url: websiteUrl || null,
    source_url: String(formData.get('sourceUrl')).trim(),
    status: 'published',
    created_by: state.session.user.id,
  }

  const submitButton = placeForm.querySelector('button[type="submit"]')
  submitButton.disabled = true
  setStatus(placeSubmitStatus, 'Publication de l’adresse…')

  try {
    const { error } = await supabase.from('places').insert(place)
    if (error) throw error
  } catch (error) {
    console.error('Yenly could not publish the place.', error)
    setStatus(placeSubmitStatus, error.code === '23505'
      ? 'Une adresse avec ce nom existe déjà. Vérifiez le nom avant de réessayer.'
      : error.message || 'Impossible de publier cette adresse.', 'error')
    submitButton.disabled = false
    return
  }

  placeForm.reset()
  populatePlaceSubcategories(placeCategoryInput.value)
  setStatus(placeSubmitStatus, 'L’adresse est publiée et peut recevoir des avis.')
  try {
    await loadDirectory()
  } catch (error) {
    console.error('Yenly published the place but could not refresh the directory.', error)
    setStatus(placeSubmitStatus, 'L’adresse est publiée. Actualisez la page pour la voir dans le guide.', 'error')
  } finally {
    submitButton.disabled = false
  }
}

if (!isSupabaseConfigured) {
  setupMessage.hidden = false
} else {
  app.hidden = false

  placeSearch.addEventListener('input', renderPlaces)
  categoryFilter.addEventListener('change', () => {
    populateSubcategoryFilter()
    renderPlaces()
  })
  subcategoryFilter.addEventListener('change', renderPlaces)
  areaFilter.addEventListener('change', renderPlaces)
  placeSort.addEventListener('change', renderPlaces)
  authModeButtons.forEach((button) => {
    button.addEventListener('click', () => setAuthMode(button.dataset.authMode))
  })
  authForm.addEventListener('submit', submitAuth)
  signOutButton.addEventListener('click', signOut)
  reviewForm.addEventListener('submit', submitReview)
  reviewForm.addEventListener('reset', () => window.setTimeout(() => updateStarSelection(0), 0))
  document.querySelectorAll('.star-rating-options input').forEach((input) => {
    input.addEventListener('change', () => updateStarSelection(Number(input.value)))
  })
  placeForm.addEventListener('submit', submitPlace)
  placeCategoryInput.addEventListener('change', () => {
    populatePlaceSubcategories(placeCategoryInput.value)
  })
  closeSelectedPlaceButton.addEventListener('click', () => {
    state.selectedPlace = null
    updateSelectedPlace()
  })
  openReviewFormButton.addEventListener('click', () => {
    if (!state.session) {
      signedOutPanel.scrollIntoView({ behavior: 'smooth', block: 'center' })
      document.querySelector('#auth-email').focus()
      setStatus(authStatus, 'Connectez-vous ou créez un compte pour continuer.')
      return
    }
    reviewForm.hidden = false
    reviewForm.scrollIntoView({ behavior: 'smooth', block: 'center' })
    document.querySelector('#review-title').focus()
  })

  setAuthMode('signup')

  const query = new URLSearchParams(window.location.search)
  const requestedCategory = query.get('category')
  if (categoryDefinitions.some((category) => category.value === requestedCategory)) {
    categoryFilter.value = requestedCategory
  }
  populateSubcategoryFilter()
  const requestedSubcategory = query.get('subcategory')
  if ([...subcategoryFilter.options].some((option) => option.value === requestedSubcategory)) {
    subcategoryFilter.value = requestedSubcategory
  }
  populatePlaceSubcategories(placeCategoryInput.value, placeSubcategoryInput.value)

  void loadDirectory().catch((error) => {
    console.error('Yenly could not load the address directory.', error)
    setStatus(directoryStatus, 'Impossible de charger les adresses. Réessayez plus tard.', 'error')
  })

  void supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error('Yenly could not read the current session.', error)
      setStatus(authStatus, 'Impossible de vérifier votre connexion. Actualisez la page.', 'error')
      return
    }
    void applySession(data.session).catch((sessionError) => {
      console.error('Yenly could not load account data.', sessionError)
      setStatus(authStatus, 'Impossible de charger les informations du compte.', 'error')
    })
  })

  supabase.auth.onAuthStateChange((_event, session) => {
    window.setTimeout(() => {
      void applySession(session).catch((error) => {
        console.error('Yenly could not update the current account.', error)
        setStatus(authStatus, 'Impossible de mettre à jour les informations du compte.', 'error')
      })
    }, 0)
  })
}
