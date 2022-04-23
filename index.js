import { bind } from './wanakana.js';
// import * as wanakana from 'wanakana';
// const wanakana = require('wanakana');

let homeCreate = document.getElementById('home-create');
let homeEdit = document.getElementById('home-edit');
let homePractice = document.getElementById('home-practice');

let createDeckPopup = document.getElementById('create-deck-popup');
let createCardPopup = document.getElementById('create-card-popup');
let selectDeckPopup = document.getElementById('select-deck-popup');

let practiceScreen = document.getElementById('practice-screen');

let createDeckName = document.getElementById('create-deck-name');
let createDeckCreate = document.getElementById('create-deck-create');

let createDeckJapaneseText = document.getElementById('create-deck-japanese-text');
bind(createDeckJapaneseText);
let createDeckEnglishText = document.getElementById('create-deck-english-text');
let createDeckAdd = document.getElementById('create-deck-add');
let createDeckFinish = document.getElementById('create-deck-finish');

let selectDeckList = document.getElementById('select-deck-list');

let practiceJapanese = document.getElementById('practice-japanese');
let practiceEnglish = document.getElementById('practice-english');
let nextCard = document.getElementById('next-card');

homeCreate.addEventListener('click', createDeck);
homeEdit.addEventListener('click', editDeck);
homePractice.addEventListener('click', practiceDeck);

createDeckCreate.addEventListener('click', makeDeck);

createDeckAdd.addEventListener('click', addNewCard);
createDeckFinish.addEventListener('click', finishCreateDeck);

nextCard.addEventListener('click', showNextCard);

class Card {
	constructor(japanese, english) {
		this.japanese = japanese;
		this.english = english;
	}
}

class Deck {
	constructor(deckName) {
		this.deckName = deckName;
		this.cards = [];
		this.currJap = 'empty';
		this.currEn = 'empty';
		this.index = 0;
	}

	addCard(newCard) {
		if (this.cards.length === 0) {
			this.currJap = newCard.japanese;
			this.currEn = newCard.english;
		}
		this.cards.push(newCard);
	}

	next() {
		this.index = (this.index+1)%this.cards.length;
		this.currJap = this.cards[this.index].japanese;
		this.currEn = this.cards[this.index].english;
	}
}


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
}

function editDeck() {

}

function practiceDeck() {
	show(selectDeckPopup);
	populateDeckList(selectDeckList);
}

function populateDeckList(deckList) {
	deckList.innerHTML = '';
	decks.forEach(deck => {
		const elem = document.createElement('button');
		elem.textContent = deck.deckName;
		elem.addEventListener('click', startDeckPractice);
		deckList.appendChild(elem);
	});
}

function startDeckPractice(e) {
	// console.log(e);
	let str = e.srcElement.innerHTML;
	decks.forEach(deck => {
		// console.log("Hello");
		// console.log(deck.deckName);
		if (deck.deckName === str) currentDeck = deck;
	});
	hide(selectDeckPopup);
	show(practiceScreen);
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