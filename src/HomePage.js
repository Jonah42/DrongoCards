import { Ribbon } from './Ribbon.js';
import { CollectionList } from './CollectionList.js';
import { DeckList } from './DeckList.js';

export class HomePage {
	constructor(db, uid) {
		this.showRoot = this.showRoot.bind(this);
		this.showCollection = this.showCollection.bind(this);
		this.db = db;
		this.uid = uid;
		this.elem = document.createElement('div');
		this.elem.className = 'home-page-wrapper';
		this.ribbon = new Ribbon(this.showRoot);
		this.collectionList = new CollectionList(db, uid, this.showCollection);
		this.collectionList.load();
		this.elem.appendChild(this.ribbon.elem);
		this.elem.appendChild(this.collectionList.elem);
	}

	showRoot() {
		// Display all Collections
		if (this.elem.lastChild !== this.collectionList.elem) {
			this.elem.removeChild(this.elem.lastChild);
			this.collectionList.elem.style.display = 'flex';
			this.ribbon.remove();
		}
	}

	showCollection(tile) {
		this.collectionList.elem.style.display = 'none';
		const deckList = new DeckList(this.db, this.uid, tile);
		deckList.load();
		this.elem.appendChild(deckList.elem);
		this.ribbon.add(tile.tileName);
	}
}