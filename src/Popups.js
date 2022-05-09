
import { DCButton } from './DCButton.js';
import { randEmoji, randColour } from './utility.js';
import { collection, doc, setDoc, addDoc } from 'firebase/firestore';
import { bind } from './wanakana.js';
import { Session } from './Session.js';

export class CreateCollectionPopup {
	constructor(db, uid, func) {
		this.cancel = this.cancel.bind(this);
		this.create = this.create.bind(this);
		this.db = db;
		this.uid = uid;
		this.func = func;
		this.elem = document.createElement('div');
		this.elem.className = 'popup';
		const wrapper = document.createElement('div');
		wrapper.className = 'popup-wrapper';
		const title = document.createElement('h2');
		title.textContent = 'Create Collection';
		this.input = new PopupInput('Collection Name:');
		const buttonWrapper = document.createElement('div');
		buttonWrapper.className = 'popup-button-wrapper';
		this.cancelButton = new DCButton('Cancel', this.cancel);
		this.createButton = new DCButton('Create', this.create);
		buttonWrapper.appendChild(this.cancelButton.elem);
		buttonWrapper.appendChild(this.createButton.elem);
		wrapper.appendChild(title);
		wrapper.appendChild(this.input.elem);
		wrapper.appendChild(buttonWrapper);
		this.elem.appendChild(wrapper);
		document.body.appendChild(this.elem);
	}

	cancel() {
		document.body.removeChild(this.elem);
	}

	async create() {
		const e = randEmoji();
		const c = randColour();
    	const res = await addDoc(collection(this.db, 'users', this.uid, 'collections'), { name : this.input.value(), emoji: e, colour: c});
  		this.func(res.id, this.input.value(), e, c)
  		document.body.removeChild(this.elem);
	}
}

const languages = {
	japanese: 'ja-JP',
	french: 'fr-FR',
	spanish: 'es-ES',
	italian: 'it-IT'
};

export class CreateDeckPopup {
	constructor(db, uid, collectionID, func) {
		this.cancel = this.cancel.bind(this);
		this.create = this.create.bind(this);
		this.db = db;
		this.uid = uid;
		this.collectionID = collectionID;
		this.func = func;
		this.elem = document.createElement('div');
		this.elem.className = 'popup';
		const wrapper = document.createElement('div');
		wrapper.className = 'popup-wrapper';
		const title = document.createElement('h2');
		title.textContent = 'Create Deck';
		this.input = new PopupInput('Deck Name:');
		this.select = new PopupSelect('Deck Language:');
		const buttonWrapper = document.createElement('div');
		buttonWrapper.className = 'popup-button-wrapper';
		this.cancelButton = new DCButton('Cancel', this.cancel);
		this.createButton = new DCButton('Create', this.create);
		buttonWrapper.appendChild(this.cancelButton.elem);
		buttonWrapper.appendChild(this.createButton.elem);
		wrapper.appendChild(title);
		wrapper.appendChild(this.input.elem);
		wrapper.appendChild(this.select.elem);
		wrapper.appendChild(buttonWrapper);
		this.elem.appendChild(wrapper);
		document.body.appendChild(this.elem);
	}

	cancel() {
		document.body.removeChild(this.elem);
	}

	async create() {
		const e = randEmoji();
		const c = randColour();
		const l = languages[this.select.value()];
    	const res = await addDoc(collection(this.db, 'users', this.uid, 'collections', this.collectionID, 'decks'), { name : this.input.value(), lang: l, emoji: e, colour: c});
  		this.func(res.id, this.input.value(), e, c);
  		document.body.removeChild(this.elem);
  		new AddCardPopup(this.db, this.uid, this.collectionID, res.id, l);
	}
}

export class AddCardPopup {
	constructor(db, uid, collectionID, deckID, lang) {
		this.finish = this.finish.bind(this);
		this.add = this.add.bind(this);
		this.db = db;
		this.uid = uid;
		this.collectionID = collectionID;
		this.deckID = deckID;
		this.elem = document.createElement('div');
		this.elem.className = 'popup';
		const wrapper = document.createElement('div');
		wrapper.className = 'popup-wrapper';
		const title = document.createElement('h2');
		title.textContent = 'Add Card';
		this.contentInput = new PopupInput('Content:', lang);
		this.translationInput = new PopupInput('Translation:');
		const buttonWrapper = document.createElement('div');
		buttonWrapper.className = 'popup-button-wrapper';
		this.finishButton = new DCButton('Finish', this.finish);
		this.addButton = new DCButton('Add', this.add);
		buttonWrapper.appendChild(this.finishButton.elem);
		buttonWrapper.appendChild(this.addButton.elem);
		wrapper.appendChild(title);
		wrapper.appendChild(this.contentInput.elem);
		wrapper.appendChild(this.translationInput.elem);
		wrapper.appendChild(buttonWrapper);
		this.elem.appendChild(wrapper);
		document.body.appendChild(this.elem);
	}

	finish() {
		document.body.removeChild(this.elem);
	}

	add() {
    	const res = addDoc(collection(this.db, 'users', this.uid, 'collections', this.collectionID, 'decks', this.deckID, 'cards'), { content : this.contentInput.value(), translation: this.translationInput.value()});
  		this.contentInput.reset();
  		this.translationInput.reset();
	}
}

export class DeckTilePopup {
	constructor(deck) {
		this.start = this.start.bind(this);
		this.elem = document.createElement('div');
		this.elem.className = 'popup';
		this.deck = deck;
		const wrapper = document.createElement('div');
		wrapper.className = 'popup-wrapper';
		const title = document.createElement('h2');
		title.textContent = deck.deckName;
		const num = document.createElement('p');
		num.textContent = `${deck.length} cards`;
		num.className = 'deck-tile-popup-num';
		const buttonWrapper = document.createElement('div');
		buttonWrapper.className = 'popup-button-wrapper';
		this.startButton = new DCButton('Start', this.start);
		buttonWrapper.appendChild(this.startButton.elem);
		wrapper.appendChild(title);
		wrapper.appendChild(num);
		wrapper.appendChild(buttonWrapper);
		this.elem.appendChild(wrapper);
		document.body.appendChild(this.elem);
	}

	start() {
		document.body.removeChild(this.elem);
		new Session(this.deck);
	}
}

export class PopupInput {
	constructor(text, lang='en-EN') {
		this.value = this.value.bind(this);
		this.elem = document.createElement('div');
		this.elem.className = 'popup-input';
		const label = document.createElement('p');
		label.textContent = text;
		this.input = document.createElement('input');
		this.input.type = 'text';
		console.log(lang);
		if (lang === 'ja-JP') {
			console.log('bound');
			bind(this.input);
		}
		this.elem.appendChild(label);
		this.elem.appendChild(this.input);
	}

	value () {
		return this.input.value;
	}

	reset() {
		this.input.value = '';
	}
}

export class PopupSelect {
	constructor(text) {
		this.value = this.value.bind(this);
		this.elem = document.createElement('div');
		this.elem.className = 'popup-input';
		const label = document.createElement('p');
		label.textContent = text;
		this.select = document.createElement('select');
		Object.keys(languages).forEach(lang => {
			const option = document.createElement('option');
			option.textContent = lang;
			this.select.appendChild(option);
		});
		this.elem.appendChild(label);
		this.elem.appendChild(this.select);
	}

	value() {
		return this.select.value;
	}
}