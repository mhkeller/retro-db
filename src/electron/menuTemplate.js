export function menuTemplate (app, { launch, openPopout }) {
	const template = [{
		label: 'File',
		submenu: [{
			label: 'New Window',
			accelerator: 'CmdOrCtrl+N',
			click () {
				openPopout();
			}
		},
		{
			label: 'New Tab',
			accelerator: 'CmdOrCtrl+T',
			click () {
				openPopout(null, null, true);
			}
		},
		{
			label: 'New Database Connection',
			accelerator: 'CmdOrCtrl+Shift+N',
			click () {
				launch();
			}
		}
		]
	},
	{
		label: 'Edit',
		submenu: [{
			role: 'undo'
		},
		{
			role: 'redo'
		},
		{
			type: 'separator'
		},
		{
			role: 'cut'
		},
		{
			role: 'copy'
		},
		{
			role: 'paste'
		},
		{
			role: 'pasteandmatchstyle'
		},
		{
			role: 'delete'
		},
		{
			role: 'selectall'
		}
		]
	},
	{
		label: 'View',
		submenu: [{
			role: 'reload'
		},
		{
			role: 'forcereload'
		},
		{
			role: 'toggledevtools'
		},
		{
			type: 'separator'
		},
		{
			role: 'resetzoom'
		},
		{
			role: 'zoomin'
		},
		{
			role: 'zoomout'
		},
		{
			type: 'separator'
		},
		{
			role: 'togglefullscreen'
		}
		]
	},
	{
		role: 'window',
		submenu: [{
			role: 'minimize'
		},
		{
			role: 'close'
		}
		]
	}];

	if (process.platform === 'darwin') {
		template.unshift({
			label: app.getName(),
			submenu: [{
				role: 'about'
			},
			{
				type: 'separator'
			},
			{
				role: 'services',
				submenu: []
			},
			{
				type: 'separator'
			},
			{
				role: 'hide'
			},
			{
				role: 'hideothers'
			},
			{
				role: 'unhide'
			},
			{
				type: 'separator'
			},
			{
				role: 'quit'
			}]
		});

		// Edit menu
		template[2].submenu.push({
			type: 'separator'
		}, {
			label: 'Speech',
			submenu: [{
				role: 'startspeaking'
			},
			{
				role: 'stopspeaking'
			}
			]
		});

		// Window menu
		template[4].submenu = [{
			role: 'close'
		},
		{
			role: 'minimize'
		},
		{
			role: 'zoom'
		},
		{
			type: 'separator'
		},
		{
			role: 'front'
		}];
	};

	return template;
}
