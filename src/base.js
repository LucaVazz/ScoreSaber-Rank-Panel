// Define globals:
const rlog = Twitch.ext.rig.log

const state = {
	isPlayingBeatSaber: false,
}


// Init Sentry for error reporting based on Twitch global Config
Twitch.ext.configuration.onChanged(() => {
    let globalConfigStr = Twitch.ext.configuration.global
    if (globalConfigStr) {
	    let [sentryDSN, ] = globalConfigStr.content.split('|')
	    if (!sentryDSN) { return }

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
