"use client";
import type { ComponentProps } from "react";

// Static-host adapter selected only by build:pages. Native navigation avoids
// requiring an RSC server while retaining standard link and keyboard behavior.
export default function PagesLink(props: ComponentProps<"a">) {
  return <a {...props} />;
}
