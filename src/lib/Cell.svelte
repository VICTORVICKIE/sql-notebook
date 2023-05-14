<script lang="ts">
    import { open, save } from '@tauri-apps/api/dialog';
    import { readTextFile, writeTextFile } from '@tauri-apps/api/fs';
    import { join, localDataDir } from '@tauri-apps/api/path';
    import { Command, type ChildProcess } from '@tauri-apps/api/shell';
    import { afterUpdate, createEventDispatcher } from 'svelte';
    import CellActions from './CellActions.svelte';
    import { active_cell_idx, app_name, ids } from './Stores';
    import TextArea from './TextArea.svelte';

    const dispatch = createEventDispatcher();

    export let id: number;
    $: idx = $ids.indexOf(id);

    export let sql = '';
    let left_icon = 'fluent:play-24-regular';
    let textarea;

    let output: Promise<ChildProcess>;
    let executed = false;

    export function get_id() {
        return id;
    }

    export async function execute() {
        left_icon = 'line-md:loading-twotone-loop';
        const temp_db = await join(await localDataDir(), app_name, 'temp.db');

        output = Command.sidecar('bin/sqlite3', ['-header', '-box', temp_db, `${sql}`]).execute();

        executed = true;
    }

    export async function remove_cell() {
        if (id) {
            idx !== -1 && $ids.splice(idx, 1);
            $ids = $ids;
        }
    }

    export async function set_sql(input: string) {
        sql = input;
    }

    export async function get_sql() {
        return sql;
    }

    export async function import_sql() {
        const selected = await open({
            multiple: false,
            filters: [{ name: 'SQL', extensions: ['sql'] }]
        });

        if (selected === null) {
            return;
        }
        let sql = await readTextFile(selected as string);
        set_sql(sql);
    }

    export async function export_sql() {
        const file_path = await save({ filters: [{ name: 'SQL', extensions: ['sql'] }] });
        await writeTextFile(file_path, sql);
    }

    export async function clear_cell() {
        set_sql('');
    }

    export async function focus() {
        textarea._focus();
    }

    afterUpdate(() => (left_icon = 'fluent:play-24-regular'));
</script>

<div class="cell">
    <div class="flex flex-col gap-2 text-center">
        <button class="btn-ghost btn-sm btn mx-auto w-5" on:click={execute}>
            <iconify-icon class="text-success" icon={left_icon} width="20" height="20" />
        </button>
        <p class="ml-2 text-sm font-semibold">sql [{idx}]</p>
    </div>
    <div class="flex flex-col gap-4 text-left">
        <TextArea
            bind:this={textarea}
            bind:sequel={sql}
            on:active={() => ($active_cell_idx = idx)}
        />

        {#if executed}
            {#await output then cell_output}
                <pre>{cell_output.stdout || cell_output.stderr}</pre>
            {:catch}
                Something Went Wrong...
            {/await}
        {/if}
    </div>
    <CellActions
        on:clear={clear_cell}
        on:remove={remove_cell}
        on:import={import_sql}
        on:export={export_sql}
    />
</div>
<div class="divider m-8">
    <button on:click={() => dispatch('add')} class="btn-ghost btn">
        <iconify-icon
            class="text-neutral-content"
            icon="fluent:slide-add-24-regular"
            width="24"
            height="24"
        />
    </button>
</div>

<style>
    .cell {
        width: 100%;
        display: grid;
        grid-template-columns: 7.5% 1fr 7.5%;
        gap: 1rem;
    }
</style>
