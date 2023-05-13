import type { SvelteComponent } from "svelte";
import { writable } from "svelte/store";

export const ids = writable<number[]>([0]);
export const cells = writable<SvelteComponent[]>([]);