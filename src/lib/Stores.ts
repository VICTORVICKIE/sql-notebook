import type { SvelteComponent } from 'svelte';
import { derived, writable } from 'svelte/store';

export const ids = writable<number[]>([0]);
export const cells = writable<SvelteComponent[]>([]);
export const active_cell_idx = writable<number>(0);
// make a derived store based on idx and cells
export const active_cell = derived(
    [active_cell_idx, cells],
    ([$active_cell_idx, $cells]) => $cells[$active_cell_idx]
);

export const sync = derived([ids, cells], ([$ids, $cells]) => $ids.length === $cells.length);
export const populated = writable<boolean>(false);

export const cell_separator = '\n--Cell--Separator--\n' as const;
export const app_name = 'SQLite-Notebook' as const;
