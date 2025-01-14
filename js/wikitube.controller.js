import { wtService } from "./services/wikitube.service.js"

window.onInit = onInit
window.onChangeVideo = onChangeVideo
window.onSearch = onSearch
window.onClearHistory = onClearHistory
window.onOpenThemeModal = onOpenThemeModal
window.onChangeTheme = onChangeTheme
window.onCloseModal = onCloseModal

var gKeepResolve // Needed for Modal Bonus

function onInit() {
	const txt = 'Micky Mouse'
	document.querySelector('.search-input').value = txt
	searchAndRender(txt)
}

function searchAndRender(txt) {
	//Youtube
	wtService.getVideos(txt)
        .then(videos => {
            const selectedVideoId = videos[0]?.id
            if (!selectedVideoId) return alert('No matching results')

            loadVideo(selectedVideoId)
            renderVideoList(videos)
            renderHistory()
        })

	//Wiki
	wtService.getWiki(txt)
        .then(renderWikis)
}

function renderVideoList(videos) {
	const strHTMLs = videos.map(({ id, title, thumbnail }) => {
		return `
            <article onclick="onChangeVideo('${id}')" class="video-card">
                <img class="video-thumbnail" src="${thumbnail}" alt="Video thumbnail">
                <p class="video-title">${title}</p>
            </article>`
	})
	document.querySelector('.videos-container').innerHTML = strHTMLs.join('')
}

function loadVideo(videoId) {
	document.querySelector('.main-video iframe').src = `https://www.youtube.com/embed/${videoId}`
}

function renderWikis(wikis) {
	const strHTMLs = wikis.map(wiki => {
		const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(wiki.title)}`
		return `
            <article class="wiki-result">
                <h3><a href=${url} target="_blank">${wiki.title}</a></h3>
                <p>...${wiki.snippet}...</p>
            </article>`
	})
	document.querySelector('.wiki-container').innerHTML = strHTMLs.join('')
}

function onChangeVideo(videoId) {
	loadVideo(videoId)
}

function onSearch(ev) {
	ev.preventDefault()
	
    const txt = document.querySelector('.search-input').value
	if (!txt) return

	searchAndRender(txt)
}

function renderHistory() {
	const keywords = wtService.getKeywords()

	if (keywords.length === 0) var strHTMLs = 'No keywords to show'
	else strHTMLs = keywords.map(keyword => `<span>${keyword}</span>`)

	document.querySelector('.keywords-container').innerHTML = strHTMLs
}

function onClearHistory() {
	doConfirm()
        .then(userRes => {
            if (!userRes) return

            wtService.clearHistory()
            renderHistory()
        })
}

function onOpenThemeModal() {
	askUser()
        .then(color => document.querySelector('body').style.backgroundColor = color)
}

function askUser() {
	document.querySelector('.modal').hidden = false
	return new Promise(resolve => {
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
