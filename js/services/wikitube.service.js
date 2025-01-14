import { storageService } from "./util.service.js"

export const wtService = {
    getVideos,
    getWiki,
    clearHistory,
    getKeywords,
}

const YT_API_KEY = 'AIzaSyB_6u19ZnSR_5zv7HYgTJKw6qkPpnsREcg'

const WIKIS_STORAGE_KEY = 'wikisDB'
const VIDEOS_STORAGE_KEY = 'videosDB'

let gVideoMap = storageService.load(VIDEOS_STORAGE_KEY) || {}
let gWikiMap = storageService.load(WIKIS_STORAGE_KEY) || {}

const ytURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&videoEmbeddable=true&type=video&key=${YT_API_KEY}`
const wikiURL = 'https://en.wikipedia.org/w/api.php?&origin=*&action=query&list=search&format=json'

function getVideos(keyword) {
	if (gVideoMap[keyword]) {
		return Promise.resolve(gVideoMap[keyword])
	}

	return axios.get(`${ytURL}&q=${keyword}`)
        .then(({ data }) => {
            gVideoMap[keyword] = data.items.map(_getVideoInfo)
            storageService.save(VIDEOS_STORAGE_KEY, gVideoMap)
            return gVideoMap[keyword]
        })
}

function _getVideoInfo(video) {
	const { id, snippet } = video
	const { title, thumbnails } = snippet

	const videoId = id.videoId
	const thumbnail = thumbnails.default.url
	
    return { id: videoId, title, thumbnail }
}

function getWiki(keyword) {
	if (gWikiMap[keyword]) {
		return Promise.resolve(gWikiMap[keyword])
	}

	return axios.get(`${wikiURL}&srsearch=${keyword}`)
        .then(({ data }) => {
            gWikiMap[keyword] = data.query.search.slice(0, 5).map(_getWikiInfo)
            storageService.save(WIKIS_STORAGE_KEY, gWikiMap)
            return gWikiMap[keyword]
        })
}

function _getWikiInfo({ title, snippet }) {
	return { title, snippet }
}

function clearHistory() {
	gVideoMap = {}
	gWikiMap = {}
    
	storageService.save(VIDEOS_STORAGE_KEY, gVideoMap)
	storageService.save(WIKIS_STORAGE_KEY, gWikiMap)
}

function getKeywords() {
	return Object.keys(gVideoMap)
}
