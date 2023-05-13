<script lang="ts">
    import { Command, type ChildProcess } from "@tauri-apps/api/shell";
    import { afterUpdate } from "svelte";
    import TextArea from "./TextArea.svelte";

    let sql: string = "";
    let output: Promise<ChildProcess>;
    let left_icon: string = "ph:play-duotone";
    let executed = false;

    async function execute() {
        left_icon = "line-md:loading-twotone-loop";
        output = Command.sidecar("bin/sqlite3", [
            "-header",
            "-box",
            "temp.db",
            `${sql}`,
        ]).execute();

        executed = true;
    }

    afterUpdate(() => (left_icon = "ph:play-duotone"));
</script>

<div class="cell">
    <button class="btn btn-ghost btn-sm" on:click={execute}
        ><iconify-icon icon={left_icon} width="24" height="24" /></button
    >
    <div class="flex flex-col gap-4 text-left">
        <TextArea bind:sql />

        {#if executed}
            {#await output then cell_output}
                <pre>
                    <code>{cell_output.stdout || cell_output.stderr}</code>
                </pre>
            {:catch}
                Something Went Wrong...
            {/await}
        {/if}
    </div>
    <button class="btn btn-ghost btn-sm"
        ><iconify-icon icon="ph:trash-duotone" width="24" height="24" /></button
    >
</div>

<style>
    .cell {
        width: 100%;
        display: grid;
        grid-template-columns: 5% 1fr 5%;
        gap: 1rem;
    }
</style>
