// import { oauthSignIn } from '../src/auth.js';

// const signInButton = document.getElementById('sign-in');
// signInButton.addEventListener('click', signIn);

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, collection, getDocs, getDoc, doc, setDoc } from 'firebase/firestore';
import { Toolbar } from './Toolbar.js';
import { WelcomePage } from './WelcomePage.js';
import { AboutPage } from './AboutPage.js';
import { HomePage } from './HomePage.js';

const firebaseApp = initializeApp({
	apiKey: "AIzaSyCuDxW2ScyEX6X8nXmk44FVO_7UfS5v2Dw",
	authDomain: "drongocards.firebaseapp.com",
	projectId: "drongocards",
	storageBucket: "drongocards.appspot.com",
	messagingSenderId: "623529747094",
	appId: "1:623529747094:web:27c4bcf28d66ea0e9f18b7"
});

const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();
const db = getFirestore(firebaseApp);


onAuthStateChanged(auth, user => {
	if (user !== null) {
		console.log('Logged in!');
		homePage = new HomePage(db, user.uid);
		content.appendChild(homePage.elem);
		showHome();
	} else {
		console.log('No user');
	}
});

const header = document.getElementById('header');
const toolbar = new Toolbar(signIn, showAbout);
header.appendChild(toolbar.elem);

const content = document.getElementById('content');
const welcomePage = new WelcomePage();
const aboutPage = new AboutPage();
let homePage = undefined;
content.appendChild(welcomePage.elem);
content.appendChild(aboutPage.elem);


const title = document.getElementById('title');
title.addEventListener('click', showWelcome);

function signIn() {
	signInWithPopup(auth, provider)
	  .then(async (result) => {
	    // This gives you a Google Access Token. You can use it to access the Google API.
	    const credential = GoogleAuthProvider.credentialFromResult(result);
	    const token = credential.accessToken;
	    // The signed-in user info.
	    const user = result.user;
	    console.log(result);
	    console.log(user);
	    const userExists = await userInDatabase(user.uid);
	    console.log(userExists);
	    if (!userExists) await initNewUserInDatabase(user);
	    // ...
	  }).catch((error) => {
	    // Handle Errors here.
	    const errorCode = error.code;
	    const errorMessage = error.message;
	    // The email of the user's account used.
	    const email = error.email;
	    // The AuthCredential type that was used.
	    const credential = GoogleAuthProvider.credentialFromError(error);
	    // ...
	    console.log(error);
	  });
}

async function userInDatabase(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  console.log(snap);
  console.log(snap.exists());
  return snap.exists();
}

async function initNewUserInDatabase(user) {

  const users = collection(db, 'users');
  await setDoc(doc(users, user.uid), { name: user.displayName, collections: [] });

}

function showAbout() {
	if (homePage !== undefined) homePage.elem.style.visibility = 'hidden';
	welcomePage.elem.style.visibility = 'hidden';
	aboutPage.elem.style.visibility = 'visible';
}

function showWelcome() {
	if (homePage !== undefined) homePage.elem.style.visibility = 'hidden';
	aboutPage.elem.style.visibility = 'hidden';
	welcomePage.elem.style.visibility = 'visible';
}

function showHome() {
	welcomePage.elem.style.visibility = 'hidden';
	aboutPage.elem.style.visibility = 'hidden';
	homePage.elem.style.visibility = 'visible';
}

// async function test() {
// try {
// 	const testData = await getDocs(collection(db, 'users'));
// 	let id = '';
// 	testData.forEach(doc => {
// 		console.log(doc);
// 		console.log(doc.id);
// 		id = doc.id;
// 	});
// 	const test2 = await getDoc(doc(db, 'users', id));
// 	console.log(test2);
// 	console.log(test2.data().name);
// } catch (e) {
// 	console.log(e);
// }
// }

// test();