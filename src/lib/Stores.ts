import { writable } from 'svelte/store';
import type Cell from './Cell.svelte';
import { DoublyLinkedList } from './DoublyLinkedList';
import type TextArea from './TextArea.svelte';

export const cell_separator = '\n--Cell--Separator--\n' as const;
export const app_name = 'SQLite-Notebook' as const;

export interface ICell {
    component?: Cell,
    init: boolean,
    id?: number,
    idx?: number,
    textarea?: TextArea
};

export const notebook = writable(new DoublyLinkedList<ICell>())
