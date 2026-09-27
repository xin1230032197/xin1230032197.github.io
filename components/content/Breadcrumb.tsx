import { Fragment } from "react";
import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/content-types";
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="breadcrumb" aria-label="面包屑">
      {items.map((item, i) => (
        <Fragment key={item.href}>
          {i > 0 && <span aria-hidden="true">/</span>}
          {i === items.length - 1 ? (
            <span aria-current="page">{item.title}</span>
          ) : (
            <Link href={item.href}>{item.title}</Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
