
import { AddTile } from './AddTile.js';
import { CreateDeckPopup, DeckTilePopup } from './Popups.js';
import { Tile } from './Tile.js';
import { getDocs, collection } from 'firebase/firestore';
import { Card, Deck } from './struct.js';

export class DeckList {
	constructor(db, uid, tile) {
		this.load = this.load.bind(this);
		this.add = this.add.bind(this);
		this.remove = this.remove.bind(this);
		this.createDeck = this.createDeck.bind(this);
		this.showDeckTilePopup = this.showDeckTilePopup.bind(this);
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
			const decks = await getDocs(collection(this.db, 'users', this.uid, 'collections', this.collectionID, 'decks'));
			decks.forEach(doc => {
				// console.log(doc);
				// console.log(doc.id);
				console.log(doc.data());
				// id = doc.id;
				const newTile = new Tile(doc.id, doc.data().name, doc.data().emoji, doc.data().colour, this.showDeckTilePopup, doc.data().lang);
				this.elem.appendChild(newTile.elem);
			});
		} catch (e) {

		}
	}

	createDeck() {
		new CreateDeckPopup(this.db, this.uid, this.collectionID, this.add);
	}

	add(id, name, emoji, colour, lang) {
		const newTile = new Tile(id, name, emoji, colour, this.showDeckTilePopup, lang); // replace null with function that handles deck click
		this.elem.appendChild(newTile.elem);
	}

	async showDeckTilePopup(tile) {
		const cardsSnap = await getDocs(collection(this.db, 'users', this.uid, 'collections', this.collectionID, 'decks', tile.id, 'cards'));
		const deck = new Deck(tile.tileName);
		cardsSnap.forEach(doc => {
			// console.log(doc.data());
			deck.addCard(new Card(doc.data().content, doc.data().translation, doc.id));
		});
		deck.lang = tile.lang;
		new DeckTilePopup(this.db, this.uid, deck, this.collectionID, tile, this.remove);
	}

	remove(tile) {
		this.elem.removeChild(tile.elem);
	}
}