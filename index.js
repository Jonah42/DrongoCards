import { bind } from './wanakana.js';
import { Card, Deck, DeckTile } from './Deck.js';

let addDeck = document.getElementById('add-deck');

let createDeckPopup = document.getElementById('create-deck-popup');
let createCardPopup = document.getElementById('create-card-popup');

let practiceScreen = document.getElementById('practice-screen');

let createDeckName = document.getElementById('create-deck-name');
let createDeckCreate = document.getElementById('create-deck-create');

let createDeckJapaneseText = document.getElementById('create-deck-japanese-text');
bind(createDeckJapaneseText);
let createDeckEnglishText = document.getElementById('create-deck-english-text');
let createDeckAdd = document.getElementById('create-deck-add');
let createDeckFinish = document.getElementById('create-deck-finish');

let practiceJapanese = document.getElementById('practice-japanese');
let practiceEnglish = document.getElementById('practice-english');
let nextCard = document.getElementById('next-card');

addDeck.addEventListener('click', createDeck);

createDeckCreate.addEventListener('click', makeDeck);

createDeckAdd.addEventListener('click', addNewCard);
createDeckFinish.addEventListener('click', finishCreateDeck);

nextCard.addEventListener('click', showNextCard);




const numbersJap = ['いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅ'];
const numbersEn = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const hiraganaJap = ['ち', 'い', 'に', 'さ', 'ん', 'よ', 'ろ', 'く', 'な', 'は'];
const hiraganaEn = ['chi', 'i', 'ni', 'sa', 'n', 'yo', 'ro', 'ku', 'na', 'ha'];
const deck1 = new Deck('Hiragana 1');
const deck2 = new Deck('Numbers 1');
for (let i = 0; i < hiraganaJap.length; i++) {
	deck1.addCard(new Card(hiraganaJap[i], hiraganaEn[i]));
}
for (let i = 0; i < numbersJap.length; i++) {
	deck2.addCard(new Card(numbersJap[i], numbersEn[i]));
}
const decks = [deck1, deck2];
let currentDeck = deck1;

let deckList = document.getElementById('deck-list');
let deckTiles = [new DeckTile(deck1, practiceDeck), new DeckTile(deck2, practiceDeck)];
deckTiles.forEach(dt => {deckList.appendChild(dt.elem);});

function createDeck() {
	show(createDeckPopup);
}

function makeDeck(event) {
	currentDeck = new Deck(createDeckName.value);
	decks.push(currentDeck);
	hide(createDeckPopup);
	createDeckName.value = '';
	show(createCardPopup);
}

function addNewCard() {
	currentDeck.addCard(new Card(createDeckJapaneseText.value, createDeckEnglishText.value));
	createDeckJapaneseText.value = '';
	createDeckEnglishText.value = '';
}

function finishCreateDeck() {
	createDeckJapaneseText.value = '';
	createDeckEnglishText.value = '';
	hide(createCardPopup);
	const newDeck = new DeckTile(currentDeck, practiceDeck);
	deckList.appendChild(newDeck.elem);
}

function editDeck() {

}

function practiceDeck(deck) {
	currentDeck = deck;
	show(practiceScreen);
	document.getElementById('practice-deck-name').textContent = deck.deckName;
	practiceJapanese.textContent = currentDeck.currJap;
	practiceEnglish.textContent = currentDeck.currEn;
}

function showNextCard() {
	currentDeck.next();
	practiceJapanese.textContent = currentDeck.currJap;
	practiceEnglish.textContent = currentDeck.currEn;
}

function show(element) {
	element.style.visibility = 'visible';
}

function hide(element) {
	element.style.visibility = 'hidden';
}