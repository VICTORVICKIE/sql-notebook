<script lang="ts">
    import { afterUpdate, onMount } from 'svelte';

    let textarea: HTMLTextAreaElement;

    let font_size: number;

    onMount(initialize);
    afterUpdate(() => {
        resize_textarea();
    });

    async function initialize() {
        font_size = parseFloat(window.getComputedStyle(textarea).fontSize);
        resize_textarea();
        textarea.focus();
    }
    async function resize_textarea() {
        const newline_count = (textarea.value.match(/\n/g) || []).length;
        const line_height = font_size * 2;
        const height = Math.max(line_height * (newline_count + 2), line_height + 2);
        textarea.style.height = `${height}px`;
    }

    export function get() {
        return textarea.value;
    }

    export function set(str: string) {
        textarea.value = str;
    }

    export async function focus() {
        textarea.focus();
    }
</script>

<textarea
    bind:this={textarea}
    on:input={resize_textarea}
    on:change={resize_textarea}
    class="textarea-bordered textarea w-full resize-none overflow-hidden focus:outline-none"
    style="font-size: {font_size}px; line-height: {font_size * 2}px;"
/>
