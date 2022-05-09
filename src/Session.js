
import { DCButton } from './DCButton.js';

export class Session {
	constructor(deck) {
		this.proceed = this.proceed.bind(this);
		this.exit = this.exit.bind(this);
		this.elem = document.createElement('div');
		this.elem.className = 'session-wrapper';
		this.deck = deck;
		this.q = true;
		this.count = 0;
		const client = document.createElement('div');
		client.className = 'session-client';
		const title = document.createElement('h2');
		title.textContent = deck.deckName;
		title.className = 'session-title';
		this.progress = new ProgressBar();
		this.contentsBox = document.createElement('div');
		this.contentsBox.className = 'session-contents-box';
		this.contentsBox.textContent = deck.currContent;
		this.remarkBox = document.createElement('div');
		this.remarkBox.className = 'session-remark-box';
		this.remarkBox.textContent = 'dummy';
		this.responseBox = document.createElement('input');
		this.responseBox.className = 'session-response-box';
		this.responseBox.placeholder = 'Aa';
		this.proceedButton = new DCButton('Check', this.proceed);
		const exitButton = document.createElement('img');
		exitButton.className = 'session-exit-button';
		exitButton.src = 'cross.svg';
		exitButton.addEventListener('click', this.exit);
		client.appendChild(title);
		client.appendChild(this.progress.elem);
		client.appendChild(this.contentsBox);
		client.appendChild(this.remarkBox);
		client.appendChild(this.responseBox);
		client.appendChild(this.proceedButton.elem);
		this.elem.appendChild(client);
		this.elem.appendChild(exitButton);
		document.body.appendChild(this.elem);
	}

	proceed() {
		if (this.q) {
			this.responseBox.readOnly = true;
			if (this.responseBox.value === this.deck.currTranslation) {
				this.remarkBox.style.backgroundColor = 'lightgreen';
				this.remarkBox.textContent = 'Nice!';
			} else {
				this.remarkBox.style.backgroundColor = 'salmon';
				this.remarkBox.textContent = `The correct answer was '${this.deck.currTranslation}'`;
			}
			this.remarkBox.style.visibility = 'visible';
			this.proceedButton.setText('Continue');
			this.count++;
			this.progress.update(this.count*100/this.deck.length);
			this.q = false;
		} else {
			this.remarkBox.style.visibility = 'hidden';
			this.responseBox.readOnly = false;
			this.responseBox.value = '';
			this.proceedButton.setText('Check');
			this.deck.next();
			this.contentsBox.textContent = this.deck.currContent;
			this.q = true;
		}
	}

	exit() {
		document.body.removeChild(this.elem);
	}
}

export class ProgressBar {
	constructor() {
		this.update = this.update.bind(this);
		this.elem = document.createElement('div');
		this.elem.className = 'progress-bar-wrapper';
		this.bar = document.createElement('div');
		this.bar.className = 'progress-bar';
		this.elem.appendChild(this.bar);
		this.progress = 0;
		this.bar.style.width = `${Math.max(this.progress, 1)}%`;
	}

	update(num) {
		this.progress = Math.max(Math.min(parseInt(num), 100), 0);
		this.bar.style.width = `${Math.max(this.progress, 1)}%`;
	}
}