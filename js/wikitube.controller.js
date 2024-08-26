// Needed for Modal Bonus
var gKeepResolve

function onInit() {
  const txt = 'Micky Mouse'
  document.querySelector('.search-input').value = txt
  searchAndRender(txt)
}

function searchAndRender(txt) {
  //Youtube
  getVideos(txt)
    .then((videos) => {
      const selectedVideoId = videos[0].id
      setVideoPlayer(selectedVideoId)
      renderVideos(videos)
      renderHistory()
    })

  //Wiki
  getWiki(txt).then((wikis) => {
    renderWikis(wikis)
  })

}

function renderVideos(videos) {
  const strHTMLs = videos.map(({ id, title, thumbnail }) => {
    return `
      <article onclick="onChangeVideo('${id}')" class="video-card">
          <img class="video-thumbnail" src="${thumbnail}" alt="">
          <h3 class="video-title">${title}</h3>
      </article>`
  })
  document.querySelector('.videos-container').innerHTML = strHTMLs.join('')
}

function setVideoPlayer(videoId) {
  document.querySelector('.main-video iframe').src = `https://www.youtube.com/embed/${videoId}`
}

function renderWikis(wikis) {
  const strHTMLs = wikis.map((wiki) => {
    return `
            <article class="wiki-result">
                <h3>
                  <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(wiki.title)}" target="_blank">
                    ${wiki.title}
                  </a>
                </h3>
                <p>
                    ...${wiki.snippet}...
                </p>
            
            </article>`
  })

  document.querySelector('.wiki-container').innerHTML = strHTMLs.join('')
}

function onChangeVideo(videoId) {
  setVideoPlayer(videoId)
}

function onSearch(ev) {
  ev.preventDefault()
  const txt = document.querySelector('.search-input').value
  if (!txt) return
  searchAndRender(txt)
}

function renderHistory() {
  const keywords = getKeywords()
  let strHTMLs = keywords
    .map(
      keyword =>
        `<span>${keyword}</span>`
    )

  if (keywords.length === 0) strHTMLs = 'No keywords to show'

  document.querySelector('.keywords-container').innerHTML = strHTMLs
}

function onClearHistory() {
  doConfirm().then(userRes => {
    if (userRes) {
      clearHistory()
      renderHistory()
    }
  })
}

function onOpenThemeModal() {
  askUser().then(color => {
    document.querySelector('body').style.backgroundColor = color
  })
}

function askUser() {
  document.querySelector('.modal').hidden = false
  return new Promise((resolve) => {
    gKeepResolve = resolve
  })
}

function onChangeTheme() {
  const color = document.querySelector('.change-theme').value
  gKeepResolve(color)
  document.querySelector('.modal').hidden = true
}

function onCloseModal() {
  document.querySelector('.modal').hidden = true
}

// For now wrapping the built-in confirm with a promise, 
// later we can use our own modal
function doConfirm(title = 'sure?') {
  const res = confirm(title)
  return Promise.resolve(res)
}
