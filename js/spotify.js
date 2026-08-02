/* SPOTIFY AUTHENTICATION */
const SPOTIFY_CLIENT_ID = "8f8c469db92b4a39a66d48dd64bcc630";
const SPOTIFY_REDIRECT_URI ="http://127.0.0.1:5500/study%20webpage%20v3/pages/music.html";
const SPOTIFY_SCOPES = "streaming user-read-email user-read-private user-modify-playback-state user-read-playback-state";
let spotifyPlayer = null;
let spotifyDeviceId = null;
let spotifyPlayerReady = false;

/* SPOTIFY PLAYER */
function setupSpotifyPlayer() {
  const token = localStorage.getItem("spotify_access_token");
  if (!token) {
    console.log("Spotify player waiting for login.");
    return;
  }

  if (typeof Spotify === "undefined") {
    console.error("Spotify Web Playback SDK did not load.");
    return;
  }

  spotifyPlayer = new Spotify.Player({
    name: "Study Space",
    getOAuthToken: callback => {
      callback(localStorage.getItem("spotify_access_token"));
    },
    volume: 0.5
  });

  spotifyPlayer.addListener("ready", ({ device_id }) => {
    spotifyDeviceId = device_id;
    spotifyPlayerReady = true;
    console.log("Study Space Spotify player is ready.");
    console.log("Device ID:", device_id);
  });

  spotifyPlayer.addListener("not_ready", ({ device_id }) => {
    spotifyPlayerReady = false;
    console.log("Spotify player is not ready:", device_id);
  });

  spotifyPlayer.addListener("initialization_error", ({ message }) => {
    console.error("Spotify initialization error:", message);
  });

  spotifyPlayer.addListener("authentication_error", ({ message }) => {
    console.error("Spotify authentication error:", message);
  });

  spotifyPlayer.addListener("account_error", ({ message }) => {
    console.error("Spotify account error:", message);
  });

  spotifyPlayer.addListener("player_state_changed", state => {
    if (!state) return;
    console.log("Spotify playback state:", state);
  });

  spotifyPlayer.connect().then(success => {
    if (success) console.log("Study Space connected to Spotify.");
  });
}


/* START */
document.addEventListener("DOMContentLoaded", () => {
  setupSpotifyLogin();
  handleSpotifyCallback();
  setupSpotifyPlayer();
});


/* SPOTIFY LOGIN BUTTON */
function setupSpotifyLogin() {
  const button = document.getElementById("connectSpotifyButton");
  if (!button) return;
  button.addEventListener("click", startSpotifyLogin);
}

/* START LOGIN */
async function startSpotifyLogin() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  localStorage.setItem("spotify_code_verifier", codeVerifier);

  const state = generateRandomString(16);
  localStorage.setItem("spotify_auth_state", state);

  const authorizationURL = new URL("https://accounts.spotify.com/authorize");
  authorizationURL.searchParams.set("response_type", "code");
  authorizationURL.searchParams.set("client_id", SPOTIFY_CLIENT_ID);
  authorizationURL.searchParams.set("scope", SPOTIFY_SCOPES);
  authorizationURL.searchParams.set("redirect_uri", SPOTIFY_REDIRECT_URI);
  authorizationURL.searchParams.set("state", state);
  authorizationURL.searchParams.set("code_challenge_method", "S256");
  authorizationURL.searchParams.set("code_challenge", codeChallenge);

  window.location.href = authorizationURL.toString();
}

/* HANDLE CALLBACK */
async function handleSpotifyCallback() {
  const parameters = new URLSearchParams(window.location.search);
  const code = parameters.get("code");
  const returnedState = parameters.get("state");
  const error = parameters.get("error");

  if (error) {
    console.error("Spotify authorization failed:", error);
    return;
  }
  if (!code) return;

  const savedState = localStorage.getItem("spotify_auth_state");
  if (!savedState || returnedState !== savedState) {
    console.error("Spotify state verification failed.");
    return;
  }

  try {
    const accessToken = await exchangeCodeForToken(code);
    localStorage.setItem("spotify_access_token", accessToken);
    localStorage.removeItem("spotify_code_verifier");
    localStorage.removeItem("spotify_auth_state");
    window.history.replaceState({}, document.title, window.location.pathname);
    console.log("Spotify connected successfully.");
    showSpotifyConnected();
    setupSpotifyPlayer();
  } catch (error) {
    console.error("Could not connect Spotify:", error);
  }
}

/* EXCHANGE CODE FOR TOKEN */
async function exchangeCodeForToken(code) {
  const codeVerifier = localStorage.getItem("spotify_code_verifier");
  if (!codeVerifier) throw new Error("Spotify code verifier is missing.");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      grant_type: "authorization_code",
      code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      code_verifier: codeVerifier
    })
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("Spotify token error:", data);
    throw new Error("Spotify token request failed.");
  }
  return data.access_token;
}

/* CODE VERIFIER */
function generateCodeVerifier() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let verifier = "";
  const randomValues = new Uint8Array(64);
  crypto.getRandomValues(randomValues);
  randomValues.forEach(value => {
    verifier += characters[value % characters.length];
  });
  return verifier;
}

/* CODE CHALLENGE */
async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64URL(new Uint8Array(digest));
}

/* BASE64 URL */
function base64URL(buffer) {
  let binary = "";
  buffer.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/* RANDOM STATE */
function generateRandomString(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const values = new Uint8Array(length);
  crypto.getRandomValues(values);
  values.forEach(value => { result += characters[value % characters.length]; });
  return result;
}

/* CHECK CONNECTION */
function isSpotifyConnected() {
  return Boolean(localStorage.getItem("spotify_access_token"));
}

/* CONNECTED UI */
function showSpotifyConnected() {
  const button = document.getElementById("connectSpotifyButton");
  if (!button) return;
  button.textContent = "Spotify Connected";
  button.disabled = true;
}
