
import { AddTile } from './AddTile.js';
import { AddCardPopup, PopupInput, EditTilePopup } from './Popups.js';
import { Card } from './struct.js';
import { DCButton } from './DCButton.js';
import { deleteDoc, doc } from 'firebase/firestore';

export class EditList {
	constructor(db, uid, deck, collectionID, deckID) {
		this.exit = this.exit.bind(this);
		this.showAddCardPopup = this.showAddCardPopup.bind(this);
		this.cardAdded = this.cardAdded.bind(this);
		this.removeCard = this.removeCard.bind(this);
		this.elem = document.createElement('div');
		this.elem.className = 'edit-list';
		this.db = db;
		this.uid = uid;
		this.deck = deck;
		this.collectionID = collectionID;
		this.deckID = deckID;
		this.deck.cards.forEach(card => {
			const editTile = new EditTile(this.db, this.uid, this.collectionID, this.deckID, this.deck, card, this.removeCard);
			this.elem.appendChild(editTile.elem);
		});
		this.addTile = new AddTile(this.showAddCardPopup);
		const exitButton = document.createElement('img');
		exitButton.src = 'cross.svg';
		exitButton.className = 'edit-list-exit'
		exitButton.addEventListener('click', this.exit);
		this.elem.appendChild(this.addTile.elem);
		this.elem.append(exitButton);
		document.body.appendChild(this.elem);
	}

	exit() {
		document.body.removeChild(this.elem);
	}

	showAddCardPopup() {
		new AddCardPopup(this.db, this.uid, this.collectionID, this.deckID, this.deck.lang, this.cardAdded);
	}

	cardAdded(id, content, translation) {
		const card = new Card(content, translation, id)
		this.deck.addCard(card);
		const editTile = new EditTile(this.db, this.uid, this.collectionID, this.deckID, this.deck, card, this.removeCard);
		this.elem.appendChild(editTile.elem);
	}

	removeCard(editTile) {
		this.elem.removeChild(editTile.elem);
	}
}

class EditTile {
	constructor(db, uid, collectionID, deckID, deck, card, remove) {
		this.onclick = this.onclick.bind(this);
		this.cardModified = this.cardModified.bind(this);
		this.del = this.del.bind(this);
		this.db = db;
		this.uid = uid;
		this.collectionID = collectionID;
		this.deckID = deckID;
		this.deck = deck;
		this.card = card;
		this.remove = remove;
		this.elem = document.createElement('div');
		this.elem.className = 'edit-tile';
		this.content = document.createElement('p');
		this.content.textContent = card.content;
		this.translation = document.createElement('p');
		this.translation.textContent = card.translation;
		const delButton = document.createElement('img');
		delButton.className = 'edit-tile-del-button';
		delButton.src = 'bin.svg';
		delButton.addEventListener('click', this.del);
		this.elem.appendChild(this.content);
		this.elem.appendChild(this.translation);
		this.elem.appendChild(delButton);
		this.elem.addEventListener('click', this.onclick);
	}

	onclick() {
		new EditTilePopup(this.db, this.uid, this.collectionID, this.deckID, this.card.id, this.deck.lang, this.card, this.cardModified);
	}

	cardModified(content, translation) {
		this.card.content = content;
		this.card.translation = translation;
		this.content.textContent = content;
		this.translation.textContent = translation;
	}

	del(e) {
		e.stopPropagation();
		deleteDoc(doc(this.db, 'users', this.uid, 'collections', this.collectionID, 'decks', this.deckID, 'cards', this.card.id));
		this.deck.removeCard(this.card.id);
		this.remove(this);
	}
}