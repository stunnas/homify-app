export const LOGS_SETTINGS_SECTIONS = [
	{
		id: 'verboseLogs',
		title: 'Enable verbose logs',
		description: 'Show detailed logs for debugging purposes',
		type: 'switch',
		defaultValue: false,
	},
	{
		id: 'consoleOverlay',
		title: 'Show console overlay',
		description: 'Display a console overlay for real-time log viewing',
		type: 'switch',
		defaultValue: false,
	},
	{
		id: 'saveLogsToFile',
		title: 'Save all logs to file',
		description: 'Automatically save logs to a file on disk',
		type: 'switch',
		defaultValue: false,
		hasAction: true,
		actionLabel: 'Download current logs',
		actionIcon: 'Download',
	},
];
