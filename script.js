const audio = document.getElementById("lofiAudio");
const playBtn = document.getElementById("playBtn");

// ==========================================================
let WORK = 25 * 60;
let BREAK = 5 * 60
// Read saved lengths once on startup before timeleft gets initialized, and fall back to defaults if nothing is saved yet
WORK = localStorage.getItem("worklength") ? parseInt(localStorage.getItem("worklength"), 10) : 25 * 60;
BREAK = localStorage.getItem("breaklength") ? parseInt(localStorage.getItem("breaklength"), 10) : 5 * 60;

let timeleft = WORK;
let isWorking = true;
let timer = null;

const timeElement = document.getElementById("time")
const labelElement = document.getElementById("label")
const playPomoBtn = document.getElementById("start")
const pausePomoBtn = document.getElementById("pause")
const resetPomoBtn = document.getElementById("reset")
const pomodoroFinishBell = document.getElementById("bell_ring")
const workTimeSetter = document.getElementById("work_time_setter")
const breakTimeSetter = document.getElementById("break_time_setter")
const setTimeBtn = document.getElementById("set_new_time")

// Format function
function format(seconds) {
    // Minutes and seconds, reduce minutes to the floor to remove decimals, turn it into a string and pad it two places so that it adds 0 to the left
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0")
    // Find the remainder by dividing it by seconds and returning the extra, turn it to a string and pad if extra spaces left
    const s = (seconds % 60).toString().padStart(2, "0")

    return minutes + ":" + s;
}
// Run everytime it a second passes
function tick() {
    if (timeleft <= 0) {
        clearInterval(timer)
        timer = null
        isWorking = !isWorking
        timeleft = isWorking ? WORK : BREAK;
        pomodoroFinishBell.play()
        updateDisplay();
        return;
    }
    timeleft--;
    updateDisplay();
}

// Updates the display everytime and sets the time using the timeleft formatter and also sets the label everytime the timer state switches
function updateDisplay() {
    timeElement.textContent = format(timeleft);
    labelElement.textContent = isWorking ? "WORK" : "BREAK";
}

// Paint the loaded WORK time onto the screen right away instead of waiting for the first click
updateDisplay();

// Check if the timer is on then do nothing if it is off, start at the default setting (work is true)
playPomoBtn.addEventListener("click", (e) => {
    if (timer) return;
    timer = setInterval(tick, 1000)
})
// Pause it if the timer is on, check if it is on, if it is, clear the timer and the time variable, keeps the timeleft same so that it restarts
pausePomoBtn.addEventListener("click", (e) => {
    if (!timer) return;

    clearInterval(timer);
    timer = null;
})
// resets the timer to the start, sets is working to true and does not start the timer at all
resetPomoBtn.addEventListener("click", (e) => {
    // Clear any active interval without returning early so reset still works while paused
    clearInterval(timer);
    timer = null;
    isWorking = true;
    timeleft = WORK;
    updateDisplay();
})

// Listen on the actual save button (not the break input), convert minutes to seconds, update memory + storage, and refresh the display
setTimeBtn.addEventListener("click", () => {
    // Read .value if these are <input> tags, or fall back to .textContent if they are editable elements, then convert minutes to seconds
    const newWork = parseInt(workTimeSetter.value || workTimeSetter.textContent, 10) * 60;
    const newBreak = parseInt(breakTimeSetter.value || breakTimeSetter.textContent, 10) * 60;

    // Only save and apply if the user actually typed valid positive numbers
    if (!isNaN(newWork) && newWork > 0) {
        // check if it IS a number and it isn't zero
        WORK = newWork;
        localStorage.setItem("worklength", WORK);
    }
    if (!isNaN(newBreak) && newBreak > 0) {
        BREAK = newBreak;
        localStorage.setItem("breaklength", BREAK);
    }

    // Stop any running countdown and reset timeleft to the newly saved duration so the screen updates immediately
    clearInterval(timer);
    timer = null;
    timeleft = isWorking ? WORK : BREAK;
    updateDisplay();
})
// =============================================
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

hamburger.addEventListener("click", function () {
    navMenu.classList.toggle("active");
});
