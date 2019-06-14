// Define globals:
const rlog = Twitch.ext.rig.log

const state = {
	isPlayingBeatSaber: false,
	globalScoreSaberCount: 186300 // fallback value, as of 2019-06-14
}


// Catch Twitch global Config Service changes
Twitch.ext.configuration.onChanged(() => {
    let globalConfigStr = Twitch.ext.configuration.global
    if (globalConfigStr) {
	    let [sentryDSN, globalCount] = globalConfigStr.content.split('|')
	    if (!sentryDSN || !globalCount) { return }

    	// set global count in state:
    	state.globalScoreSaberCount = (+globalCount)

    	// config error logging if not in local test:
    	if (window.location.hostname != 'localhost') {
			Sentry.init({ dsn: sentryDSN })
		}
	}
})


// Catch Twitch Context changes
Twitch.ext.onContext((context, changedKeys) => {
	if (changedKeys.includes('theme')) {
		if (context.theme === 'dark') {
			document.getElementById('root').classList.add('dark')
		} else {
			document.getElementById('root').classList.remove('dark')
		}
	}

	if (changedKeys.includes('game')) {
		state.isPlayingBeatSaber = (context.game === 'Beat Saber');
	}
})
