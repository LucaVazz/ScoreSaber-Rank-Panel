const twitch = window.Twitch.ext
const rlog = twitch.rig.log


twitch.onContext(function(context, changedKeys) {
	if (context.theme === 'dark') {
		document.getElementById('root').classList.add('dark')
	} else {
		document.getElementById('root').classList.remove('dark')
	}
})
