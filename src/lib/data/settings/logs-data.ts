export const LOGS_SETTINGS_SECTIONS = [
	{
		id: 'verboseLogs',
		title: 'Verbose logs',
		description: 'Show detailed logs for debugging purposes',
		label: 'Enable verbose logging',
		type: 'switch',
		defaultValue: false,
	},
	{
		id: 'saveLogsToFile',
		title: 'Save all logs to file',
		description: 'Automatically save logs to a file on disk',
		label: 'Save logs to file',
		type: 'switch',
		defaultValue: false,
		hasAction: true,
		actionLabel: 'Download current logs',
		actionIcon: 'Download',
	},
];
