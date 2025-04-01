import { redirect } from 'next/navigation';
import { getDefaultRouteForProgram } from '@/lib/data/nav-data';

type DashboardPageProps = {
	params: { program: string };
};

export default function DashboardRootPage({ params }: DashboardPageProps) {
	const defaultRoute = getDefaultRouteForProgram(params.program);
	redirect(defaultRoute);

	return null;
}
