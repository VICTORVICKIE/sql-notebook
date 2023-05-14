<script lang="ts">
    import { afterUpdate, createEventDispatcher, onMount } from 'svelte';

    export let sequel: string;

    let font_size: number;
    let textarea;

    const dispatch = createEventDispatcher();

    function resize_textarea() {
        const newline_count = (textarea?.value.match(/\n/g) || []).length;
        const line_height = font_size * 2;
        const height = Math.max(line_height * (newline_count + 2), line_height + 2);
        textarea.style.height = `${height}px`;
    }

    onMount(async () => {
        textarea.focus();
        const computed_style = window.getComputedStyle(textarea);
        font_size = parseFloat(computed_style.fontSize);
        resize_textarea();
    });

    export function _focus() {
        textarea.focus();
    }

    afterUpdate(resize_textarea);
</script>

<textarea
    on:focus={() => dispatch('active')}
    bind:this={textarea}
    on:input={resize_textarea}
    bind:value={sequel}
    class="textarea-bordered textarea w-full resize-none overflow-hidden focus:outline-none"
    style="font-size: {font_size}px; line-height: {font_size * 2}px;"
/>
