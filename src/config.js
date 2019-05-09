document.getElementById('accent-color-input').addEventListener('input', function (evt) {
	rlog('x')
    document.getElementById('color-preview').style.setProperty('--preview-color', `#${this.value}`)
})

/*
document.querySelector('input[name="genderS"]:checked').value;
 */