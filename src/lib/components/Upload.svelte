<script>
    import { error, success } from "$lib/notifications"
    import { enhance, applyAction } from "$app/forms"
    import { invalidateAll } from "$app/navigation"
    import { Button } from "fluent-svelte"

    function openFilePicker() {
        document.querySelector("#file").click()
    }
    function handleSubmit() {
        document.querySelector("#submit").click()
    }
    function clearForm() {
        document.querySelector("#file").value = null
    }
</script>

<form
    id="form"
    action="?/upload"
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
            clearForm()
            return await applyAction(result)
        }
    }}
>
    <input type="file" id="file" name="file" accept=".mp3" on:change={handleSubmit} class="hidden" />
    <button class="hidden" type="submit" id="submit"></button>
    <Button variant="standard" on:click={openFilePicker}>Upload</Button>
</form>