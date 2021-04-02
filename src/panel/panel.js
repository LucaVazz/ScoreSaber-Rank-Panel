import { getScoresaberData } from './scoresaber_lib.js'
import {
	parseConfigStr, hookOnGlobalConfigChanged, hookOnAuthorized, hookOnContextChanged
} from './twitch-hooks_lib.js'


// Constants:
const ICON_UP = 'la-angle-up'
const ICON_DOWN = 'la-angle-down'

// State Vars:
var isConfigured = false
var scoresaberId = undefined
var globalScoreSaberCount = -1


// Element References:
const contentEl = document.getElementById('content')
const globalRankValueEl = document.getElementById('global-rank-value')
const globalRankPercentileEl = document.getElementById('global-rank-percentile')
const globalRankChangeTodayEl = document.getElementById('global-rank-change-today')
const globalRankChangeTodayIconEl = document.getElementById('global-rank-change-today-icon')
const globalRankChangeWeekEl = document.getElementById('global-rank-change-week')
const globalRankChangeWeekIconEl = document.getElementById('global-rank-change-week-icon')
const countryRankEl = document.getElementById('country-rank-value')
const flagImgEl = document.getElementById('flag-img')
const ppValueEl = document.getElementById('pp-value')
const globalStatEl = document.getElementById('global-rank-stat')
const countryStatEl = document.getElementById('country-rank-stat')
const ppStatEl = document.getElementById('pp-stat')
const inactiveNoteEl = document.getElementById('note-inactive')
const bannedNoteEl = document.getElementById('note-banned')


// Functions:
function fetchData() {
    return getScoresaberData(scoresaberId)
        .then(data => {
            // calculate and format global percentile
            let globalPercentile = data.globalRankInt / globalScoreSaberCount * 100
            if (globalPercentile < 0.01) {
                globalPercentile = 0.01 // to avoid showing `0.00%`
            }
            globalPercentile = globalPercentile.toFixed(2)

            // insert in site:
            globalRankValueEl.innerText = data.globalRank
            globalRankPercentileEl.innerText = globalPercentile
            globalRankChangeTodayEl.innerText = data.globalRankChangeToday
            globalRankChangeTodayIconEl.className = getRankChangeIcon(data.usGlobalRankChangeTodayUp)
            globalRankChangeWeekEl.innerText = data.globalRankChangeWeek
            globalRankChangeWeekIconEl.className = getRankChangeIcon(data.isGlobalRankChangeWeekUp)
            countryRankEl.innerText = data.countryRank
            flagImgEl.src = `flags/${data.country.toLowerCase()}.png`
            flagImgEl.title = `Country-Code: ${data.country.toUpperCase()}`
            ppValueEl.innerText = data.pp

            // hide stuff for inactive / banned users:
            if (data.isInactive) {
                globalStatEl.parentNode.removeChild(globalStatEl)
                countryStatEl.parentNode.removeChild(countryStatEl)
                inactiveNoteEl.style['display'] = 'block'
            }
            else if (data.isBanned) {
                globalStatEl.parentNode.removeChild(globalStatEl)
                countryStatEl.parentNode.removeChild(countryStatEl)
                ppStatEl.parentNode.removeChild(ppStatEl)
                bannedNoteEl.style['display'] = 'block'
            }
        })
    ;
}

function getRankChangeIcon(isUp) {
    return ['la', isUp ? ICON_UP : ICON_DOWN].join(' ')
}


// Start-up:
hookOnAuthorized()
hookOnContextChanged()
hookOnGlobalConfigChanged((globalConf) => {
    globalScoreSaberCount = globalConf.globalCount

    let broadcasterConfig = Twitch.ext.configuration.broadcaster

    if (broadcasterConfig && !isConfigured) {
        // apply config:
        let color, lang
        [scoresaberId, color, lang] = parseConfigStr(broadcasterConfig, [null, null, null])
        if (!scoresaberId) { return /* abort if wrong config string */ }

        contentEl.style.setProperty('--accent-color', `#${color}`)

        if (lang === 'de') {
            document.querySelectorAll('*[data-translation-de]').forEach(el => {
                el.innerText = el.dataset.translationDe
            })
        }

        // get and display data:
        fetchData()
            .then(() => {
                document.getElementById('load-splash').classList.add('hidden')
                contentEl.classList.remove('hidden')
            })
            .catch(err => {
                document.getElementById('load-splash-text').innerText = ':/'

                if (err.code) {
                    if (err.code === 404) {
                        document.getElementById('note-error-not-found').style['display'] = 'block'
                        return
                    } else if (err.code === 429) {
                        document.getElementById('note-error-rate-limit').style['display'] = 'block'
                        return
                    }
                }

                document.getElementById('note-error').style['display'] = 'block'

                Sentry.captureException(err)
            })
        ;
    }
})
