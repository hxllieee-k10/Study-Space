/* MUSIC SYSTEM */
console.log("music.js loaded");

/* STATE */
let currentPlaylist = null;
let currentTrackIndex = 0;
let isPlaying = false;
let currentTime = 0;
let trackDuration = 240;
let progressTimer = null;

/* PLAYLIST DATA */
const playlists = {
  focus: {
    name: "Deep Focus",
    tracks: [
      { title: "Deep Focus", artist: "Study Space", duration: 240 },
      { title: "Quiet Study", artist: "Study Space", duration: 210 },
      { title: "Concentration", artist: "Study Space", duration: 270 }
    ]
  },
  reading: {
    name: "Reading",
    tracks: [
      { title: "Reading Room", artist: "Study Space", duration: 250 },
      { title: "Soft Pages", artist: "Study Space", duration: 220 },
      { title: "Library Evening", artist: "Study Space", duration: 280 }
    ]
  },
  chill: {
    name: "Chill",
    tracks: [
      { title: "Slow Afternoon", artist: "Study Space", duration: 230 },
      { title: "Quiet Break", artist: "Study Space", duration: 200 },
      { title: "Late Night Study", artist: "Study Space", duration: 260 }
    ]
  }
};

/* START */
document.addEventListener("DOMContentLoaded", () => {
  setupBackButton();
  setupPlayerControls();
  setupPlaylistCards();
  setupSpotifyButton();
  setupProgressBar();
  setupVolumeControl();
  updatePlayer();
});

/* BACK BUTTON */
function setupBackButton() {
  const button = document.getElementById("musicBackButton");
  if (!button) return;
  button.addEventListener("click", () => {
    if (document.referrer && document.referrer !== window.location.href) {
      history.back();
      return;
    }
    window.location.href = "pomodoro.html";
  });
}

/* PLAYER CONTROLS */
function setupPlayerControls() {
  const playButton = document.getElementById("playPauseButton");
  const previousButton = document.getElementById("previousTrackButton");
  const nextButton = document.getElementById("nextTrackButton");

  if (playButton) playButton.addEventListener("click", togglePlay);
  if (previousButton) previousButton.addEventListener("click", previousTrack);
  if (nextButton) nextButton.addEventListener("click", nextTrack);
}
/* PLAYLIST CARDS */
function setupPlaylistCards() {
  const cards = document.querySelectorAll(".playlist-card");
  cards.forEach(card => {
    card.addEventListener("click", () => {
      const playlistName = card.dataset.playlist;
      if (playlists[playlistName]) startPlaylist(playlistName);
    });
  });
}

/* START PLAYLIST */
function startPlaylist(playlistName) {
  currentPlaylist = playlistName;
  currentTrackIndex = 0;
  currentTime = 0;
  isPlaying = true;
  startProgressTimer();
  updatePlayer();
}

/* TOGGLE PLAY */
function togglePlay() {
  if (!currentPlaylist) {
    startPlaylist("focus");
    return;
  }
  isPlaying = !isPlaying;
  if (isPlaying) startProgressTimer();
  else stopProgressTimer();
  updatePlayer();
}

/* NEXT TRACK */
function nextTrack() {
  if (!currentPlaylist) {
    startPlaylist("focus");
    return;
  }
  const playlist = playlists[currentPlaylist];
  currentTrackIndex++;
  if (currentTrackIndex >= playlist.tracks.length) currentTrackIndex = 0;
  currentTime = 0;
  isPlaying = true;
  startProgressTimer();
  updatePlayer();
}

/* PREVIOUS TRACK */
function previousTrack() {
  if (!currentPlaylist) {
    startPlaylist("focus");
    return;
  }
  if (currentTime > 5) {
    currentTime = 0;
    updatePlayer();
    return;
  }
  const playlist = playlists[currentPlaylist];
  currentTrackIndex--;
  if (currentTrackIndex < 0) currentTrackIndex = playlist.tracks.length - 1;
  currentTime = 0;
  isPlaying = true;
  startProgressTimer();
  updatePlayer();
}

/* UPDATE PLAYER */
function updatePlayer() {
  const title = document.getElementById("songTitle");
  const artist = document.getElementById("songArtist");
  const playButton = document.getElementById("playPauseButton");
  const progress = document.getElementById("musicProgress");
  const currentTimeElement = document.getElementById("currentTime");
  const totalTimeElement = document.getElementById("totalTime");

  if (!currentPlaylist) {
    if (title) title.textContent = "Nothing playing";
    if (artist) artist.textContent = "Choose something to listen to";
    if (playButton) playButton.textContent = "Play";
    if (progress) progress.value = 0;
    if (currentTimeElement) currentTimeElement.textContent = "0:00";
    if (totalTimeElement) totalTimeElement.textContent = "0:00";
    return;
  }

  const playlist = playlists[currentPlaylist];
  const track = playlist.tracks[currentTrackIndex];
  trackDuration = track.duration;

  if (title) title.textContent = track.title;
  if (artist) artist.textContent = track.artist;
  if (playButton) playButton.textContent = isPlaying ? "Pause" : "Play";
  if (progress) {
    progress.max = trackDuration;
    progress.value = currentTime;
  }
  if (currentTimeElement) currentTimeElement.textContent = formatTime(currentTime);
  if (totalTimeElement) totalTimeElement.textContent = formatTime(trackDuration);
}
/* PROGRESS TIMER */
function startProgressTimer() {
  stopProgressTimer();
  progressTimer = setInterval(() => {
    if (!isPlaying) return;
    currentTime++;
    if (currentTime >= trackDuration) {
      nextTrack();
      return;
    }
    updatePlayer();
  }, 1000);
}

/* STOP TIMER */
function stopProgressTimer() {
  if (progressTimer) {
    clearInterval(progressTimer);
    progressTimer = null;
  }
}

/* PROGRESS BAR */
function setupProgressBar() {
  const progress = document.getElementById("musicProgress");
  if (!progress) return;
  progress.addEventListener("input", () => {
    currentTime = Number(progress.value);
    updatePlayer();
  });
}

/* VOLUME */
function setupVolumeControl() {
  const volume = document.getElementById("volumeControl");
  if (!volume) return;
  const savedVolume = localStorage.getItem("studySpaceMusicVolume");
  if (savedVolume !== null) volume.value = savedVolume;
  volume.addEventListener("input", () => {
    localStorage.setItem("studySpaceMusicVolume", volume.value);
  });
}
/* SPOTIFY */
function setupSpotifyButton() {
  const button = document.getElementById("connectSpotifyButton");
  if (!button) return;
  button.addEventListener("click", () => {
    alert("Spotify connection will be added when the Spotify integration is set up.");
  });
}

/* TIME FORMAT */
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return minutes + ":" + String(remainingSeconds).padStart(2, "0");
}
