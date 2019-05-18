const rlog = Twitch.ext.rig.log

const state = {
	isPlayingBeatSaber: false,
}


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
