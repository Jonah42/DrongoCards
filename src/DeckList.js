
import { AddTile } from './AddTile.js';
import { CreateDeckPopup } from './Popups.js';
import { Tile } from './Tile.js';
import { getDocs, collection } from 'firebase/firestore';

export class DeckList {
	constructor(db, uid, tile) {
		this.load = this.load.bind(this);
		this.add = this.add.bind(this);
		this.createDeck = this.createDeck.bind(this);
		this.db = db;
		this.uid = uid;
		this.collectionID = tile.id;
		this.elem = document.createElement('div');
		this.elem.className = 'collection-list';
		this.addTile = new AddTile(this.createDeck);
		this.elem.appendChild(this.addTile.elem);
	}

	async load() {
		try {
			const collections = await getDocs(collection(this.db, 'users', this.uid, 'collections', this.collectionID, 'decks'));
			collections.forEach(doc => {
				// console.log(doc);
				// console.log(doc.id);
				console.log(doc.data());
				// id = doc.id;
				const newTile = new Tile(doc.id, doc.data().name, doc.data().emoji, doc.data().colour, null);
				this.elem.appendChild(newTile.elem);
			});
		} catch (e) {

		}
	}

	createDeck() {
		new CreateDeckPopup(this.db, this.uid, this.collectionID, this.add);
	}

	add(id, name, emoji, colour) {
		const newTile = new Tile(id, name, emoji, colour, null); // replace null with function that handles deck click
		this.elem.appendChild(newTile.elem);
	}
}