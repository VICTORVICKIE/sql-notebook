<script lang="ts">
    import { open, save } from '@tauri-apps/api/dialog';
    import { exists, readTextFile, writeTextFile } from '@tauri-apps/api/fs';
    import { createEventDispatcher } from 'svelte';
    import { cell_separator, cells, ids, populated } from './Stores';

    const dispatch = createEventDispatcher();

    async function get_full_sql(): Promise<string> {
        let cell_sequels = [];
        for (const cell of $cells) {
            if (cell) {
                cell_sequels.push(await cell.get_sql());
            }
        }
        let full_sql = cell_sequels.join(cell_separator);
        return full_sql;
    }

    // function execute_all() {
    //     for (const cell of $cells) {
    //         if (cell) {
    //             cell.execute();
    //         }
    //     }
    // }
    function execute_all() {
        let index = 0;
        const execute_next_cell = () => {
            const cell = $cells[index];
            if (cell) {
                cell.execute();
                index++;
                if (index < $cells.length) {
                    setTimeout(execute_next_cell, 500);
                }
            }
        };

        execute_next_cell();
    }

    async function open_sqlnb() {
        const selected = await open({
            multiple: false,
            filters: [{ name: 'SQLite NoteBook', extensions: ['sqlnb'] }]
        });
        if (selected === null) {
            $populated = true;
            return;
        }

        $populated = false;
        let sqlnb = await readTextFile(selected as string);
        let cell_sequels = sqlnb.split(cell_separator);

        $ids = [...Array(cell_sequels.length).keys()];
        dispatch('populate', { selected });
        cell_sequels = [];
    }

    async function save_sqlnb() {
        const file_path = await save({
            filters: [{ name: 'SQLite NoteBook', extensions: ['sqlnb'] }]
        });

        if (!file_path) return;

        const full_sql = await get_full_sql();
        if (full_sql) await writeTextFile(file_path, full_sql);

        // const saved = await exists(file_path);
        // if (saved) $populated = false;
    }
</script>

<div class="navbar fixed top-0 z-10 bg-base-200">
    <div class="navbar-start flex gap-0">
        <button class="btn-ghost min-h-8 btn h-8 w-6" on:click={open_sqlnb}>
            <iconify-icon width="24" height="24" icon="fluent:folder-open-24-regular" />
        </button>

        <button class="btn-ghost min-h-8 btn h-8 w-6" on:click={save_sqlnb}>
            <iconify-icon
                class="text-purple-400"
                width="24"
                height="24"
                icon="fluent:save-24-regular"
            />
        </button>
    </div>
    <div class="navbar-center">
        <p class="text-xl normal-case">SQLite Book</p>
    </div>
    <div class="navbar-end">
        <button class="btn-ghost min-h-8 btn h-8 w-6" on:click={execute_all}>
            <iconify-icon width="24" height="24" icon="fluent:play-multiple-16-regular" />
        </button>
    </div>
</div>
