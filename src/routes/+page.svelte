<script>
	import { error, success } from "$lib/notifications"
    import { enhance, applyAction } from "$app/forms"
	import { getDurationFromFile } from "$lib/utils"
	import { slide, fade } from "svelte/transition"
    import { invalidateAll } from "$app/navigation"
    import { afterUpdate, onMount } from "svelte"
	import { Button } from "fluent-svelte"
	import { Player } from "$lib/Player"
    import { page } from "$app/stores"

    let loaded = false
	let player = null
	let activePlayer = null
	
    onMount(() => {
		loaded = true
		player = new Player({ songs: $page.data.songs })
	})

	afterUpdate(() => {
		player = new Player({ songs: $page.data.songs })
	})

</script>

<div class="flex flex-col justify-between gap-5 flex-grow">
	<div class="flex flex-col">
		{#if $page.data?.songs?.length > 0}
			<div class="flex justify-center w-full my-10">
				<h1 class="text-5xl text-gray-300 font-bold">Songs</h1>
			</div>
			<div class="flex flex-col gap-4 max-h-[30rem] overflow-y-auto">
				{#each $page.data.songs as song, i}
					{#if loaded}
						<div in:slide={{ delay: 100 * i }} out:fade>
							<div class="flex bg-theme-song w-full relative rounded-sm" role="article">
								<img src="placeholder.png" alt="" class="w-32 h-32 select-none rounded-l-sm" draggable="false">
								<div class="flex flex-col justify-between p-2 w-full">
									<div class="absolute flex gap-2 top-2 right-2">
										<Button id="song-{i}" variant="standard" on:click={() => { player.play(song) }}>
											<i class="fa-solid fa-play py-1"></i>
										</Button>
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
									<div class="flex flex-col gap-2 m-2">
										<p class="text-gray-400 select-none">Title</p>
										<p class="text-lg">{song.replace(".mp3", "")}</p>
									</div>
									<p class="self-end text-gray-400" id="dur-{i}">00:00{getDurationFromFile(song, $page.data.songs)}</p>
								</div>
							</div>
						</div>
					{/if}
				{/each}
			</div>
		{:else}
			<div class="flex justify-center w-full my-10">
				<h1 class="text-5xl text-gray-300 font-bold">Upload a song to get started</h1>
			</div>
		{/if}
	</div>
	{#if loaded}
		<div transition:fade class="flex bg-theme-nav rounded-sm">
			<img id="thumbnail" src={Player.nowPlaying ? Player.nowPlaying.thumbnail : "placeholder.png"} alt="" class="w-40 h-40 select-none rounded-l-sm" draggable="false">
			<div class="p-4 flex flex-col justify-between w-[99%]">
				<h2 id="title" class="text-2xl text-gray-300 font-bold">Nothing playing</h2>
				<div class="flex gap-3">
					<Button id="previous" variant="standard" on:click={() => player.previous()}>
						<i class="fa-solid fa-backward py-1"></i>
					</Button>
					<Button id="pause" variant="standard" on:click={() => player.pause()}>
						<i class="fa-solid fa-play py-1"></i>
					</Button>
					<Button id="stop" variant="standard" on:click={() => player.destroy()}>
						<i class="fa-solid fa-stop py-1"></i>
					</Button>
					<Button id="next" variant="standard" on:click={() => player.skip()}>
						<i class="fa-solid fa-forward py-1"></i>
					</Button>
					<Button id="loop" variant="standard" on:click={() => player.loopSong()}>
						<i class="fa-solid fa-repeat py-1 text-opacity-40 hover:text-opacity-80 transition-all"></i>
					</Button>
					<Button variant="standard" disabled="true">
						<div class="flex gap-2">
							<p id="ct">0:00</p>
							<p>/</p>
							<p id="sl">0:00</p>
						</div>
					</Button>
				</div>
				<div class="flex gap-4 items-center w-full">
					<div class="progress-container w-full">
						<div id="base-bar" class="bar" />
						<input
							on:change={(e) => player.stopSeek(e)}
							on:input={(e) => player.seek(e)}
							class="slider w-full h-1.5" id="slider" type="range" value="0" min="0" max="100" step=".1"
						/>
						<div id="progress-bar" class="overlay-bar" />
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>