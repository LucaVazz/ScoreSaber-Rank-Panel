import { getScoresaberData } from './scoresaber_lib.js'


// State Vars:
var isConfigured = false
var scoresaberId = undefined


// Element References:
var globalRankValueEl = document.getElementById('global-rank-value')
var globalRankPercentileEl = document.getElementById('global-rank-percentile')
var globalRankChangeTodayEl = document.getElementById('global-rank-change-today')
var globalRankChangeTodayIconEl = document.getElementById('global-rank-change-today-icon')
var globalRankChangeWeekEl = document.getElementById('global-rank-change-week')
var globalRankChangeWeekIconEl = document.getElementById('global-rank-change-week-icon')
var countryRankEl = document.getElementById('country-rank-value')
var flagImgEl = document.getElementById('flag-img')
var ppValueEl = document.getElementById('pp-value')

// constants
const ICON_UP = 'la-angle-up'
const ICON_DOWN = 'la-angle-down'


// Functions:
function fetchData() {
    return getScoresaberData(scoresaberId)
        .then(data => {
            let {
                globalRank, globalRankInt, globalRankChangeToday, globalRankChangeWeek,
                isGlobalRankChangeTodayUp, isGlobalRankChangeWeekUp,
                country, countryRank, pp
            } = data

            // calculate and format global percnetile
            let globalPercentile = globalRankInt / state.globalScoreSaberCount * 100
            if (globalPercentile < 0.01) {
                globalPercentile = 0.01 // to avoid showing `0.00%`
            }
            globalPercentile = globalPercentile.toFixed(2)

            // insert in site:
            globalRankValueEl.innerText = globalRank
            globalRankPercentileEl.innerText = globalPercentile
            globalRankChangeTodayEl.innerText = globalRankChangeToday
            globalRankChangeTodayIconEl.className = ['la', isGlobalRankChangeTodayUp ? ICON_UP : ICON_DOWN].join(' ')
            globalRankChangeWeekEl.innerText = globalRankChangeWeek
            globalRankChangeWeekIconEl.className = ['la', isGlobalRankChangeWeekUp ? ICON_UP : ICON_DOWN].join(' ')
            countryRankEl.innerText = countryRank
            flagImgEl.src = `flags/${country.toLowerCase()}.png`
            flagImgEl.title = `Country-Code: ${country.toUpperCase()}`
            ppValueEl.innerText = pp
        })
    ;
}


// Start-up:
Twitch.ext.configuration.onChanged(() => {
    let broadcasterConfigStr = Twitch.ext.configuration.broadcaster

    if (broadcasterConfigStr && !isConfigured) {
        // apply config:
        let [id, color, lang] = broadcasterConfigStr.content.split('|')
        if (!id || !color || !lang) {
            return // abort if wrong config string
        }

        scoresaberId = id
        content.style.setProperty('--accent-color', `#${color}`)

        if (lang === 'de') {
            document.querySelectorAll('span[data-translation-de]').forEach(el => {
                el.innerText = el.dataset.translationDe
            })
        }

        // get and display data:
        fetchData()
            .then(() => {
                document.getElementById('load-splash').classList.add('hidden')
                document.getElementById('content').classList.remove('hidden')
            })
            .catch(err => {
                document.getElementById('load-splash-text').innerText = ':/'

                let msg = `Error in fetchData:\n${err.stack}`
                document.getElementById('error-output').innerText = msg

                Sentry.captureException(err)
            })
        ;
    }
})
