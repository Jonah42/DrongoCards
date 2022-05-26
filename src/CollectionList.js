
import { AddTile } from './AddTile.js';
import { CreateCollectionPopup, EditCollectionPopup } from './Popups.js';
import { Tile } from './Tile.js';
import { getDocs, collection } from 'firebase/firestore';

export class CollectionList {
	constructor(db, uid, showCollection) {
		this.load = this.load.bind(this);
		this.add = this.add.bind(this);
		this.remove = this.remove.bind(this);
		this.createCollection = this.createCollection.bind(this);
		this.editCollection = this.editCollection.bind(this);
		this.showCollection = showCollection;
		this.db = db;
		this.uid = uid;
		this.elem = document.createElement('div');
		this.elem.className = 'collection-list';
		this.addTile = new AddTile(this.createCollection);
		this.elem.appendChild(this.addTile.elem);
	}

	async load() {
		console.log("Loading");
		const collections = await getDocs(collection(this.db, 'users', this.uid, 'collections'));
		console.log("hmm");
		collections.forEach(doc => {
			// console.log(doc);
			// console.log(doc.id);
			console.log(doc.data());
			// id = doc.id;
			const newTile = new Tile(doc.id, doc.data().name, doc.data().emoji, doc.data().colour, this.showCollection, '', this.editCollection);
			this.elem.appendChild(newTile.elem);
		});
	}

	createCollection() {
		new CreateCollectionPopup(this.db, this.uid, this.add);
	}

	add(id, name, emoji, colour) {
		const newTile = new Tile(id, name, emoji, colour, this.showCollection, '', this.editCollection);
		this.elem.appendChild(newTile.elem);
	}

	editCollection(tile) {
		new EditCollectionPopup(this.db, this.uid, tile.id, tile, this.remove);
	}

	remove(tile) {
		this.elem.removeChild(tile.elem);
	}
}