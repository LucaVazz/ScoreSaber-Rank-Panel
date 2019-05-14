let idInput = document.getElementById('score-saber-id-input')
let colorInput = document.getElementById('accent-color-input')


// Helper Functions:
function _config_getId() {
	let value = idInput.value
	let match = value.match(/https*:\/\/scoresaber.com\/u\/([0-9]+)/) || []
	return match.length === 2 ? match[1] : undefined
}

function _config_getColor() {
	let value = colorInput.value
	let match = value.match(/[0-9a-fA-F]{6}/) || []
	return match.length === 1 ? match[0] : undefined
}

/*
document.querySelector('input[name="lang"]:checked').value;
 */


// Event Listeners:
idInput.addEventListener('input', function (evt) {
	let id = _config_getId()
	if (!id) {
		return
	}

	let namePreview = document.getElementById('name-preview')
	scoresaber_getData(id)
        .then(data => {
        	rlog(JSON.stringify(data))
    		namePreview.innerText = `Welcome ${data.name}!`
		})
		.catch((err) => {
			rlog(err.stack)
			namePreview.innerText = ''
		})
})

colorInput.addEventListener('input', function (evt) {
	let color = _config_getColor()
	if (!color) {
		color = '00000000'
	}

    document.getElementById('color-preview').style.setProperty('--preview-color', `#${color}`)
})
