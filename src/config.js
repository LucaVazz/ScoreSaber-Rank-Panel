import { getScoresaberData } from './scoresaber_lib.js'


const CONFIG_BROADCASTER_SEGMENT_VERSION = 'v1_scoreSaberId+color+lang'


// Element References:
let idInput = document.getElementById('score-saber-id-input')
let colorInput = document.getElementById('accent-color-input')
let langEnRadio = document.getElementById('language-radio-en')
let langDeRadio = document.getElementById('language-radio-de')


// Helper Functions:
function getId() {
	let value = idInput.value
	let match = value.match(/https*:\/\/scoresaber.com\/u\/([0-9]+)/) || []
	return match.length === 2 ? match[1] : undefined
}

function getColor() {
	let value = colorInput.value
	let match = value.match(/[0-9a-fA-F]{6}/) || []
	return match.length === 1 ? match[0] : undefined
}

function getLang() {
	return langDeRadio.checked ? 'de' : 'en'
}

function setIdPreview() {
	let id = getId()
	if (!id) {
		return
	}

	let namePreview = document.getElementById('name-preview')
	getScoresaberData(id)
        .then(data => {
    		namePreview.innerText = `Welcome ${data.name}!`
		})
		.catch((err) => {
			rlog(err.stack)
			namePreview.innerText = ''
		})
}

function setColorPreview() {
	let color = getColor()
	if (!color) {
		color = '00000000'
	}

    document.getElementById('color-preview').style.setProperty('--preview-color', `#${color}`)
}


// Event Listeners:
Twitch.ext.configuration.onChanged(() => {
	let broadcasterConfigStr = Twitch.ext.configuration.broadcaster

	if (broadcasterConfigStr) {
		let [id, color, lang] = broadcasterConfigStr.content.split('|')
		if (!id || !color || !lang) {
			return
		}
		idInput.value = `https://scoresaber.com/u/${id}`
		colorInput.value = color
		;[langDeRadio, langEnRadio].map(radio => radio.checked = false)
		;(lang === 'de' ? langDeRadio : langEnRadio).checked = true

		setIdPreview()
		setColorPreview()
	}
})

idInput.addEventListener('input', evt => setIdPreview())

colorInput.addEventListener('input', evt => setColorPreview())

document.getElementById('submit-button').addEventListener('click', evt => {
	document.getElementById('content').classList.add('hidden')
	document.getElementById('saving-splash').classList.remove('hidden')

	Twitch.ext.configuration.set(
		'broadcaster', CONFIG_BROADCASTER_SEGMENT_VERSION,
		[getId(), getColor(), getLang()].join('|')
	)
})
