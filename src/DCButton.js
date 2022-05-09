

export class DCButton {
	constructor(text, func) {
		this.elem = document.createElement('div');
		this.elem.className = 'dc-button';
		this.elem.textContent = text;
		this.elem.addEventListener('click', func);
	}
}