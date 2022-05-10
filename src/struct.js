export class Card {
	constructor(content, translation, id) {
		this.content = content;
		this.translation = translation;
		this.id = id;
	}
}

export class Deck {
	constructor(deckName, lang) {
		this.deckName = deckName;
		this.cards = [];
		this.currContent = 'empty';
		this.currTranslation = 'empty';
		this.index = 0;
		this.length = 0;
		this.lang = lang;
	}

	addCard(newCard) {
		if (this.cards.length === 0) {
			this.currContent = newCard.content;
			this.currTranslation = newCard.translation;
		}
		this.cards.push(newCard);
		this.length++;
	}

	removeCard(id) {
		const index = this.cards.findIndex(card => {return card.id === id;});
		this.cards.splice(index, 1);
	}

	next() {
		this.index = (this.index+1)%this.cards.length;
		if (this.index === 0) this.shuffle();
		this.currContent = this.cards[this.index].content;
		this.currTranslation = this.cards[this.index].translation;
	}

	shuffle() {
		for (let i = this.cards.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
		}
	}
}