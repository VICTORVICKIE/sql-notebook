<script lang="ts">
    import { open, save } from "@tauri-apps/api/dialog";
    import { readTextFile, writeTextFile } from "@tauri-apps/api/fs";
    import { cells } from "./Stores";

    function execute_all() {
        for (const cell of $cells) {
            cell.execute();
        }
    }

    async function open_sql() {
        const selected = await open({
            multiple: false,
            filters: [
                {
                    name: "SQL",
                    extensions: ["sql"],
                },
            ],
        });
        if (selected !== null) {
            let sql = await readTextFile(selected as string);
            $cells[0].set_sql(sql);
        }
    }

    async function get_full_sql() {
        let full_sql = "";
        for (const cell of $cells) {
            full_sql += await cell.get_sql();
        }

        return full_sql;
    }

    async function save_sql() {
        const file_path = await save({
            filters: [
                {
                    name: "SQL",
                    extensions: ["sql"],
                },
            ],
        });
        let full_sql = await get_full_sql();
        if (full_sql) await writeTextFile(file_path, full_sql);
    }
</script>

<div class="navbar z-10 fixed top-0 bg-base-200">
    <div class="navbar-start flex gap-0">
        <button class="btn w-6 h-8 min-h-8 btn-ghost" on:click={open_sql}
            ><iconify-icon
                width="24"
                height="24"
                icon="fluent:folder-open-24-regular"
            /></button
        ><button class="btn w-6 h-8 min-h-8 btn-ghost" on:click={save_sql}
            ><iconify-icon
                width="24"
                height="24"
                icon="fluent:save-24-regular"
            /></button
        >
    </div>
    <div class="navbar-center">
        <p class="normal-case text-xl">SQLite Book</p>
    </div>
    <div class="navbar-end">
        <button class="btn w-6 h-8 min-h-8 btn-ghost" on:click={execute_all}
            ><iconify-icon
                width="24"
                height="24"
                icon="fluent:play-multiple-16-regular"
            /></button
        >
    </div>
</div>
