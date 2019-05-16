import { getScoresaberData } from './scoresaber_lib.js'


// Element References:
let idInput = document.getElementById('score-saber-id-input')
let colorInput = document.getElementById('accent-color-input')


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

/*
document.querySelector('input[name="lang"]:checked').value;
 */


// Event Listeners:
idInput.addEventListener('input', function (evt) {
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
})

colorInput.addEventListener('input', function (evt) {
	let color = getColor()
	if (!color) {
		color = '00000000'
	}

    document.getElementById('color-preview').style.setProperty('--preview-color', `#${color}`)
})
