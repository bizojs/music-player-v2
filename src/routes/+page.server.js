import { writeFile, readdir, unlink } from "fs/promises"

/** @type {import('./$types').PageServerLoad} */
export const load = async () => {
    let songs = await readdir("static/uploads")
    return { songs }
}

/** @type {import('./$types').Action} */
export const upload = async ({ request }) => {
    const data = await request.formData()
    const file = data.get("file")

    if (!file.name) return

    let songs = await readdir("static/uploads")
    if (songs.includes(file.name)) {
        return {
            success: false,
            message: "This file already exists.",
        }
    }

    const name = file.name.replace("/", " ").replace("\\", " ")
    await writeFile("static/uploads/" + name, file.stream())

    return {
        success: true,
        message: "File uploaded.",
    }
}

/** @type {import('./$types').Action} */
export const deleteSong = async ({ request }) => {
    const data = await request.formData()
    const name = data.get("song")
    try {
        await unlink("static/uploads/" + name)
        return {
            success: true,
            message: "Song has been deleted",
        }
    } catch (e) {
        return {
            success: false,
            message: "Failed to delete: " + e.message,
        }
    }
}

/** @type {import('./$types').Actions} */
export const actions = { upload, deleteSong }