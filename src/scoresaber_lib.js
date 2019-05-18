const DATA_URL = new URL('https://scoresaber-proxy.lucavazzano.eu')
const PARSER = new DOMParser()


const toNumber = (str) => (+str.replace(',', ''));
const toLocaleNumberString = (str) => toNumber(str).toLocaleString();


/**
 * Retrieve the user site from ScoreSaber.com
 * @param  {string} id the user's id as shown in the web-site URL (steam id)
 * @return {str} site data
 */
function fetchSite(id) {
    let targetUrl = new URL(id, DATA_URL)
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

/**
 @typedef ScoresaberData
 @type {Object}
 @property {str} name name of the user
 @property {str} globalRank current global rank of the user
 @property {str} globalPercentile percentile of the user's current global rank (i.e. top 1%)
 @property {str} globalRankChangeToday change of the user's global rank, compared to 1 day ago
 @property {str} isGlobalRankChangeTodayUp true if globalRankChangeToday is < 0
 @property {str} globalRankChangeWeek change of the user's global rank, compared to 7 days ago
 @property {str} isGlobalRankChangeWeekUp true if globalRankChangeWeek is < 0
 @property {str} country two-letter country code of the user's home country
 @property {str} countryRank current national rank of the user
 @property {str} pp performance point count of the user
 */

/**
 * Extract user data from the fetched site data
 * @param  {str} text site data, obtained via fetchSite
 * @return {ScoresaberData} user data
 */
function parse(text) {
    // Find Elements:
    let doc = PARSER.parseFromString(text, 'text/html')
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
    globalPercentile = globalPercentile.toFixed(2)
    globalRankChangeToday = Math.abs(globalRankChangeToday).toLocaleString()
    globalRankChangeWeek = Math.abs(globalRankChangeWeek).toLocaleString()
    countryRank = toLocaleNumberString(countryRank)
    pp = toLocaleNumberString(pp)

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

/**
 * Fetch and extract the data about a specified user from ScoreSaber.com
 * @param  {string} id the user's id as shown in the web-site URL (steam id)
 * @return {ScoresaberData} user data
 */
export function getScoresaberData(id) {
    return fetchSite(id)
        .then(text => parse(text))
    ;
}
