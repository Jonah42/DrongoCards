

export class DCButton {
	constructor(text, func) {
		this.setText = this.setText.bind(this);
		this.elem = document.createElement('div');
		this.elem.className = 'dc-button';
		this.elem.textContent = text;
		this.elem.addEventListener('click', func);
	}

	setText(text) {
		this.elem.textContent = text;
	}
}