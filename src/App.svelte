<script lang="ts">
    import { confirm, open, save } from '@tauri-apps/api/dialog';
    import { TauriEvent } from '@tauri-apps/api/event';
    import {
        BaseDirectory,
        createDir,
        exists,
        readTextFile,
        removeFile,
        writeTextFile
    } from '@tauri-apps/api/fs';
    import { join } from '@tauri-apps/api/path';
    import { appWindow } from '@tauri-apps/api/window';
    import { onMount, tick } from 'svelte';

    import Cell from './lib/Cell.svelte';
    import { app_name, cell_separator, notebook, type ICell } from './lib/Stores';

    appWindow.listen(TauriEvent.WINDOW_CLOSE_REQUESTED, async () => {
        const confirmed = await confirm('Quit SQLite Book?');
        if (confirmed) {
            const temp_db = await join(app_name, 'temp.db');
            const temp_db_exists = await exists(temp_db, { dir: BaseDirectory.LocalData });

            if (temp_db_exists) await removeFile(temp_db, { dir: BaseDirectory.LocalData });
            appWindow.close();
        }
    });

    onMount(initialize);

    async function initialize() {
        const db_dir_exists = await exists(app_name, { dir: BaseDirectory.LocalData });
        if (!db_dir_exists) {
            await createDir(app_name, { dir: BaseDirectory.LocalData });
        }
        const cell: ICell = { init: false };
        cell.id = $notebook.append(cell);
        $notebook = $notebook;
    }

    async function insert_cell(idx: number) {
        const cell: ICell = { init: false };
        cell.id = $notebook.insert(cell, idx);
        $notebook = $notebook;
    }

    async function get_sqlnb(): Promise<string> {
        let cell_sequels = [];
        for (const cell of $notebook.iter()) {
            if (cell) {
                cell_sequels.push(cell.textarea.get());
            }
        }
        let full_sql = cell_sequels.join(cell_separator);
        return full_sql;
    }

    async function set_sqlnb(cell_sequels: string[]) {
        for (const cell_sequel of cell_sequels) {
            const cell: ICell = { init: false };
            cell.id = $notebook.append(cell);
            $notebook = $notebook;
            await tick();
            cell.textarea.set(cell_sequel);
        }
        await tick();
        $notebook.get(0).textarea.focus();
    }

    async function open_sqlnb() {
        const selected = await open({
            multiple: false,
            filters: [{ name: 'SQLite NoteBook', extensions: ['sqlnb'] }]
        });
        if (!selected) return;

        $notebook.delete();
        let sqlnb = await readTextFile(selected as string);

        let cell_sequels = sqlnb.split(cell_separator);

        await set_sqlnb(cell_sequels);
    }

    async function save_sqlnb() {
        const file_path = await save({
            filters: [{ name: 'SQLite NoteBook', extensions: ['sqlnb'] }]
        });

        if (!file_path) return;

        const full_sql = await get_sqlnb();
        if (full_sql) await writeTextFile(file_path, full_sql);
    }

    function execute_all() {
        let idx = 0;

        const execute_next_cell = () => {
            const cell = $notebook.get(idx);

            if (cell) {
                if ('execute' in cell.component && typeof cell.component.execute === 'function') {
                    cell.component.execute();
                }
                idx++;
                if (idx < $notebook.length) {
                    setTimeout(execute_next_cell, 500);
                }
            }
        };

        execute_next_cell();
    }
</script>

<div class="navbar fixed top-0 z-10 bg-base-200">
    <div class="navbar-start ml-2 flex gap-0">
        <div class="tooltip tooltip-bottom" data-tip="Open File">
            <button class="btn-ghost min-h-8 btn h-8 w-6" on:click={open_sqlnb}>
                <iconify-icon
                    class="text-neutral-content"
                    width="24"
                    height="24"
                    icon="fluent:folder-open-24-regular"
                />
            </button>
        </div>
        <div class="tooltip tooltip-bottom" data-tip="Save File">
            <button class="btn-ghost min-h-8 btn h-8 w-6" on:click={save_sqlnb}>
                <iconify-icon
                    class="text-purple-400"
                    width="24"
                    height="24"
                    icon="fluent:save-24-regular"
                />
            </button>
        </div>
    </div>
    <div class="navbar-center">
        <p class="text-xl normal-case">SQLite Book</p>
    </div>
    <div class="navbar-end">
        <div class="tooltip tooltip-bottom" data-tip="Run All">
            <button class="btn-ghost min-h-8 btn h-8 w-6" on:click={execute_all}>
                <iconify-icon
                    class="text-success"
                    width="24"
                    height="24"
                    icon="fluent:play-multiple-16-regular"
                />
            </button>
        </div>
    </div>
</div>
<div class="mt-24 flex flex-col text-center">
    {#each $notebook.iter() as cell (cell.id)}
        <Cell
            bind:this={cell.component}
            idx={$notebook.get_idx(cell.id)}
            on:add={({ detail }) => insert_cell(detail.idx)}
        />
    {/each}
</div>
