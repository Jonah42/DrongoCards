
export class Tile {
	constructor(id, tileName, emoji, colour, func, lang, rfunc=(()=>{})) {
		this.onclick = this.onclick.bind(this);
		this.onrclick = this.onrclick.bind(this);
		this.tileName = tileName;
		this.emoji = emoji;
		this.id = id;
		this.lang = lang;
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
		elem.addEventListener('contextmenu', this.onrclick, false);
		this.elem = elem;
		this.func = func;
		this.rfunc = rfunc;
	}

	onclick() {
		this.func(this);
	}

	onrclick(e) {
		console.log(e);
		e.preventDefault();
		this.rfunc(this);
		return false;
	}
}

