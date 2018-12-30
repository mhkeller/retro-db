import App from './project/App.html';
import Table from './components/views/Table.html';
import { Store } from 'svelte/store.js';

const store = new Store({
	query: '',
	activeViewId: 'table_0',
	views: [
		{ name: 'Table', id: `table_0`, type: 'Table', component: Table }
	]
});

const app = new App({ // eslint-disable-line no-unused-vars
	target: document.body,
	store
});
