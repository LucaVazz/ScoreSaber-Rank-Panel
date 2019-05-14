/*
 * icons taken from https://ionicons.com/
 *             Copyright (c) 2015-present Ionic (http://ionic.io/)
 */
const ICON_UP = '<path d="M345.6 128l51.3 51.3-109.3 109.4-89.6-89.6L32 365.4 63.6 397 198 262.5l89.6 89.7 141.1-141 51.3 51.3V128H345.6z"/>'
const ICON_DOWN = '<path d="M480 397V262.5l-51.3 51.3-141.1-141-89.6 89.7L63.6 128 32 159.6l166 166.3 89.6-89.7 109.3 109.4-51.3 51.4H480z"/>'


function fetchData() {
    rlog('Fetching ScoreSaber-Data...')

    return scoresaber_getData('76561198047788587')
        .then(data => {
            let {
                globalRank, globalPercentile, globalRankChangeToday, globalRankChangeWeek,
                isGlobalRankChangeTodayUp, isGlobalRankChangeWeekUp,
                country, countryRank, pp
            } = data

            // Insert in site:
            document.getElementById('global-rank-value').innerText = 
                globalRank
            document.getElementById('global-rank-percentile').innerText = 
                globalPercentile
            document.getElementById('global-rank-change-today').innerText = 
                globalRankChangeToday
            document.getElementById('global-rank-change-week').innerText = 
                globalRankChangeWeek
            document.getElementById('country-rank-value').innerText = 
                countryRank
            document.getElementById('flag-img').src =
                `flags/${country.toLowerCase()}.png`
            document.getElementById('flag-img').title =
                `Country-Code: ${country.toUpperCase()}`
            document.getElementById('pp-value').innerText = 
                pp

            document.getElementById('global-rank-change-today-icon').innerHTML =
                (isGlobalRankChangeTodayUp ? ICON_UP : ICON_DOWN)
            document.getElementById('global-rank-change-week-icon').innerHTML =
                (isGlobalRankChangeWeekUp ? ICON_UP : ICON_DOWN)
        })
    ;
}


// Start-up:
fetchData()
    .then(() => {
        document.getElementById('load-splash').classList.add('hidden')
        document.getElementById('content').classList.remove('hidden')
    })
    .then(() => {
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
    })
;
