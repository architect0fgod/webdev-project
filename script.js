
const audio = document.getElementById("lofiAudio");
const playBtn = document.getElementById("playBtn");

function toggleMusic() {

    if (audio.paused) {
        audio.play();
        playBtn.textContent = "Ⅱ";
    } 
    else {
        audio.pause();
        playBtn.textContent = "▶";
    }

}

