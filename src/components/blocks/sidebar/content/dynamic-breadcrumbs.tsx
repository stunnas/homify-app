"use client";

import { Fragment, useMemo } from "react";
import { usePathname } from "next/navigation";
import { buildFullPathMap } from "@/lib/data/nav-data";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/shadcn/breadcrumb";
import { SoundyBreadcrumbLink } from "@/components/ui/caa/sound/soundy-link";

/**
 * Dynamically builds breadcrumb items based on current URL path.
 */
export function DynamicBreadcrumbs() {
  const pathname = usePathname() || "";
  const segments = pathname.split("/").filter(Boolean); // drop empty from leading "/"

  // Flattened map of all known paths => display labels
  const pathMap = useMemo(() => buildFullPathMap(), []);

  // Build partial paths for each segment
  let cumulativePath = "";
  const crumbs = segments.map((seg) => {
    cumulativePath += `/${seg}`;
    // Either use the label from pathMap or fallback to the raw segment
    const label = pathMap[cumulativePath] || decodeURIComponent(seg);

    return {
      href: cumulativePath,
      label,
    };
  });

  // Render them horizontally
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <Fragment key={crumb.href}>
              <BreadcrumbItem className="inline-flex items-center">
                {isLast ? (
                  // Last crumb: use <BreadcrumbPage> instead of link
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <SoundyBreadcrumbLink href={crumb.href}>
                    {crumb.label}
                  </SoundyBreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator className="mx-2" />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
