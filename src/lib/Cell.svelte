<script lang="ts">
    import { Command } from "@tauri-apps/api/shell";
    import { onMount } from "svelte";

    let font_size;
    let textarea;
    let sql: string = "";
    let cell_output: string = "";

    function resize_textarea() {
        const newline_count = (textarea.value.match(/\n/g) || []).length;
        const line_height = font_size * 1.5;
        const min_height = line_height + 2;
        const height = Math.max(line_height * (newline_count + 1), min_height);
        textarea.style.height = `${height}px`;
    }

    async function execute() {
        const command = Command.sidecar("binaries/sqlite3", [
            "-header",
            "-box",
            "temp.db",
            `${sql}`,
        ]);
        console.log(command);
        const output = await command.execute();
        cell_output = output.stdout || output.stderr;
    }

    onMount(async () => {
        textarea.focus();
        const computed_style = window.getComputedStyle(textarea);
        font_size = parseFloat(computed_style.fontSize);
        resize_textarea();
    });
</script>

<div class="cell">
    <button class="btn btn-ghost btn-sm" on:click={execute}
        ><iconify-icon icon="ph:play-duotone" width="24" height="24" /></button
    >
    <div class="flex flex-col gap-4 text-left">
        <textarea
            bind:this={textarea}
            on:input={resize_textarea}
            bind:value={sql}
            class="textarea textarea-bordered focus:outline-none overflow-hidden resize-none w-full"
            style="font-size: {font_size}px; line-height: {font_size * 1.5}px;"
        />
        <pre><code>{cell_output}</code></pre>
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
