

export class Toolbar {
	constructor(signInFunc, aboutFunc) {
		const toolbar = document.createElement('div');
		toolbar.className = 'toolbar';
		const signInButton = document.createElement('div');
		signInButton.className = 'toolbar-button';
		signInButton.textContent = 'Sign In';
		const aboutButton = document.createElement('div');
		aboutButton.className = 'toolbar-button';
		aboutButton.textContent = 'About';
		toolbar.appendChild(signInButton);
		toolbar.appendChild(aboutButton);
		signInButton.addEventListener('click', signInFunc);
		aboutButton.addEventListener('click', aboutFunc);
		this.elem = toolbar;
	}
}