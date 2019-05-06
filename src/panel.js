const DATA_URL = new URL('http://scoresaber-proxy.lucavazzano.eu/76561198047788587')
const PARSER = new DOMParser()

function fetchData() {
    return fetch(new Request(DATA_URL))
        .then(response => {
            if (!response.ok) {
                throw `HTTP error code ${response.status}`
            } else {
                return response.text()
            }
        })
        .then(text => PARSER.parseFromString(text, 'text/html'))
        .then(doc => {
            // Parse:
            let [rankLi, ppLi, playCountLi, ] = doc.querySelectorAll(
                '.content .columns .column:nth-child(2) > ul > li'
            )

            let [ , globalRank, globalCount, country, countryRank] = rankLi.innerHTML
                .match(/#([0-9,]+)\s*\/\s*#([0-9,]+).*country=([a-z]+).*#([0-9,]+)/s)
            ;

            let globalPercentile = toNumber(globalRank) / toNumber(globalCount) * 100

            let pp = ppLi.innerText.match(/[0-9,.]+/)[0]
            let playCount = playCountLi.innerText.match(/[0-9]+/)[0]

            let rankHistory = doc.querySelector('script:not([src])').innerText
                .match(/datasets:.*\[{.*data:.*\[([0-9,]+)/s)[1]
                .split(',')
                .map(v => (+v))
                .reverse()
            ;
            let globalRankChangeToday = rankHistory[1] - rankHistory[0]
            let isGlobalRankChangeTodayUp = (globalRankChangeToday >= 0)
            let globalRankChangeWeek = rankHistory[8] - rankHistory[0]
            let isGlobalRankChangeWeekUp = (globalRankChangeWeek >= 0)

            // Format:
            globalRank = toLocaleNumberString(globalRank)
            globalRankChangeToday = Math.abs(globalRankChangeToday).toLocaleString()
            globalRankChangeWeek = Math.abs(globalRankChangeWeek).toLocaleString()
            countryRank = toLocaleNumberString(countryRank)
            globalPercentile = globalPercentile.toFixed(2)
            pp = toLocaleNumberString(pp)

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
                `http://scoresaber.com/imports/flags/${country}.png`
            document.getElementById('pp-value').innerText = 
                pp

            document.getElementById('global-rank-change-today-icon').className =
                `icon ion-md-trending-${isGlobalRankChangeTodayUp ? 'up': 'down'}`
            document.getElementById('global-rank-change-week-icon').className =
                `icon ion-md-trending-${isGlobalRankChangeWeekUp ? 'up': 'down'}`
        })
    ;
}

const toNumber = (str) => (+str.replace(',', ''));
const toLocaleNumberString = (str) => toNumber(str).toLocaleString();



// Start-up:
fetchData()
    .then(() => {
        document.getElementById('load-splash').classList.add('hidden')
        document.getElementById('content').classList.remove('hidden')
    })
    .then(() => {
        // TODO: auto-refresh
    })
    .catch(err => {
        document.getElementById('load-splash-text').innerText = ':/'

        let msg = `Error in fetchData:\n${err.stack}`
        rlog(msg)
        document.getElementById('error-output').innerText = msg
    })
;
