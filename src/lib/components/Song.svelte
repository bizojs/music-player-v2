<script>
    import { error, success } from "$lib/notifications"
    import { enhance, applyAction } from "$app/forms"
    import { invalidateAll } from "$app/navigation"
    import { fade } from "svelte/transition"
    import { Button } from "fluent-svelte"
    export let song

    let hovering = false
</script>

<div class="flex bg-theme-song w-full relative rounded-sm" on:mouseover={() => {hovering = true}} on:mouseout={() => {hovering = false}} role="article">
    <img src="placeholder.png" alt="" class="w-32 select-none rounded-l-sm" draggable="false">
    <div class="flex flex-col justify-between p-2 w-full">
        {#if hovering}
            <div class="absolute top-2 right-2" transition:fade|local={{ duration: 300 }}>
                <form
                    id="delete"
                    action="?/deleteSong"
                    method="POST"
                    enctype="multipart/form-data"
                    use:enhance={() => {
                        return async ({ result }) => {
                            invalidateAll()
                            if (result?.data?.success && result?.data?.message) {
                                success({ msg: result.data.message })
                            }
                            if (!result?.data?.success && result?.data?.message) {
                                error({ msg: result.data.message })
                            }
                            return await applyAction(result)
                        }
                    }}
                >
                    <input type="text" id="song" name="song" value={song} class="hidden">
                    <Button variant="accent" type="submit">
                        <i class="fa-solid fa-xmark py-1"></i>
                    </Button>
                </form>
            </div>
        {/if}
        <div class="flex flex-col gap-2 m-2">
            <p class="text-gray-400 select-none">Title</p>
            <p class="text-xl text">{song.replace(".mp3", "")}</p>
        </div>
        <div class="flex justify-end">
            <Button variant="standard">
                <i class="fa-solid fa-play py-1"></i>
            </Button>
        </div>
    </div>
</div>