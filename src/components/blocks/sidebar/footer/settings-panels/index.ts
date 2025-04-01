import { GeneralSettings } from './general-settings';
import { AppearanceSettings } from './appearance-settings';
import { NotificationsSettings } from './notifications-settings';
import { LogsSettings } from './logs-settings';
import { AboutSettings } from './about-settings';

export const settingsRegistry: Record<string, React.FC> = {
	General: GeneralSettings,
	Appearance: AppearanceSettings,
	Notifications: NotificationsSettings,
	Logs: LogsSettings,
	About: AboutSettings,
};
