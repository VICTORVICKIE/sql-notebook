<script lang="ts">
    import Cell from "./lib/Cell.svelte";
    import { cells, ids } from "./lib/Stores";
    import ToolBar from "./lib/ToolBar.svelte";

    function add_cell(index: number, id: number) {
        $ids.splice(index + 1, 0, id);
        $ids = $ids;
    }
</script>

<div class="flex flex-col min-h-screen">
    <ToolBar />
    <div class="flex flex-col mt-24 flex-1">
        {#each $ids as id, index (id)}
            <Cell
                bind:this={$cells[index]}
                on:add={() => add_cell(index, $ids.length)}
                {id}
            />
        {/each}
    </div>
</div>
