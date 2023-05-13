<script lang="ts">
    import { Command, type ChildProcess } from '@tauri-apps/api/shell';
    import { afterUpdate, createEventDispatcher } from 'svelte';
    import { ids } from './Stores';
    import TextArea from './TextArea.svelte';

    const dispatch = createEventDispatcher();

    export let id: number;
    $: idx = $ids.indexOf(id);

    let sql = '';
    let left_icon = 'fluent:play-24-regular';

    let output: Promise<ChildProcess>;
    let executed = false;

    export async function execute() {
        left_icon = 'line-md:loading-twotone-loop';

        output = Command.sidecar('bin/sqlite3', ['-header', '-box', 'temp.db', `${sql}`]).execute();

        executed = true;
    }

    export async function remove() {
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
        <TextArea bind:sql />

        {#if executed}
            {#await output then cell_output}
                <pre>{cell_output.stdout || cell_output.stderr}</pre>
            {:catch}
                Something Went Wrong...
            {/await}
        {/if}
    </div>
    <button class="btn-ghost btn-sm btn mx-auto w-5" on:click={remove}>
        <iconify-icon class="text-error" icon="fluent:delete-24-regular" width="20" height="20" />
    </button>
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
