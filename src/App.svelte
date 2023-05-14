<script lang="ts">
    import { confirm } from '@tauri-apps/api/dialog';
    import { TauriEvent } from '@tauri-apps/api/event';
    import { BaseDirectory, createDir, exists, readTextFile, removeFile } from '@tauri-apps/api/fs';
    import { join } from '@tauri-apps/api/path';
    import { appWindow } from '@tauri-apps/api/window';
    import { onMount } from 'svelte';

    import Cell from './lib/Cell.svelte';
    import { app_name, cell_separator, cells, ids, populated, sync } from './lib/Stores';
    import ToolBar from './lib/ToolBar.svelte';

    let batch_sequel = '';

    async function add_cell(index: number, id: number) {
        $ids.splice(index + 1, 0, id);
        $ids = $ids;
    }

    async function populate_cell() {
        if (!$sync || $populated) return;

        console.log('/');
        let sequel_nb = await readTextFile(batch_sequel);
        let cell_sequels = sequel_nb.split(cell_separator);

        for (let idx = 0; idx < $cells.length; ++idx) {
            const cell = $cells[idx];
            if (cell) {
                cell.set_sql(cell_sequels[idx]);
            }
        }
        $populated = true;
        $cells[0].focus();
    }

    onMount(async () => {
        const db_dir_exists = await exists(app_name, { dir: BaseDirectory.LocalData });
        if (!db_dir_exists) {
            await createDir(app_name, { dir: BaseDirectory.LocalData });
        }
    });

    appWindow.listen(TauriEvent.WINDOW_CLOSE_REQUESTED, async () => {
        const confirmed = await confirm('Quit SQLite Book?');
        if (confirmed) {
            const temp_db = await join(app_name, 'temp.db');
            await removeFile(temp_db, { dir: BaseDirectory.LocalData });
            appWindow.close();
        }
    });

    $: if ($sync) populate_cell();
</script>

<div class="flex min-h-screen flex-col">
    <ToolBar on:populate={({ detail }) => (batch_sequel = detail.selected)} />

    <div class="mt-24 flex flex-1 flex-col">
        {#if true}
            {#each $ids as id, index (id)}
                <Cell bind:this={$cells[index]} on:add={() => add_cell(index, $ids.length)} {id} />
            {/each}
            <!-- {@const _ = populate_cell()} -->
        {/if}
    </div>
</div>
