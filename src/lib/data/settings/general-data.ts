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

export const AGENT_OPTIONS = [
	{ id: 'claude', label: 'Claude' },
	{ id: 'gpt', label: 'ChatGPT' },
];

export const MODE_OPTIONS = [
	{ id: 'new', label: 'New conversation' },
	{ id: 'concurrent', label: 'Concurrent conversation' },
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
	{
		id: 'defaultAgent',
		title: 'Default agent (Claude / GPT)',
		description: 'Select which AI agent to use by default',
		type: 'select',
		options: AGENT_OPTIONS,
		defaultValue: 'claude',
	},
	{
		id: 'defaultMode',
		title: 'Default mode (new/concurrent)',
		description: 'Choose the default conversation mode',
		type: 'radio',
		options: MODE_OPTIONS,
		defaultValue: 'concurrent',
	},
];
