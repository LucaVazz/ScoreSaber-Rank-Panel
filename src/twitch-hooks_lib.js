export function parseConfigStr(config, fallbackValues) {
	if (!config) {
		return fallbackValues
	}

	let configStr = config.content
	let valueCount = (configStr.match(/\|/g) || []).length + 1
	
	if (fallbackValues.length === valueCount) {
		return configStr.split('|')
	} else {
		return fallbackValues
	}
}

export function hookOnGlobalConfigChanged(callback = null) {
	Twitch.ext.configuration.onChanged(() => {
		let globalConfig = Twitch.ext.configuration.global
		if (globalConfig) {
			let [sentryDSN, globalCount] = parseConfigStr(globalConfig, [null, 186300 /* as of 2019-06-14*/ ])
			globalCount = (+globalCount)

			// configure error logging if not in local test:
			if (window.location.hostname != 'localhost' && sentryDSN) {
				Sentry.init({ 
					release: releaseVersion,
					dsn: sentryDSN
				})
			}

			if (callback) {
				callback({
					globalCount: globalCount
				})
			}
		}
	})
}


export function hookOnAuthorized(callback = null) {
	Twitch.ext.onAuthorized((userDetails) => {
		Sentry.configureScope((scope) => {
			scope.setUser({
				"id": userDetails.userId
			})
			scope.setTag("channelId", userDetails.channelId)
		})

		if (callback) {
			callback(userDetails)
		}
	})
}


export function hookOnContextChanged(callback = null) {
	Twitch.ext.onContext((context, changedKeys) => {
		if (changedKeys.includes('theme')) {
			if (context.theme === 'dark') {
				document.getElementById('root').classList.add('dark')
			} else {
				document.getElementById('root').classList.remove('dark')
			}
		}

		if (callback) {
			callback(context, changedKeys)
		}
	})
}
