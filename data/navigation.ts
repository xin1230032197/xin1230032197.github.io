/** Compatibility entry point: navigation comes from the compiled content tree. */
import treeNavigation from "virtual:codex-navigation";
export const navigation = treeNavigation;
export { site } from "./site";
export type { PrimarySection, SecondarySection } from "@/lib/content-types";
