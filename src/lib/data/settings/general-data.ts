export const STARTUP_OPTIONS = [
	{
		id: 'minimized',
		label: 'Start minimized in system tray',
		description: 'Application will start in the background',
	},
	{
		id: 'maximized',
		label: 'Start maximized',
		description: 'Application will start with the window open',
	},
	{
		id: 'disabled',
		label: "Don't start automatically",
		description: 'Application will not start with your system',
	},
];

export const GENERAL_SETTINGS_SECTIONS = [
	{
		id: 'startup',
		title: 'Startup behavior',
		description: 'Choose how the application behaves when your system starts',
		type: 'radio',
		options: STARTUP_OPTIONS,
		defaultValue: 'minimized',
	},
];
