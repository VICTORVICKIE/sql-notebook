<script lang="ts">
    import { onMount } from "svelte";

    let font_size;
    let textarea;
    export let sql: string;

    function resize_textarea() {
        const newline_count = (textarea.value.match(/\n/g) || []).length;
        const line_height = font_size * 1.5;
        const min_height = line_height + 2;
        const height = Math.max(line_height * (newline_count + 1), min_height);
        textarea.style.height = `${height}px`;
    }

    onMount(async () => {
        textarea.focus();
        const computed_style = window.getComputedStyle(textarea);
        font_size = parseFloat(computed_style.fontSize);
        resize_textarea();
    });
</script>

<textarea
    bind:this={textarea}
    on:input={resize_textarea}
    bind:value={sql}
    class="textarea textarea-bordered focus:outline-none overflow-hidden resize-none w-full"
    style="font-size: {font_size}px; line-height: {font_size * 1.5}px;"
/>
