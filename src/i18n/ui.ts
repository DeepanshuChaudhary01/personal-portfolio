import type { Lang } from "./config";
import { en, type UI } from "./en";
import { ja } from "./ja";

export const ui: Record<Lang, UI> = { en, ja };
