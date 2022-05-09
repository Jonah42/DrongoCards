

export class AboutPage {
	constructor() {
		this.elem = document.createElement('div');
		this.elem.className = 'about-page-wrapper';
		const description = document.createElement('p');
		description.className = 'about-page-description';
		description.innerHTML = 'DrongoCards was created in 2022 from the frustrations of other language-learning products which seemed to be profit-driven rather than learning-inspired. It is a free platform for you to create flash cards to aid in learning a language.<br><br>DrongoCards aims to make flash card creation and sharing as easy as possible, ideal for high school, university, or home language learners.<br><br>DrongoCards is proudly created and maintained by <a href="www.jmeggs.net">Drongo</a> :)';
		this.elem.appendChild(description);
	}
}