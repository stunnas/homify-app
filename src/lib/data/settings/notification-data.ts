export const NOTIFICATION_SETTINGS_SECTIONS = [
	{
		id: 'desktopNotifications',
		title: 'Desktop notifications',
		description: 'Receive notifications when responses are ready',
		type: 'switch',
		defaultValue: true,
	},
	{
		id: 'errorAlerts',
		title: 'Error alerts',
		description: 'Get notified when an error occurs',
		type: 'switch',
		defaultValue: true,
	},
	{
		id: 'idleAlerts',
		title: 'Claude idle alerts',
		description: 'Get notified when Claude has been idle for a long time',
		type: 'switch',
		defaultValue: false,
	},
];
