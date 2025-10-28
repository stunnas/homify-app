import { notFound } from "next/navigation";
import { PROGRAMS, NAV_DATA, NavSubItem } from "@/lib/data/nav-data";

export default function ProgramDashboardSubpage({
  params,
}: {
  params: { program: string; subpage: string };
}) {
  const { program, subpage } = params;

  // 1) Find the Program object that matches the slug
  const foundProgram = PROGRAMS.find((p) => p.slug === program);
  if (!foundProgram) {
    notFound();
  }

  // 2. Get that program's nav structure
  const navItemsForProgram = NAV_DATA[foundProgram.name];
  if (!navItemsForProgram || navItemsForProgram.length === 0) {
    notFound();
  }

  // 3. Try to find the specific subpage entry across all nav items
  //    e.g. "programs", "about", "sessions", "projects", etc.
  let matchedSubItem: NavSubItem | null = null;

  for (const navItem of navItemsForProgram) {
    if (!navItem.items) continue;
    for (const subItem of navItem.items) {
      if (subItem.url === subpage) {
        matchedSubItem = subItem;
        break;
      }
    }
    if (matchedSubItem) break;
  }

  if (!matchedSubItem) {
    notFound();
  }

  // 4. If the subpage has a component, render it.
  if (matchedSubItem.codeblock) {
    const SubComponent = matchedSubItem.codeblock;
    return (
      <div className="p-8 overflow-hidden">
        <SubComponent programSlug={program} subpageSlug={subpage} />
      </div>
    );
  }

  // 5. Fallback if there's no component wired yet
  return (
    <div className="p-8 border border-border rounded-md">
      <p className="text-muted-foreground">
        No component hooked up for &quot;{matchedSubItem.url}&quot; yet.
      </p>
    </div>
  );
}
