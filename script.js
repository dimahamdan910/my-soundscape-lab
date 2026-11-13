
// ECHOES OF PALESTINE
// Interactive audiovisual soundscape

const audio = document.getElementById("audioPlayer");
const playBtn = document.getElementById("playBtn");
const startBtn = document.getElementById("startBtn");
const startText = document.getElementById("startText");
const restartBtn = document.getElementById("restartBtn");
const muteBtn = document.getElementById("muteBtn");
const progressBar = document.getElementById("progressBar");
const currentTimeDisplay = document.getElementById("currentTime");
const durationDisplay = document.getElementById("duration");
const playerStatus = document.getElementById("playerStatus");

const slides = document.querySelectorAll(".slide");
const galleryCards = document.querySelectorAll(".gallery-card");
const sceneTitle = document.getElementById("sceneTitle");
const sceneDescription = document.getElementById("sceneDescription");
const sceneCount = document.getElementById("sceneCount");

// Information for each of the five photographs
const scenes = [
  {
    title: "The Land We Call Home",
    description: "A landscape filled with history and memories."
  },
  {
    title: "Stories in the Streets",
    description: "The voices and busy streets of everyday life."
  },
  {
    title: "Traditions That Live On",
    description: "Food, family, and traditions passed down through generations."
  },
  {
    title: "Rooted in the Land",
    description: "Olive trees and the enduring connection to the land."
  },
  {
    title: "Memories by the Sea",
    description: "The simple joys and beautiful moments of childhood."
  }
];

let currentScene = 0;

// Format seconds as minutes:seconds
function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return minutes + ":" + String(secs).padStart(2, "0");
}

// Change the active photograph
function showScene(index) {
  if (index < 0 || index >= scenes.length) return;
  if (index === currentScene) return;

  slides[currentScene].classList.remove("active");
  galleryCards[currentScene].classList.remove("selected");

  currentScene = index;

  slides[currentScene].classList.add("active");
  galleryCards[currentScene].classList.add("selected");

  sceneTitle.textContent = scenes[index].title;
  sceneDescription.textContent = scenes[index].description;
  sceneCount.textContent =
    String(index + 1).padStart(2, "0") + " / 05";
}

// Update the play/pause buttons
function updateButtons() {
  if (audio.paused) {
    playBtn.textContent = "▶";
    playBtn.setAttribute("aria-label", "Play audio");

    startBtn.querySelector(".play-symbol").textContent = "▶";
    startText.textContent = audio.ended
      ? "LISTEN AGAIN"
      : "START LISTENING";
  } else {
    playBtn.textContent = "Ⅱ";
    playBtn.setAttribute("aria-label", "Pause audio");

    startBtn.querySelector(".play-symbol").textContent = "Ⅱ";
    startText.textContent = "PAUSE EXPERIENCE";
  }
}

// Start or pause the audio
function toggleAudio() {
  if (audio.paused) {
    if (audio.ended) {
      audio.currentTime = 0;
    }

    audio.play().catch(() => {
      playerStatus.textContent =
        "Unable to play audio. Please check the MP3 file.";
    });
  } else {
    audio.pause();
  }
}

// Buttons for playing and pausing
playBtn.addEventListener("click", toggleAudio);
startBtn.addEventListener("click", toggleAudio);

// Restart the soundscape
restartBtn.addEventListener("click", () => {
  audio.currentTime = 0;
  showScene(0);

  audio.play().catch(() => {
    playerStatus.textContent = "Unable to play audio.";
  });
});

// Mute and unmute
muteBtn.addEventListener("click", () => {
  audio.muted = !audio.muted;

  muteBtn.textContent = audio.muted ? "✕" : "♫";
  muteBtn.setAttribute(
    "aria-label",
    audio.muted ? "Unmute audio" : "Mute audio"
  );
});

// When metadata loads, display actual duration
audio.addEventListener("loadedmetadata", () => {
  durationDisplay.textContent = formatTime(audio.duration);
});

// Update progress bar and photographs as audio plays
audio.addEventListener("timeupdate", () => {
  const duration = audio.duration;

  if (!Number.isFinite(duration) || duration <= 0) return;

  const progress = (audio.currentTime / duration) * 100;
  progressBar.value = progress;

  currentTimeDisplay.textContent = formatTime(audio.currentTime);

  // Divide audio into five equal sections.
  // Each section displays a different photograph.
  const sceneLength = duration / scenes.length;

  const newScene = Math.min(
    Math.floor(audio.currentTime / sceneLength),
    scenes.length - 1
  );

  showScene(newScene);
});

// Let users move through the audio manually
progressBar.addEventListener("input", () => {
  if (!Number.isFinite(audio.duration)) return;

  audio.currentTime =
    (Number(progressBar.value) / 100) * audio.duration;
});

// Clicking a photo jumps to its part of the soundscape
galleryCards.forEach((card, index) => {
  card.addEventListener("click", () => {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
      showScene(index);
      return;
    }

    const sceneLength = audio.duration / scenes.length;

    audio.currentTime = index * sceneLength;
    showScene(index);

    // Start playing the chosen scene
    audio.play().catch(() => {
      playerStatus.textContent =
        "Click play to listen to this scene.";
    });

    // Return to the large photograph
    document.querySelector(".hero").scrollIntoView({
      behavior: "smooth"
    });
  });
});

// Messages displayed during playback
audio.addEventListener("play", () => {
  updateButtons();
  playerStatus.textContent =
    "Now playing — the everyday sounds of Palestine.";
});

audio.addEventListener("pause", () => {
  updateButtons();

  if (!audio.ended) {
    playerStatus.textContent = "Experience paused.";
  }
});

// When the audio finishes
audio.addEventListener("ended", () => {
  updateButtons();

  progressBar.value = 100;

  playerStatus.textContent =
    "The sounds may fade, but the memories remain. ♥";
});

// Display a message if the audio file fails to load
audio.addEventListener("error", () => {
  playerStatus.textContent =
    "Audio could not load. Check audio/palestine.mp3";
});

// Keyboard controls: spacebar to play or pause
document.addEventListener("keydown", (event) => {
  const tag = event.target.tagName;

  if (
    event.code === "Space" &&
    tag !== "BUTTON" &&
    tag !== "INPUT"
  ) {
    event.preventDefault();
    toggleAudio();
  }
});

// Initialize
updateButtons();
