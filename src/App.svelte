<script lang="ts">
    import Cell from "./lib/Cell.svelte";
</script>

<div class="hero min-h-screen bg-base-200">
    <div class="hero-content w-full text-center flex-col">
        <Cell />
        <div class="divider">
            <button class="btn">
                <iconify-icon
                    icon="ph:plus-square-duotone"
                    width="24"
                    height="24"
                />
            </button>
        </div>
    </div>
</div>
