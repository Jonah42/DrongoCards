

export class Ribbon {
	constructor(showRoot) {
		this.add = this.add.bind(this);
		this.remove = this.remove.bind(this);
		this.elem = document.createElement('div');
		this.elem.className = 'ribbon';
		const root = document.createElement('div');
		root.className = 'ribbon-root'
		root.textContent = 'Collections';
		root.addEventListener('click', showRoot);
		this.elem.appendChild(root);
	}

	add(text) {
		const deck = document.createElement('div');
		deck.className = 'ribbon-collection';
		deck.textContent = text;
		this.elem.appendChild(deck);
	}

	remove() {
		this.elem.removeChild(this.elem.lastChild);
	}
}