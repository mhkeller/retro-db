import App from './project/App.html';
import { Store } from 'svelte/store.js';

const store = new Store({
	query: ''
});

const app = new App({ // eslint-disable-line no-unused-vars
	target: document.body,
	store
});
