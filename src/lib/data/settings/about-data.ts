export const APP_VERSION = {
	version: '1.2.0',
	build: '2025.04.02',
};

export const CHANGELOG_ENTRIES = [
	{
		version: '1.2.0',
		changes: [
			'Added support for GPT-4o',
			'Improved memory usage tracking',
			'Fixed startup issues on Windows',
		],
	},
	{
		version: '1.1.0',
		changes: [
			'Added theme customization',
			'Improved error handling',
			'Added concurrent conversation mode',
		],
	},
];

export const LICENSE_LINKS = [
	{
		label: 'View license agreement',
		url: '#license-agreement',
	},
	{
		label: 'Third-party licenses',
		url: '#third-party-licenses',
	},
];

export const ABOUT_SETTINGS_SECTIONS = [
	{
		id: 'versionInfo',
		title: 'Version info',
		type: 'version',
		data: APP_VERSION,
	},
	{
		id: 'changelog',
		title: 'Changelog',
		description: 'View recent changes and updates',
		type: 'changelog',
		data: CHANGELOG_ENTRIES,
		action: {
			label: 'View full changelog',
			icon: 'FileText',
		},
	},
	{
		id: 'license',
		title: 'License',
		description: 'License information and terms of use',
		type: 'links',
		data: LICENSE_LINKS,
	},
];
