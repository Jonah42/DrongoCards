export class Card {
	constructor(japanese, english) {
		this.japanese = japanese;
		this.english = english;
	}
}

export class Deck {
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