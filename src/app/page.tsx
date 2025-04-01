import { getDefaultRouteForProgram } from '@/lib/data/nav-data';
import { redirect } from 'next/navigation';

// If user visits "/", automatically redirect them to "home"
export default function IndexRootPage() {
	const homeDefaultRoute = getDefaultRouteForProgram('home');

	redirect(homeDefaultRoute);
	return null;
}
