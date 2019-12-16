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
 @property {number} globalRankInt current global rank of the user, as a numerical integer
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
    let rankLi, ppLi = null
    doc.querySelectorAll(
        `${dataSectionSelector} > ul > li`
    ).forEach(
        liElem => {
            let liText = (liElem ? liElem.innerText : '')
            if (liText.includes('Player Ranking')) {
                rankLi = liElem
            } else if (liText.includes('Performance Points')) {
                ppLi = liElem
            }
        }
    )

    // Extract Data:
    let name = nameLink.innerText.replace(/\W/gm, '')
    
    /* <a href="/global">#220</a> - ( <a href="/global?country=us"><img src="/imports/images/flags/us.png"> #72</a> */
    let globalRank   = rankLi.innerHTML.match(/global">#([0-9,]+)<\/a>/)[1]
    let country      = rankLi.innerHTML.match(/global\?country=([a-z]+)/)[1]
    let countryRank  = rankLi.innerHTML.match(/"> #([0-9,]+)<\/a>/)[1]
    let globalRankInt = toNumber(globalRank)

    let pp = ppLi.innerText.match(/[0-9,.]+/)[0]

    let rankHistory = doc.querySelector('script:not([src])').innerText
        .match(/datasets:\s*\[{\s*data:\s*\[([0-9,]+)\]/)[1]
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
    pp = toLocaleNumberString(pp)

    return {
        'name': name,
        'globalRank': globalRank,
        'globalRankInt': globalRankInt,
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
