export function getDuration(player, formatted = true) {
    if (!player) return "00:00"
    let dur = formatted ? formatDuration(player.duration * 1000) : player.duration * 1000
    return dur
}

export function getDurationFromFile(song, songs) {
    let audio = document.createElement("AUDIO")
    audio.classList.add("hidden")
    audio.src = "uploads/" + song
    audio.onloadedmetadata = function() {
        document.querySelector("#dur-" + songs.indexOf(song)).innerText = formatDuration(audio.duration * 1000)
    }
}

export function getCurrentTime(player, formatted = true) {
    return formatted ? formatDuration(player.currentTime * 1000) : player.currentTime * 1000
}

export function calculateInverse(percent, max) {
    return ((percent / 100) * (max / 1000)).toFixed(0)
}

export function getCurrentTimePercentage(player, reverse = false) {
    let length = player.duration * 1000
    let current = player.currentTime * 1000
    return reverse ? ((current * length) / 100).toFixed(1) : ((current / length) * 100).toFixed(1)
}

export function formatDuration(ms) {
    let seconds = parseInt((ms / 1000) % 60)
    let minutes = parseInt((ms / (1000 * 60)) % 60)
    minutes = (minutes < 10) ? "0" + minutes : minutes
    seconds = (seconds < 10) ? "0" + seconds : seconds
    return minutes + ":" + seconds
}

export function truncate(str, length = 30) {
    return str.length < length ? str : str.substring(0, length) + "..."
}