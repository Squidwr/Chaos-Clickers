document.atoc = () => {
    const clickButton = document.getElementById("cracker");
    const muteButton = document.getElementById("toggleMute");
    const resetGameButton = document.getElementById("resetGame");
    const helpButton = document.getElementById("help");
    const saveButton = document.getElementById("save");
    const restoreButton = document.getElementById("restore");
    const crackersLabel = document.getElementById("amount");
    const cpsLabel = document.getElementById("crackersPerSecond");
    const clickSoundPlayer = new Audio("assets/click.wav");
    const musicPlayer = new Audio("assets/music.wav");

    let userInteracted = false;
    let showExactAmount = false;
    let resettingData = false;
    let crackersPerSecond = 0;
    let playerData = {
        crackers: 0,
        multiplier: 1,
        musicMuted: false,
        gameStarted: Math.floor(Date.now() / 1000)
    };

    function loadProgress() {
        if (localStorage.getItem("playerData") == undefined) localStorage.setItem("playerData", atob(JSON.stringify(playerData)));
        playerData = JSON.parse(atob(localStorage.getItem("playerData")));
        if (playerData.musicMuted) muteButton.click();
    };

    function saveProgress() {
        if (!resettingData) localStorage.setItem("playerData", btoa(JSON.stringify(playerData)));
    };

    function getPriceOfUpgrade(type) {
        switch (type) {
            case "multiplier":
                return 500 * playerData.multiplier;
        };
    };

    function clickCracker() {
        let amount = (1 * playerData.multiplier);
        playerData.crackers += amount;
        crackersPerSecond += amount;
    };

    function upgrade(type) {
        if (playerData[type]) {
            let price = getPriceOfUpgrade(type);
            if (playerData.crackers >= price) {
                playerData.crackers -= price;
                playerData[type] += 1;
            } else {
                alert(`You are ${price - playerData.crackers} crackers short from upgrading!`);
            };
        };
    };

    function abbreviateNumber(num) {
        return Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(num);
    };

    // clicking
    clickButton.addEventListener("click", () => {
        clickCracker();
        clickSoundPlayer.currentTime = 0;
        clickSoundPlayer.play();
    });

    // play music
    document.addEventListener("mouseup", () => {
        if (!userInteracted) {
            userInteracted = true;
            musicPlayer.play();
            musicPlayer.loop = true;
            musicPlayer.volume = 0.2;
        };
    });

    // quick action buttons
    muteButton.addEventListener("click", () => { 
        playerData.musicMuted = !playerData.musicMuted;
        musicPlayer.muted = playerData.musicMuted;
        if (playerData.musicMuted) {
            muteButton.setAttribute("src", "assets/volume_off.svg");
        } else {
            muteButton.setAttribute("src", "assets/volume_on.svg");
        };
    });
    resetGameButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to reset your data?")) {
            localStorage.clear();
            resettingData = true;
            history.go(0);
        };
    });
    helpButton.addEventListener("click", () => {
        alert("Game made by s4300 and Squidwr. Icons are provided by Google Fonts.");
    });
    saveButton.addEventListener("click", () => {
        if (confirm("Do you want to copy your save file to your clipboard?")) {
            try {
                navigator.clipboard.writeText(localStorage.getItem("playerData"));
                alert("Copied to clipboard!");
            } catch (err) {
                alert(`Error: ${err}`);
            }
        };
    });
    restoreButton.addEventListener("click", () => {
        let newData = prompt("Enter the save file string:");
        if (!newData) return;
        resettingData = true;
        try {
            if (!atob(newData)) return false;
            localStorage.setItem("playerData", newData);
            history.go(0);
        } catch {
            alert("Failed to restore save data.");
        };
    });

    // events
    document.atoc = () => { alert("Yeah, it's not gonna work.") };
    crackersLabel.addEventListener("mouseenter", () => { showExactAmount = true; });
    crackersLabel.addEventListener("mouseleave", () => { showExactAmount = false; });
    setInterval(() => { saveProgress(); }, 10000);
    setInterval(() => { crackersPerSecond = 0; }, 1000);
    setInterval(() => {
        crackersLabel.textContent = `${showExactAmount ? playerData.crackers : abbreviateNumber(playerData.crackers)} crackers`;
        clickButton.style.rotate = `${Number(clickButton.style.rotate.replace("deg", "")) + 1}deg`;
        cpsLabel.textContent = `${crackersPerSecond}`;
        document.getElementById("timePlayed").textContent =  `${abbreviateNumber(Math.floor(playerData.gameStarted - Date.now() / 1000) * -1)} seconds`;
        // document.getElementById("exactAmount").textContent =  `${playerData.crackers}`;
        ["multiplier"].forEach((n) => {
            let elem = document.getElementById(`${n}Count`);
            elem.textContent = playerData[n];

            elem.parentNode.querySelector("a").textContent = `Upgrade for ${getPriceOfUpgrade(n)} crackers`;
        });
    }, 100);
    window.addEventListener("load", () => { loadProgress(); });
};

document.atoc();
