<script>
    import { SvelteToast } from "@zerodevx/svelte-toast"
    import Nav from "$lib/components/Nav.svelte"
    import "fluent-svelte/theme.css"
    import "../app.css"
</script>

<SvelteToast />
<div class="p-5 min-h-screen flex flex-col justify-between">
    <Nav />
    <slot />
</div>