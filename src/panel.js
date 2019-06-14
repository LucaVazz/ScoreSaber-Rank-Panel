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


/*
 * icons taken from https://ionicons.com/
 *             Copyright (c) 2015-present Ionic (http://ionic.io/)
 */
const ICON_UP = '<path d="M345.6 128l51.3 51.3-109.3 109.4-89.6-89.6L32 365.4 63.6 397 198 262.5l89.6 89.7 141.1-141 51.3 51.3V128H345.6z"/>'
const ICON_DOWN = '<path d="M480 397V262.5l-51.3 51.3-141.1-141-89.6 89.7L63.6 128 32 159.6l166 166.3 89.6-89.7 109.3 109.4-51.3 51.4H480z"/>'


// Functions:
function fetchData() {
    rlog('Fetching ScoreSaber-Data...')

    return getScoresaberData(scoresaberId)
        .then(data => {
            let {
                globalRank, globalRankInt, globalRankChangeToday, globalRankChangeWeek,
                isGlobalRankChangeTodayUp, isGlobalRankChangeWeekUp,
                country, countryRank, pp
            } = data

            // calculate and format global percnetile
            let globalPercentile = globalRankInt / state.globalScoreSaberCount * 100
            rlog(globalRankInt)
            rlog(state.globalScoreSaberCount)
            globalPercentile = globalPercentile.toFixed(2)

            // insert in site:
            globalRankValueEl.innerText = globalRank
            globalRankPercentileEl.innerText = globalPercentile
            globalRankChangeTodayEl.innerText = globalRankChangeToday
            globalRankChangeTodayIconEl.innerHTML = (isGlobalRankChangeTodayUp ? ICON_UP : ICON_DOWN)
            globalRankChangeWeekEl.innerText = globalRankChangeWeek
            globalRankChangeWeekIconEl.innerHTML = (isGlobalRankChangeWeekUp ? ICON_UP : ICON_DOWN)
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
            .then(() => {
                // setup continous refreshing:
                window.setInterval(() => {
                    if (state.isPlayingBeatSaber) {
                        fetchData().then(() => {})
                    }
                }, 60 * 1000)
            })
            .catch(err => {
                document.getElementById('load-splash-text').innerText = ':/'

                let msg = `Error in fetchData:\n${err.stack}`
                rlog(msg)
                document.getElementById('error-output').innerText = msg

                Sentry.captureException(err)
            })
        ;
    }
})
