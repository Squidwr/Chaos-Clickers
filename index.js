const clickButton = document.getElementById("cracker");
const muteButton = document.getElementById("toggleMute");
const resetGameButton = document.getElementById("resetGame");
const crackersLabel = document.getElementById("amount");
const clickSoundPlayer = new Audio("assets/click.wav");
const musicPlayer = new Audio("assets/music.wav");

let crackers = 0;
let musicMuted = false;
let userInteracted = false;

function loadProgress() {
    crackers = Number(localStorage.getItem("crackers"));
    if (localStorage.getItem("musicMuted") == "true") muteButton.click();
};

clickButton.addEventListener("click", () => {
    crackers += 1;
    clickSoundPlayer.currentTime = 0;
    clickSoundPlayer.play();
});

document.addEventListener("mouseup", () => {
    if (!userInteracted) {
        userInteracted = true;
        musicPlayer.play();
        musicPlayer.loop = true;
        musicPlayer.volume = 0.2;
    };
});


setInterval(() => {
    crackersLabel.textContent = `${crackers} crackers`;
}, 100);

// autosave data
setInterval(() => {
    localStorage.setItem("crackers", crackers);
    localStorage.setItem("musicMuted", musicMuted);
}, 10000);

muteButton.addEventListener("click", () => { 
    musicMuted = !musicMuted;
    musicPlayer.muted = musicMuted;
    localStorage.setItem("musicMuted", musicMuted);
    if (musicMuted) {
        muteButton.setAttribute("src", "assets/volume_off.svg");
    } else {
        muteButton.setAttribute("src", "assets/volume_on.svg");
    };
});
resetGameButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset your data?")) {
        localStorage.clear();
        history.go(0);
    };
});

// load progress
window.addEventListener("load", () => { loadProgress(); });
