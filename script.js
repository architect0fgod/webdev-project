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

const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

hamburger.addEventListener("click", function() {
    navMenu.classList.toggle("active");
});
