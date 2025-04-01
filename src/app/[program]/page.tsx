import { redirect } from 'next/navigation';
import { getDefaultRouteForProgram } from '@/lib/data/nav-data';

export default function ProgramRootPage({
	params,
}: {
	params: { program: string };
}) {
	const defaultRoute = getDefaultRouteForProgram(params.program);
	redirect(defaultRoute);

	return null;
}
