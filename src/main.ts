import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
// import * as child_process from 'child_process';
import { app, BrowserWindow, ipcMain } from 'electron';
// import exec from './shared/exec';

import readJSON from './shared/readJSON';
import connectPg from './shared/connectPg';
// import loadSqlite from './shared/loadSqlite';
import pgTypeLookup from './shared/pg-type-lookup.json';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let launcherWindow = null;
let projectWindow;
let processes = {};

const userData = app.getPath('userData');
console.log('user', userData);
const recent = readJSON(path.join(userData, 'recent.json')) || {
	pg: [],
	url: [],
	sqlite: []
};

const mode = process.env.NODE_ENV;

// const menu = new Menu();

// var template = [{
// 	label: 'File',
// 	submenu: [
// 		{label: 'New', click: () => launch()},
// 		{label: 'Open', click: () => console.log('open')},
// 		{label: 'Save', click: () => console.log('save')},
// 		{label: 'Save As', click: () => console.log('save as')}
// 	]
// }];

// menu.append(new MenuItem({
// 	label: 'y'
// }));

function reloadOnChange (win) {
	if (mode !== 'development') return { close: () => {} };

	const watcher = require('chokidar').watch(path.join(__dirname, '**'), { ignoreInitial: true });

	watcher.on('change', () => {
		win.reload();
	});

	return watcher;
}

function launch () {
	launcherWindow = new BrowserWindow({
		width: 500,
		height: 500,
		minWidth: 200,
		backgroundColor: 'white',
		titleBarStyle: 'hidden'
	});

	launcherWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, '../pages/launcher.html'),
			protocol: 'file:',
			slashes: true
		})
	);

	const watcher = reloadOnChange(launcherWindow);

	launcherWindow.on('closed', function () {
		// launcherWindow = null;
		watcher.close();
	});
}

function openProject (flavor) {
	projectWindow = new BrowserWindow({
		title: `${flavor} project`,
		backgroundColor: '#111',
		width: 500,
		height: 500,
		titleBarStyle: 'hidden',
		tabbingIdentifier: 'lulz'
	});
	projectWindow.toggleTabBar();

	projectWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, `../pages/project.html`),
			protocol: 'file:',
			slashes: true
		})
	);

	const watcher = reloadOnChange(projectWindow);

	projectWindow.on('closed', function () {
		// shut down child processes
		Object.keys(processes).forEach(dir => {
			processes[dir].kill();
			processes[dir] = null;
		});

		projectWindow = null;
		watcher.close();
	});

	projectWindow.on('reload', function () {
		// shut down child processes
		Object.keys(processes).forEach(dir => {
			processes[dir].kill();
			processes[dir] = null;
		});
	});

	projectWindow.flavor = flavor;

	launcherWindow.close();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', launch);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	launcherWindow = null;
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (launcherWindow === null) {
		launch();
	}
});

let pool;
ipcMain.on('connect-pg', (event, constring) => {
	event.sender.send('status', 'connecting...');
	pool = connectPg(event, constring);
	event.sender.send('status', 'success');
	saveConnection(constring, 'pg');
	openProject('pg');
});

ipcMain.on('query-pg', (event, query) => {
	const q = query.trim();
	pool.query(q, (err, res) => {
		if (err) {
			event.sender.send('query-error', err, err.message);
			return;
		}
		const cleanFields = res.fields.map(d => {
			return {name: d.name, type: pgTypeLookup[d.dataTypeID]};
		});
		event.sender.send('query-ok', {query: q, rows: res.rows, fields: cleanFields});
	});
});

ipcMain.on('connect-url', (event, constring) => {
	saveConnection(constring, 'url');
	openProject('url');
});

let db;
ipcMain.on('load-sqlite', (event, filePath) => {
	event.sender.send('status', 'loading...');
	// Another option is to copy the sqlite file to a new project folder
	// const targetPath = path.join(userData, path.basename(filePath);
	// fs.copyFileSync(filePath, targetPath);
	// db = loadSqlite(targetPath);
	// db = loadSqlite(filePath);
	event.sender.send('status', 'success');
	openProject('pg');
});

ipcMain.on('query-sqlite', (event, query) => {
	db.each(query, function (err, row) {
		if (err) {
			event.sender.send('query-error', err);
		}
		// event.sender.send('query-ok', res.rows);
		// console.log(row.id + ": " + row.info);
	});
});

function saveConnection (constring, which) {
	const list = recent[which];
	const index = list.indexOf(constring);
	if (index !== -1) list.splice(index, 1);
	list.unshift(constring);
	while (list.length > 5) list.pop();
	fs.writeFileSync(path.join(userData, 'recent.json'), JSON.stringify(recent));
}

// ipcMain.on('open-existing-project', (event, dir) => {
// 	if (dir) {
// 		openProject(dir);
// 	} else {
// 		dialog.showOpenDialog(launcherWindow, {
// 			title: 'Open project',
// 			buttonLabel: 'Open project',
// 			properties: ['openDirectory'],
// 		}, async (filenames) => {
// 			if (!filenames) return;

// 			// bizarrely, without the setTimeout the launcher
// 			// window doesn't close. ????
// 			setTimeout(() => {
// 				openProject(filenames[0]);
// 			}, 0);
// 		});
// 	}
// });
