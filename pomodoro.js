// ==========================================================
// POMODORO TIMER — index.html only
// ==========================================================
const audio = document.getElementById("lofiAudio");
const playBtn = document.getElementById("playBtn");

let WORK = 25 * 60;
let BREAK = 5 * 60;

// Read saved lengths once on startup before timeleft gets initialized,
// and fall back to defaults if nothing is saved yet
WORK = localStorage.getItem("worklength")
    ? parseInt(localStorage.getItem("worklength"), 10)
    : 25 * 60;
BREAK = localStorage.getItem("breaklength")
    ? parseInt(localStorage.getItem("breaklength"), 10)
    : 5 * 60;

let timeleft = WORK;
let isWorking = true;
let timer = null;

const timeElement = document.getElementById("time");
const labelElement = document.getElementById("label");
const playPomoBtn = document.getElementById("start");
const pausePomoBtn = document.getElementById("pause");
const resetPomoBtn = document.getElementById("reset");
const pomodoroFinishBell = document.getElementById("bell_ring");
const workTimeSetter = document.getElementById("work_time_setter");
const breakTimeSetter = document.getElementById("break_time_setter");
const setTimeBtn = document.getElementById("set_new_time");

// Format function
function format(seconds) {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return minutes + ":" + s;
}

// Run every time a second passes
function tick() {
    if (timeleft <= 0) {
        clearInterval(timer);
        timer = null;
        isWorking = !isWorking;
        timeleft = isWorking ? WORK : BREAK;
        pomodoroFinishBell.play();
        updateDisplay();
        return;
    }
    timeleft--;
    updateDisplay();
}

// Updates the display every second
function updateDisplay() {
    timeElement.textContent = format(timeleft);
    labelElement.textContent = isWorking ? "WORK" : "BREAK";
}

// Paint the loaded WORK time onto the screen right away
updateDisplay();

// Play / pause timer
playPomoBtn.addEventListener("click", (e) => {
    if (timer) return;
    timer = setInterval(tick, 1000);
});

// Pause timer
pausePomoBtn.addEventListener("click", (e) => {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
});

// Reset timer
resetPomoBtn.addEventListener("click", (e) => {
    clearInterval(timer);
    timer = null;
    isWorking = true;
    timeleft = WORK;
    updateDisplay();
});

// Save custom work / break lengths to localStorage
setTimeBtn.addEventListener("click", () => {
    const newWork = parseInt(workTimeSetter.value || workTimeSetter.textContent, 10) * 60;
    const newBreak = parseInt(breakTimeSetter.value || breakTimeSetter.textContent, 10) * 60;

    if (!isNaN(newWork) && newWork > 0) {
        WORK = newWork;
        localStorage.setItem("worklength", WORK);
    }
    if (!isNaN(newBreak) && newBreak > 0) {
        BREAK = newBreak;
        localStorage.setItem("breaklength", BREAK);
    }

    clearInterval(timer);
    timer = null;
    timeleft = isWorking ? WORK : BREAK;
    updateDisplay();
});

// Lo-fi music toggle
function toggleMusic() {
    if (audio.paused) {
        audio.play();
        playBtn.textContent = "Ⅱ";
    } else {
        audio.pause();
        playBtn.textContent = "▶";
    }
}
