
export class Tile {
	constructor(id, tileName, emoji, colour, func) {
		this.onclick = this.onclick.bind(this);
		this.tileName = tileName;
		this.emoji = emoji;
		this.id = id;
		const elem = document.createElement('div');
		elem.className = 'tile';
		const elem2 = document.createElement('div');
		elem2.className = 'tile-image';
		const elem3 = document.createElement('div');
		elem3.className = 'emoji-wrapper';
		elem3.textContent = this.emoji;
		elem2.appendChild(elem3);
		const text = document.createElement('p');
		text.textContent = this.tileName;
		text.className = 'tile-text'
		elem2.style.backgroundColor = colour;
		elem.appendChild(elem2);
		elem.appendChild(text);
		elem.addEventListener('click', this.onclick);
		this.elem = elem;
		this.func = func;
	}

	onclick() {
		this.func(this);
	}
}

