<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
</script>

<div class="grid h-16 grid-cols-2 grid-rows-2">
    <button class="btn-ghost btn-sm btn mx-auto w-5" on:click={() => dispatch('clear')}>
        <iconify-icon
            class="text-warning"
            icon="fluent:square-dismiss-20-regular"
            width="20"
            height="20"
        />
    </button>
    <button class="btn-ghost btn-sm btn mx-auto w-5" on:click={() => dispatch('remove')}>
        <iconify-icon class="text-error" icon="fluent:delete-20-regular" width="20" height="20" />
    </button>

    <button class="btn-ghost btn-sm btn mx-auto w-5" on:click={() => dispatch('import')}>
        <iconify-icon
            class="text-info"
            icon="fluent:database-arrow-down-20-regular"
            width="20"
            height="20"
        />
    </button>
    <button class="btn-ghost btn-sm btn mx-auto w-5" on:click={() => dispatch('export')}>
        <iconify-icon
            class="text-info"
            icon="fluent:database-arrow-up-20-regular"
            width="20"
            height="20"
        />
    </button>
</div>
