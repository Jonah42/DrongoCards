export class Card {
	constructor(content, translation) {
		this.content = content;
		this.translation = translation;
	}
}

export class Deck {
	constructor(deckName) {
		this.deckName = deckName;
		this.cards = [];
		this.currContent = 'empty';
		this.currTranslation = 'empty';
		this.index = 0;
		this.length = 0;
	}

	addCard(newCard) {
		if (this.cards.length === 0) {
			this.currContent = newCard.content;
			this.currTranslation = newCard.translation;
		}
		this.cards.push(newCard);
		this.length++;
	}

	next() {
		this.index = (this.index+1)%this.cards.length;
		this.currContent = this.cards[this.index].content;
		this.currTranslation = this.cards[this.index].translation;
	}
}