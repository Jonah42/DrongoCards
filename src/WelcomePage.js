

export class WelcomePage {
	constructor() {
		this.showHow = this.showHow.bind(this);
		this.elem = document.createElement('div');
		this.elem.className = 'welcome-page-divisor';
		const leftWrapper = document.createElement('div');
		leftWrapper.className = 'welcome-page-left-wrapper'
		const rightWrapper = document.createElement('div');
		rightWrapper.className = 'welcome-page-right-wrapper'
		const description = document.createElement('p');
		description.className = 'welcome-page-description';
		description.textContent = 'Flash cards for language learning';
		const howButton = document.createElement('div');
		howButton.className = 'welcome-button';
		howButton.textContent = 'How does it work?';
		leftWrapper.appendChild(description);
		leftWrapper.appendChild(howButton);
		this.elem.appendChild(leftWrapper);
		this.elem.appendChild(rightWrapper);
		howButton.addEventListener('click', this.showHow);
	}

	showHow() {
		
	}
}