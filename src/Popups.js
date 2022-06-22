
import { DCButton } from './DCButton.js';
import { randEmoji, randColour } from './utility.js';
import { collection, doc, setDoc, addDoc, updateDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { bind } from './wanakana.js';
import { Session } from './Session.js';
import { EditList } from  './EditList.js';

export class CreateCollectionPopup {
	constructor(db, uid, func) {
		this.cancel = this.cancel.bind(this);
		this.create = this.create.bind(this);
		this.onkeyup = this.onkeyup.bind(this);
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
		this.elem.addEventListener('keyup', this.onkeyup);
		document.body.appendChild(this.elem);
		this.input.focus();
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

	onkeyup(e) {
		if (e.keyCode == 13) this.create();
		else if (e.keyCode == 27) this.cancel();
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
		this.onkeyup = this.onkeyup.bind(this);
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
		this.elem.addEventListener('keyup', this.onkeyup);
		document.body.appendChild(this.elem);
		this.input.focus();
	}

	cancel() {
		document.body.removeChild(this.elem);
	}

	async create() {
		const e = randEmoji();
		const c = randColour();
		const l = languages[this.select.value()];
    	const res = await addDoc(collection(this.db, 'users', this.uid, 'collections', this.collectionID, 'decks'), { name : this.input.value(), lang: l, emoji: e, colour: c});
  		this.func(res.id, this.input.value(), e, c, l);
  		document.body.removeChild(this.elem);
  		new AddCardPopup(this.db, this.uid, this.collectionID, res.id, l);
	}

	onkeyup(e) {
		if (e.keyCode == 13) this.create();
		else if (e.keyCode == 27) this.cancel();
	}
}

export class AddCardPopup {
	constructor(db, uid, collectionID, deckID, lang, cardAdded=(()=>{})) {
		this.finish = this.finish.bind(this);
		this.add = this.add.bind(this);
		this.onkeyup = this.onkeyup.bind(this);
		this.db = db;
		this.uid = uid;
		this.collectionID = collectionID;
		this.deckID = deckID;
		this.cardAdded = cardAdded;
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
		this.elem.addEventListener('keyup', this.onkeyup);
		document.body.appendChild(this.elem);
		this.contentInput.focus();
	}

	finish() {
		document.body.removeChild(this.elem);
	}

	add() {
		const c = this.contentInput.value();
		const t = this.translationInput.value();
    	addDoc(collection(this.db, 'users', this.uid, 'collections', this.collectionID, 'decks', this.deckID, 'cards'), { content : c, translation: t}).then(res => {
    		this.cardAdded(res.id, c, t);
    	});
  		this.contentInput.reset();
  		this.translationInput.reset();
  		this.contentInput.focus();
	}

	onkeyup(e) {
		if (e.keyCode == 13) this.add();
		else if (e.keyCode == 27) this.finish();
	}
}

export class DeckTilePopup {
	constructor(db, uid, deck, collectionID, tile, remove) {
		this.start = this.start.bind(this);
		this.exit = this.exit.bind(this);
		this.edit = this.edit.bind(this);
		this.del = this.del.bind(this);
		this.onkeyup = this.onkeyup.bind(this);
		this.elem = document.createElement('div');
		this.elem.className = 'popup';
		this.db = db;
		this.uid = uid;
		this.deck = deck;
		this.collectionID = collectionID;
		this.deckID = tile.id;
		this.tile = tile;
		this.remove = remove;
		const wrapper = document.createElement('div');
		wrapper.className = 'popup-wrapper';
		// Title bar
		const titleWrapper = document.createElement('div');
		titleWrapper.className = 'popup-title-wrapper';
		const title = document.createElement('h2');
		title.className = 'popup-title';
		title.textContent = deck.deckName;
		const editButton = document.createElement('img');
		editButton.className = 'popup-edit-button';
		editButton.src = 'edit.svg';
		editButton.addEventListener('click', this.edit);
		const delButton = document.createElement('img');
		delButton.className = 'popup-edit-button';
		delButton.src = 'bin.svg';
		delButton.addEventListener('click', this.del);
		titleWrapper.appendChild(title);
		titleWrapper.appendChild(editButton);
		titleWrapper.appendChild(delButton);
		// Subheading
		const num = document.createElement('p');
		num.textContent = `${deck.length} cards`;
		num.className = 'popup-subheading';
		// Mode select
		const modeSelect = document.createElement('div');
		modeSelect.className = 'popup-mode-select-wrapper';
		let langText = '';
		for (const [key, value] of Object.entries(languages)) {
			if (value === this.deck.lang) langText = key.slice(0,1).toUpperCase() + key.slice(1);
		}
		this.op1 = new PopupCheckbox('op1', `${langText} text to English text`);
		this.op2 = new PopupCheckbox('op2', `${langText} sound to English text`);
		this.op3 = new PopupCheckbox('op3', `${langText} sound to ${langText} text`);
		modeSelect.appendChild(this.op1.elem);
		modeSelect.appendChild(this.op2.elem);
		modeSelect.appendChild(this.op3.elem);
		// Number of Cards
		this.numCards = new PopupInput('Cards:');
		this.numCards.restrictToNums();
		// Button bar
		const buttonWrapper = document.createElement('div');
		buttonWrapper.className = 'popup-button-wrapper';
		this.startButton = new DCButton('Start', this.start);
		const exitButton = document.createElement('img');
		exitButton.className = 'popup-exit-button';
		exitButton.src = 'cross.svg';
		exitButton.addEventListener('click', this.exit);
		buttonWrapper.appendChild(this.startButton.elem);
		// Put it all together
		wrapper.appendChild(titleWrapper);
		wrapper.appendChild(num);
		wrapper.appendChild(modeSelect);
		wrapper.appendChild(this.numCards.elem);
		wrapper.appendChild(buttonWrapper);
		wrapper.appendChild(exitButton);
		this.elem.appendChild(wrapper);
		this.elem.addEventListener('keyup', this.onkeyup);
		document.body.appendChild(this.elem);
		this.numCards.focus();
	}

	start() {
		let mode = 0;
		mode |= this.op1.checked();
		mode |= this.op2.checked() << 1;
		mode |= this.op3.checked() << 2;
		const n = parseInt(this.numCards.value());
		if (!n || n <= 0) {
			alert('Please supply the number of cards to use');
			return;
		}
		if (mode === 0) {
			alert('Please choose at least one mode');
			return;
		}
		document.body.removeChild(this.elem);
		console.log(mode);
		new Session(this.deck, n, mode);
	}

	exit() {
		document.body.removeChild(this.elem);
	}

	onkeyup(e) {
		if (e.keyCode == 13) this.start();
		else if (e.keyCode == 27) this.exit();
	}

	edit() {
		new EditList(this.db, this.uid, this.deck, this.collectionID, this.deckID);
		document.body.removeChild(this.elem);
	}

	async del() {
		getDocs(collection(this.db, 'users', this.uid, 'collections', this.collectionID, 'decks', this.deckID, 'cards')).then(cardsSnap => {
			cardsSnap.forEach(d => {
				// console.log(`deleting ${d.id}`);
				deleteDoc(doc(this.db, 'users', this.uid, 'collections', this.collectionID, 'decks', this.deckID, 'cards', d.id));
			});
			// console.log('deleting deck');
			deleteDoc(doc(this.db, 'users', this.uid, 'collections', this.collectionID, 'decks', this.deckID));
		});
		this.remove(this.tile);
		this.exit();
		// console.log('exiting');
	}
}

export class EditTilePopup {
	constructor(db, uid, collectionID, deckID, cardID, lang, card, cardModified=(()=>{})) {
		this.cancel = this.cancel.bind(this);
		this.save = this.save.bind(this);
		this.onkeyup = this.onkeyup.bind(this);
		this.db = db;
		this.uid = uid;
		this.collectionID = collectionID;
		this.deckID = deckID;
		this.cardID = cardID;
		this.cardModified = cardModified;
		this.elem = document.createElement('div');
		this.elem.className = 'popup';
		const wrapper = document.createElement('div');
		wrapper.className = 'popup-wrapper';
		const title = document.createElement('h2');
		title.textContent = 'Edit Card';
		this.contentInput = new PopupInput('Content:', lang);
		this.contentInput.reset(card.content);
		this.translationInput = new PopupInput('Translation:');
		this.translationInput.reset(card.translation);
		const buttonWrapper = document.createElement('div');
		buttonWrapper.className = 'popup-button-wrapper';
		this.cancelButton = new DCButton('Cancel', this.cancel);
		this.saveButton = new DCButton('Save', this.save);
		buttonWrapper.appendChild(this.cancelButton.elem);
		buttonWrapper.appendChild(this.saveButton.elem);
		wrapper.appendChild(title);
		wrapper.appendChild(this.contentInput.elem);
		wrapper.appendChild(this.translationInput.elem);
		wrapper.appendChild(buttonWrapper);
		this.elem.appendChild(wrapper);
		this.elem.addEventListener('keyup', this.onkeyup);
		document.body.appendChild(this.elem);
		this.contentInput.focus();
	}

	cancel() {
		document.body.removeChild(this.elem);
	}

	save() {
    	updateDoc(doc(this.db, 'users', this.uid, 'collections', this.collectionID, 'decks', this.deckID, 'cards', this.cardID), { content : this.contentInput.value(), translation: this.translationInput.value()})
		this.cardModified(this.contentInput.value(), this.translationInput.value());
    	document.body.removeChild(this.elem);
	}

	onkeyup(e) {
		if (e.keyCode == 13) this.save();
		else if (e.keyCode == 27) this.cancel();
	}
}

export class EditCollectionPopup {
	constructor(db, uid, collectionID, tile, remove) {
		this.exit = this.exit.bind(this);
		this.edit = this.edit.bind(this);
		this.del = this.del.bind(this);
		this.onkeyup = this.onkeyup.bind(this);
		this.elem = document.createElement('div');
		this.elem.className = 'popup';
		this.db = db;
		this.uid = uid;
		this.collectionID = collectionID;
		this.tile = tile;
		this.remove = remove;
		const wrapper = document.createElement('div');
		wrapper.className = 'popup-wrapper';
		const titleWrapper = document.createElement('div');
		titleWrapper.className = 'popup-title-wrapper';
		const title = document.createElement('h2');
		title.textContent = tile.tileName;
		const editButton = document.createElement('img');
		editButton.className = 'popup-edit-button';
		editButton.src = 'edit.svg';
		editButton.addEventListener('click', this.edit);
		const delButton = document.createElement('img');
		delButton.className = 'popup-edit-button';
		delButton.src = 'bin.svg';
		delButton.addEventListener('click', this.del);
		titleWrapper.appendChild(title);
		titleWrapper.appendChild(editButton);
		titleWrapper.appendChild(delButton);
		const exitButton = document.createElement('img');
		exitButton.className = 'popup-exit-button';
		exitButton.src = 'cross.svg';
		exitButton.addEventListener('click', this.exit);
		wrapper.appendChild(titleWrapper);
		wrapper.appendChild(exitButton);
		this.elem.appendChild(wrapper);
		console.log(this.onkeyup);
		this.elem.addEventListener('keyup', this.onkeyup);
		document.body.appendChild(this.elem);
		this.elem.tabIndex = -1;
		this.elem.focus();
	}

	exit() {
		document.body.removeChild(this.elem);
	}

	edit() {
		
	}

	async del() {
		getDocs(collection(this.db, 'users', this.uid, 'collections', this.collectionID, 'decks')).then(colSnap => {
			colSnap.forEach(deck => {
				getDocs(collection(this.db, 'users', this.uid, 'collections', this.collectionID, 'decks', deck.id, 'cards')).then(cardsSnap => {
					cardsSnap.forEach(d => {
						// console.log(`deleting ${d.id}`);
						deleteDoc(doc(this.db, 'users', this.uid, 'collections', this.collectionID, 'decks', deck.id, 'cards', d.id));
					});
					// console.log('deleting deck');
					deleteDoc(doc(this.db, 'users', this.uid, 'collections', this.collectionID, 'decks', deck.id));
				});
			})
			deleteDoc(doc(this.db, 'users', this.uid, 'collections', this.collectionID));
		});
		
		this.remove(this.tile);
		this.exit();
	}

	onkeyup(e) {
		if (e.keyCode == 27) this.exit();
	}
}

export class PopupInput {
	constructor(text, lang='en-EN') {
		this.value = this.value.bind(this);
		this.reset = this.reset.bind(this);
		this.restrictToNums = this.restrictToNums.bind(this);
		this.focus = this.focus.bind(this);
		this.elem = document.createElement('div');
		this.elem.className = 'popup-input';
		const label = document.createElement('p');
		label.textContent = text;
		this.input = document.createElement('input');
		this.input.type = 'text';
		console.log(lang);
		if (lang === 'ja-JP') {
			//console.log('bound');
			//bind(this.input);
		}
		this.elem.appendChild(label);
		this.elem.appendChild(this.input);
	}

	value () {
		return this.input.value;
	}

	reset(text='') {
		this.input.value = text;
	}

	restrictToNums() {
		this.input.type = 'number';
	}

	focus() {
		this.input.focus();
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

export class PopupCheckbox {
	constructor(name, text) {
		this.checked = this.checked.bind(this);
		this.labelClick = this.labelClick.bind(this);
		this.elem = document.createElement('div');
		this.elem.className = 'popup-checkbox-wrapper';
		this.checkbox = document.createElement('input');
		this.checkbox.type = 'checkbox';
		this.checkbox.name = name;
		const label = document.createElement('label');
		label.for = name;
		label.textContent = text;
		label.addEventListener('click', this.labelClick);
		this.elem.appendChild(this.checkbox);
		this.elem.appendChild(label);
	}

	labelClick() {
		this.checkbox.click();
	}

	checked() {
		return this.checkbox.checked;
	}
}