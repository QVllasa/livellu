import {atomWithDefault} from "jotai/utils";
import {NavigationItem} from "@/types";
import {fetchNavigation} from "@/framework/navigation.ssr";

export const allNavigation =
    atomWithDefault<NavigationItem[]>(() => fetchNavigation({}));
