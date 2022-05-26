
import { DCButton } from './DCButton.js';

const maxModes = 4;

export class Session {
	constructor(deck, numCards, mode) {
		console.log(numCards);
		this.chooseMode = this.chooseMode.bind(this);
		this.compare = this.compare.bind(this);
		this.proceed = this.proceed.bind(this);
		this.pronounce = this.pronounce.bind(this);
		this.populateVoiceList = this.populateVoiceList.bind(this);
		this.exit = this.exit.bind(this);
		this.onkeyup = this.onkeyup.bind(this);
		this.elem = document.createElement('div');
		this.elem.className = 'session-wrapper';
		this.deck = deck;
		this.q = true;
		this.count = 0;
		this.numCards = numCards;
		this.mode = mode;
		this.currMode = this.chooseMode();
		this.deck.shuffle();
		const client = document.createElement('div');
		client.className = 'session-client';
		const title = document.createElement('h2');
		title.textContent = deck.deckName;
		title.className = 'session-title';
		this.progress = new ProgressBar();
		this.contentsBox = document.createElement('div');
		this.contentsBox.className = 'session-contents-box';
		this.contentsBox.textContent = isLangTextToEngText(this.currMode) ? deck.currContent : '🔊';
		this.contentsBox.addEventListener('click', this.pronounce);
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
		this.elem.addEventListener('keyup', this.onkeyup);
		document.body.appendChild(this.elem);
		this.responseBox.focus();
		this.voice = null;
		this.synth = window.speechSynthesis;
		this.populateVoiceList();
		if (speechSynthesis.onvoiceschanged !== undefined) {
		  speechSynthesis.onvoiceschanged = this.populateVoiceList;
		}
	}

	chooseMode() {
		let pos = [];
		for (let i = 0; i < maxModes; i++) {
			if (this.mode & (0x1 << i)) pos.push(i);
		}
		return 1 << pos[Math.round(Math.random()*(pos.length-1))];
	}

	compare(given, correct) {
		given = given.toLowerCase();
		correct = correct.toLowerCase();
		const dist = LevenshteinDistance(given, correct);
		if (dist == 0) return 1;
		if (dist <= 2 || dist/correct.length < 0.05) return 2;
		return 0;
	}

	proceed() {
		if (this.q) {
			this.responseBox.readOnly = true;
			const c = this.compare(this.responseBox.value, this.deck.currTranslation);
			if (c == 1) {
				this.remarkBox.style.backgroundColor = 'lightgreen';
				this.remarkBox.textContent = 'Nice!';
			} else if (c == 2) {
				this.remarkBox.style.backgroundColor = 'peachpuff';
				this.remarkBox.textContent = `Careful - you have a typo. Correct response was '${this.deck.currTranslation}'`;
			} else {
				this.remarkBox.style.backgroundColor = 'salmon';
				this.remarkBox.textContent = `The correct answer was '${this.deck.currTranslation}'`;
			}
			this.remarkBox.style.visibility = 'visible';
			this.proceedButton.setText('Continue');
			this.count++;
			this.progress.update(this.count*100/this.numCards);
			this.q = false;
		} else {
			if (this.count === this.numCards) {
				document.body.removeChild(this.elem);
			} else {
				this.remarkBox.style.visibility = 'hidden';
				this.responseBox.readOnly = false;
				this.responseBox.value = '';
				this.responseBox.focus();
				this.proceedButton.setText('Check');
				this.deck.next();
				this.currMode = this.chooseMode();
				this.contentsBox.textContent = isLangTextToEngText(this.currMode) ? this.deck.currContent : '🔊';
				this.q = true;
				this.pronounce();
			}
		}
	}

	populateVoiceList() {
		const voices = this.synth.getVoices();
		voices.forEach(voice => {
			if (this.deck.lang === voice.lang) this.voice = voice;
		});
		this.pronounce();
	}

	pronounce() {
		if (this.voice !== null) {
			const utterThis = new SpeechSynthesisUtterance(this.deck.currContent);
			utterThis.voice = this.voice;
			this.synth.speak(utterThis);
		}
	}

	exit() {
		document.body.removeChild(this.elem);
	}

	onkeyup(e) {
		if (e.keyCode == 13) this.proceed();
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

function LevenshteinDistance(s, t) {
    const n = t.length;
    const m = s.length;
    // create two work vectors of integer distances
    let v0 = [];
    let v1 = [];

    // initialize v0 (the previous row of distances)
    // this row is A[0][i]: edit distance from an empty s to t;
    // that distance is the number of characters to append to  s to make t.
    for (let i = 0; i <= n; i++) {
       v0[i] = i;
    }

    for (let i = 0; i < m; i++) {
      // calculate v1 (current row distances) from the previous row v0

      // first element of v1 is A[i + 1][0]
      //   edit distance is delete (i + 1) chars from s to match empty t
      v1[0] = i + 1;

      // use formula to fill in the rest of the row
      for (let j = 0; j < n; j++) {
        // calculating costs for A[i + 1][j + 1]
        let deletionCost = v0[j + 1] + 1;
        let insertionCost = v1[j] + 1;
        let substitutionCost = s[i] === t[j] ? v0[j] : v0[j] + 1;

        v1[j + 1] = Math.min(deletionCost, insertionCost, substitutionCost);
      }

      // copy v1 (current row) to v0 (previous row) for next iteration
      // since data in v1 is always invalidated, a swap without copy could be more efficient
      let tmp = v1;
      v1 = v0;
      v0 = tmp;
    }
    // after the last swap, the results of v1 are now in v0
    return v0[n];
}

function isLangTextToEngText(mode) {
	return mode&0x1;	
}

function isLangSoundToEngSound(mode) {
	return mode&0x2;
}