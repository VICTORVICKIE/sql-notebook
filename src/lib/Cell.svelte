<script lang="ts">
    import { open, save } from '@tauri-apps/api/dialog';
    import { exists, readTextFile, writeTextFile } from '@tauri-apps/api/fs';
    import { join, localDataDir } from '@tauri-apps/api/path';
    import { Command, type ChildProcess } from '@tauri-apps/api/shell';
    import { createEventDispatcher, onMount } from 'svelte';
    import { app_name, notebook } from './Stores';
    import TextArea from './TextArea.svelte';
    const dispatch = createEventDispatcher();

    export let idx: number;
    const cell = $notebook.get(idx);

    let loading = false;
    let executed = false;
    let command_output: Promise<ChildProcess>;

    onMount(() => (cell.init = true));

    export async function execute() {
        loading = true;
        const temp_db = await join(await localDataDir(), app_name, 'temp.db');

        let sequel = cell.textarea.get();
        command_output = Command.sidecar('bin/sqlite3', [
            '-header',
            '-box',
            temp_db,
            `${sequel}`
        ]).execute();
        console.log(await command_output);

        executed = true;
        loading = false;
    }

    async function clear_cell() {
        cell.textarea.set('');
    }

    async function remove_cell() {
        if ($notebook.length > 1) {
            $notebook.remove(idx);
            $notebook = $notebook;
        }
    }

    async function import_sql() {
        const selected = await open({
            multiple: false,
            filters: [{ name: 'SQL', extensions: ['sql'] }]
        });

        if (!selected) return;

        let imported_sequel = await readTextFile(selected as string);
        cell.textarea.set(imported_sequel);
    }

    async function export_sql() {
        const file_path = await save({ filters: [{ name: 'SQL', extensions: ['sql'] }] });

        let sequel = cell.textarea.get();
        if (file_path) await writeTextFile(file_path, sequel);
    }
</script>

<div class="cell">
    <div class="flex flex-col gap-2 text-center">
        <div class="tooltip" data-tip="Run">
            <button class="btn-ghost btn-sm btn mx-auto w-5" on:click={execute}>
                <label for="swap-icons" class:swap-active={loading} class="swap">
                    <div class="swap-on">
                        <iconify-icon
                            class="text-success"
                            icon="line-md:loading-twotone-loop"
                            width="20"
                            height="20"
                        />
                    </div>
                    <div class="swap-off">
                        <iconify-icon
                            class="text-success"
                            icon="fluent:play-24-regular"
                            width="20"
                            height="20"
                        />
                    </div>
                </label>
            </button>
        </div>
        <p class="ml-2 text-xs font-semibold">SQL [{idx}]</p>
    </div>
    <div class="flex flex-col gap-4 text-left">
        <TextArea bind:this={cell.textarea} />

        {#if executed}
            {#await command_output then cell_output}
                <pre>{cell_output.stdout || cell_output.stderr}</pre>
            {:catch}
                Something Went Wrong...
            {/await}
        {/if}
    </div>
    <div class="grid h-16 grid-cols-2 grid-rows-2">
        <div class="tooltip" data-tip="Clear Cell">
            <button class="btn-ghost btn-sm btn mx-auto w-5" on:click={clear_cell}>
                <iconify-icon
                    class="text-warning"
                    icon="fluent:square-dismiss-20-regular"
                    width="20"
                    height="20"
                />
            </button>
        </div>
        <div class="tooltip" data-tip="Remove Cell">
            <button class="btn-ghost btn-sm btn mx-auto w-5" on:click={remove_cell}>
                <iconify-icon
                    class="text-error"
                    icon="fluent:delete-20-regular"
                    width="20"
                    height="20"
                />
            </button>
        </div>
        <div class="tooltip tooltip-bottom" data-tip="Import SQL">
            <button class="btn-ghost btn-sm btn mx-auto w-5" on:click={import_sql}>
                <iconify-icon
                    class="text-info"
                    icon="fluent:database-arrow-down-20-regular"
                    width="20"
                    height="20"
                />
            </button>
        </div>
        <div class="tooltip-bottom-left tooltip" data-tip="Export SQL">
            <button class="btn-ghost btn-sm btn mx-auto w-5" on:click={export_sql}>
                <iconify-icon
                    class="text-info"
                    icon="fluent:database-arrow-up-20-regular"
                    width="20"
                    height="20"
                />
            </button>
        </div>
    </div>
</div>
<div class="divider m-8">
    <div class="tooltip tooltip-bottom" data-tip="Add SQL Cell">
        <button
            on:click={() => dispatch('add', { idx: idx + 1 })}
            class="btn-ghost min-h-6 btn h-7 w-7"
        >
            <iconify-icon
                class="text-neutral-content"
                icon="fluent:code-24-filled"
                width="24"
                height="24"
            />
        </button>
    </div>
</div>

<style>
    .cell {
        width: 100%;
        display: grid;
        grid-template-columns: 7.5% 1fr 7.5%;
        gap: 1rem;
    }

    .tooltip-bottom-left:before {
        transform: translateX(-100%);
        top: var(--tooltip-offset);
        left: 100%;
        right: auto;
        bottom: auto;
    }
    .tooltip-bottom-left:after {
        transform: translateX(-100%);
        border-color: transparent transparent var(--tooltip-color) transparent;
        top: var(--tooltip-tail-offset);
        left: 100%;
        right: auto;
        bottom: auto;
    }
</style>
