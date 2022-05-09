

export class AddTile {
	constructor(onclick) {
		this.elem = document.createElement('div');
		this.elem.className = 'add-tile';
		const wrapper = document.createElement('div');
		wrapper.className = 'add-tile-wrapper';
		wrapper.textContent = '+';
		this.elem.appendChild(wrapper);
		this.elem.addEventListener('click', onclick);
	}
}