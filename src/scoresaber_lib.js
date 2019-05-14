const SCORESABER_DATA_URL = new URL('https://scoresaber-proxy.lucavazzano.eu')
const SCORESABER_PARSER = new DOMParser()


const _toNumber = (str) => (+str.replace(',', ''));
const _toLocaleNumberString = (str) => _toNumber(str).toLocaleString();


function _scoresaber_fetch(id) {
    let targetUrl = new URL(id, SCORESABER_DATA_URL)
    return fetch(new Request(targetUrl))
        .then(response => {
            if (!response.ok) {
                throw `HTTP error code ${response.status}`
            } else {
                return response.text()
            }
        })
    ;
}

function _scoresaber_parse(text) {
    // Find Elements:
    let doc = SCORESABER_PARSER.parseFromString(text, 'text/html')
    let dataSectionSelector = '.content .columns .column:nth-child(2)'

    let nameLink = doc.querySelector(
        `${dataSectionSelector} > h5 > a`
    )
    let [rankLi, ppLi, playCountLi, ] = doc.querySelectorAll(
        `${dataSectionSelector} > ul > li`
    )

    // Extract Data:
    let name = nameLink.innerText.replace(/\W/gm, '');
    
    let [ , globalRank, globalCount, country, countryRank] = rankLi.innerHTML
        .match(/#([0-9,]+)\s*\/\s*#([0-9,]+).*country=([a-z]+).*#([0-9,]+)/s)
    ;

    let globalPercentile = _toNumber(globalRank) / _toNumber(globalCount) * 100

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
    globalRank = _toLocaleNumberString(globalRank)
    globalPercentile = globalPercentile.toFixed(2)
    globalRankChangeToday = Math.abs(globalRankChangeToday).toLocaleString()
    globalRankChangeWeek = Math.abs(globalRankChangeWeek).toLocaleString()
    countryRank = _toLocaleNumberString(countryRank)
    pp = _toLocaleNumberString(pp)

    return {
        'name': name,
        'globalRank': globalRank,
        'globalPercentile': globalPercentile,
        'globalRankChangeToday': globalRankChangeToday,
        'isGlobalRankChangeTodayUp': isGlobalRankChangeTodayUp,
        'globalRankChangeWeek': globalRankChangeWeek,
        'isGlobalRankChangeWeekUp': isGlobalRankChangeWeekUp,
        'country': country,
        'countryRank': countryRank,
        'pp': pp
    }
}


function scoresaber_getData(id) {
    return _scoresaber_fetch(id)
        .then(text => _scoresaber_parse(text))
    ;
}
