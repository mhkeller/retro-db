import App from './project/App.html';
import Table from './components/views/Table.html';
import MapView from './components/views/Map.html';
import { Store } from 'svelte/store.js';
import ShortUniqueId from 'short-unique-id';
const uid = new ShortUniqueId();

// const tableId = `table_${uid.randomUUID(6)}`;

const viewRegistry = [
	{ name: 'Table', type: 'Table', component: Table },
	{ name: 'Map', type: 'Map', component: MapView }
];

function genNewView (type) {
	return Object.assign(
		{ id: `${type}_${uid.randomUUID(6)}` },
		viewRegistry.filter(d => d.type === type)[0]);
}

const tableView = genNewView('Table');

const store = new Store({
	query: '',
	activeViewId: tableView.id,
	views: [
		tableView
	],
	viewRegistry,
	genNewView
});

const app = new App({ // eslint-disable-line no-unused-vars
	target: document.body,
	store
});
