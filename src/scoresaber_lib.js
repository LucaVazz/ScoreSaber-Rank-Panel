/**
 * Retrieve the user site from ScoreSaber.com
 * @param  {string} id the user's id as shown in the web-site URL (steam id)
 * @return {str} site data
 */
function fetchSite(id) {
    let targetUrl = new URL(`https://new.scoresaber.com/api/player/${id}/basic`)
    return fetch(new Request(targetUrl))
        .then(response => {
            if (!response.ok) {
                throw `HTTP error code ${response.status}`
            } else {
                let data = response.json()
                Sentry.setExtra('scoresaber_lib#fetchSite', JSON.stringify(data))
                return data
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
 @property {boolean} isBanned if the player is banned
 @property {boolean} isInactive if the player is inactive
 */

/**
 * Extract user data from the fetched site data
 * @param  {object} text site data, obtained via fetchSite
 * @return {ScoresaberData} user data
 */
function parse(data) {
    data = data['playerInfo']

    // parse out data to be formatted:
    let currentRank = data['rank']

    let historyRank = data['history'].split(',').reverse()
    let rankYesterday = historyRank[0]
    let rankChangeYesterday = rankYesterday - currentRank
    let isRankChangeYesterdayUp = (rankChangeYesterday >= 0)
    let rankLastWeek = historyRank[6]
    let rankChangeLastWeek = rankLastWeek - currentRank
    let isRankChangeLastWeekUp = (rankChangeLastWeek >= 0)

    let countryRank = data['countryRank']
    let pp = data['pp']

    // Format:
    let currentRankStr = currentRank.toLocaleString()
    rankChangeYesterday = Math.abs(rankChangeYesterday).toLocaleString()
    rankChangeLastWeek = Math.abs(rankChangeLastWeek).toLocaleString()
    countryRank = countryRank.toLocaleString()
    pp = pp.toLocaleString()
    
    return {
        'name': data['playerName'] || data['name'],
        'globalRank': currentRankStr,
        'globalRankInt': currentRank,
        'globalRankChangeToday': rankChangeYesterday,
        'isGlobalRankChangeTodayUp': isRankChangeYesterdayUp,
        'globalRankChangeWeek': rankChangeLastWeek,
        'isGlobalRankChangeWeekUp': isRankChangeLastWeekUp,
        'country': data['country'],
        'countryRank': countryRank,
        'pp': pp,
        'isBanned': data['banned'],
        'isInactive': data['inactive']
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
