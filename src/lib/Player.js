import {
    getDuration,
    getCurrentTime,
    calculateInverse,
    getCurrentTimePercentage,
    formatDuration,
    truncate
} from "./utils"

export class Player {

    constructor({ songs }) {
        this.player = null
        this.songs = songs
        this.nowPlaying = {
            player: null,
            playing: false,
            duration: 0,
            title: "Nothing is playing",
            thumbnail: "placeholder.png"
        },
        this.playedFor = 0
        this.interval
        this.loop = false
        this.dragged = false
    }

    getPlayer() {
        return this.player
    }

    np() {
        return this.nowPlaying
    }

    destroy() {
        if (!this.player) return
        this.player.pause()
        document.querySelector("#slider").value = 0
        document.querySelector("#title").innerText = "Nothing is currently playing"
        document.querySelector("#sl").innerText = "00:00"
        document.querySelector("#ct").innerText = "00:00"
        document.querySelector("#progress-bar").style.width = "0%"
        document.querySelector("#song-" + this.songs.indexOf(this.nowPlaying.title)).innerHTML = `<i class="fa-solid fa-play py-1"></i>`
        document.querySelector("#pause").innerHTML = `<i class="fa-solid fa-play py-1"></i>`
        this.player = null
        clearInterval(this.interval)
        this.playedFor = 0
        this.player = null
    }

    play(song) {
        if (this.player) {
            this.destroy()
            clearInterval(this.interval)
            this.playedFor = 0
            this.player = null
        }
        document.querySelector("#slider").max = 100
        document.querySelector("#song-" + this.songs.indexOf(song)).innerHTML = `<i class="fa-solid fa-pause py-1"></i>`
        // document.querySelector("#" + song).src = ""
        document.querySelector("#pause").innerHTML = `<i class="fa-solid fa-pause py-1"></i>`
        document.querySelector("#title").innerText = truncate(song.replace(".mp3", ""), 35)
        this.player = new Audio("uploads/" + song)
        this.player.onended = () => {
            if (!this.player.loop) this.destroy()
        }
        this.player.ontimeupdate = () => {
            if (this.player && !this.player.paused) {
                if (!this.dragging) {
                    document.querySelector("#progress-bar").style.width = getCurrentTimePercentage(this.player) + "%"
                    document.querySelector("#slider").value = getCurrentTimePercentage(this.player)
                    document.querySelector("#ct").innerText = getCurrentTime(this.player, true)
                }
            }
        }
        this.player.play().then(async () => {
            // duration
            document.querySelector("#sl").innerText = getDuration(this.player, true)
            this.nowPlaying.duration = this.player.duration
        })
        this.nowPlaying = {
            player: this.player,
            ...this.nowPlaying,
            playing: true,
            title: song
        }
        // let thumb = this.getThumbnail(song)
        // if (thumb) {
            // thumbnail image handling
            // document.querySelector("#thumbnail").src = thumb
        // }
        return this.nowPlaying
    }

    pause() {
        if (!this.player) return
        switch (this.player.paused) {
            case true:
                document.querySelector("#song-" + this.songs.indexOf(this.nowPlaying.title)).innerHTML = `<i class="fa-solid fa-pause py-1"></i>`
                document.querySelector("#pause").innerHTML = `<i class="fa-solid fa-pause py-1"></i>`
                this.player.play()
            break;
            case false:
                document.querySelector("#song-" + this.songs.indexOf(this.nowPlaying.title)).innerHTML = `<i class="fa-solid fa-play py-1"></i>`
                document.querySelector("#pause").innerHTML = `<i class="fa-solid fa-play py-1"></i>`
                this.player.pause()
            break;
        }
        return this.player.paused
    }

    async skip() {
        if (!this.player) return
        let title = this.np().title
        let currentPosition = this.songs.map(s => s).indexOf(title)
        let nextPosition = currentPosition + 2 > this.songs.length ? 0 : currentPosition + 1
        await this.play(this.songs[nextPosition])
        return this.nowPlaying
    }

    async previous() {
        if (!this.player) return
        let title = this.np().title
        let currentPosition = this.songs.map(s => s).indexOf(title)
        let previousPosition = currentPosition === 0 ? this.songs.length - 1 : currentPosition - 1
        await this.play(this.songs[previousPosition])
        return this.nowPlaying
    }

    loopSong() {
        if (!this.player) return
        switch (this.player.loop) {
            case true:
                // change icon
                document.querySelector("#loop").innerHTML = `<i class="fa-solid fa-repeat text-opacity-40 py-1"></i>`
                this.player.loop = false
            break
            case false:
                // change icon
                document.querySelector("#loop").innerHTML = `<i class="fa-solid fa-repeat text-green-400 text-opacity-80 py-1"></i>`
                this.player.loop = true
            break
        }
        return this.player.paused
    }

    async seek(event) {
        if (!this.player) {
            document.getElementById("slider").max = 0
            return
        }
        this.dragging = true
        let value = event.srcElement.value
        document.getElementById("ct").innerText = formatDuration(calculateInverse(value, this.player.duration * 1000) * 1000)
        document.getElementById("progress-bar").style.transition = "none"
        document.getElementById("progress-bar").style.width = value + "%"
    }

    async stopSeek(event) {
        if (!this.player) return
        document.getElementById("progress-bar").style.transition = "none"
        let value = event.srcElement.value
        this.player.currentTime = calculateInverse(value, this.player.duration * 1000)
        this.playedFor = this.player.currentTime
        document.getElementById("progress-bar").style.width = getCurrentTimePercentage(this.player) + "%"
        document.getElementById("ct").innerText = getCurrentTime(this.player, true)
        this.dragging = false
        return this.dragging
    }

}

export async function getSpotifyData(trun) {
    let data = await fetch(`https://sws.br4d.dev/search?q=${trun}&limit=1`)
    let json = await data.json()
    let search = Array.from(json.search)
    console.log(json, search[0].track, search.length)
    if (search.length == 0) return
    return search[0].track
}