import { toast } from "@zerodevx/svelte-toast"

const icons = {
    default: "bell",
    info: "circle-info",
    warn: "circle-exclamation",
    success: "circle-check",
    error: "circle-xmark"
}

const themes = {
    default: {
        "--toastBackground": "rgba(54, 57, 64, .8)",
    },
    success: {
        "--toastBackground": "rgba(16, 185, 129, .8)",
    },
    error: {
        "--toastBackground": "rgba(237, 81, 81, .8)",
    },
    info: {
        "--toastBackground": "rgba(66, 101, 226, .8)",
    }
}

export const notification = ({ msg, type } = { msg: "Message not provided", type: "default" }) => {
    return toast.push(
        `<div class="flex items-center gap-3 z-20"><i class="fa-solid fa-${icons[type]}"></i><span>${msg}</span></div>`, {
            theme: {
                ...themes[type],
                "--toastBarBackground": "rgba(255, 255, 255, .4)"
            }
        }
    )
}

export const success = ({ msg }) => {
    notification({ msg,  type: "success" })
}

export const error = ({ msg }) => {
    notification({ msg,  type: "error" })
}

export const info = ({ msg }) => {
    notification({ msg,  type: "info" })
}