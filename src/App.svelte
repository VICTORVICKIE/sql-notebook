<script lang="ts">
    import Cell from './lib/Cell.svelte';
    import { cells, ids } from './lib/Stores';
    import ToolBar from './lib/ToolBar.svelte';

    function add_cell(index: number, id: number) {
        $ids.splice(index + 1, 0, id);
        $ids = $ids;
    }
</script>

<div class="flex min-h-screen flex-col">
    <ToolBar />
    <div class="mt-24 flex flex-1 flex-col">
        {#each $ids as id, index (id)}
            <Cell bind:this={$cells[index]} on:add={() => add_cell(index, $ids.length)} {id} />
        {/each}
    </div>
</div>
