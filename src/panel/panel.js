import {
	parseConfigStr, hookOnGlobalConfigChanged, hookOnAuthorized, hookOnContextChanged
} from './twitch-hooks_lib.js'


// State Vars:
var isConfigured = false
var scoresaberId = undefined
var globalScoreSaberCount = -1


// Element References:
var contentEl = document.getElementById('content')


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
            document.querySelectorAll('span[data-translation-de]').forEach(el => {
                el.innerText = el.dataset.translationDe
            })
        }

        // add link event:
        document.getElementById('link-button').addEventListener('click', evt => {
            window.open('https://scoresaber.com/u/' + scoresaberId, 'scoresaberTab')
        })

        // display:
        document.getElementById('load-splash').classList.add('hidden')
        contentEl.classList.remove('hidden')
    }
})
