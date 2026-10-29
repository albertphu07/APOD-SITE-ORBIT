import "./style.css";

const API_KEY = import.meta.env.VITE_NASA_API_KEY || "DEMO_KEY";
const $ = (selector) => document.querySelector(selector);

$("#app").innerHTML = `
  <div class="space-bg" aria-hidden="true"></div>

  <header class="topbar">
    <a class="brand" href="/" aria-label="Orbit home">
      <span class="brand-mark" aria-hidden="true">✦</span>
      <span>Orbit</span>
    </a>
    <p class="system-status">
      <span class="live-dot" aria-hidden="true"></span>
      <span>NASA archive connected</span>
    </p>
  </header>

  <main class="dashboard">
    <section class="hero" aria-labelledby="page-title">
      <div class="hero-copy">
        <p class="eyebrow">A small window into a very big universe</p>
        <h1 id="page-title">Take a moment<br />to <em>look up.</em></h1>
        <p class="subtitle">
          One remarkable image from space, every day. No jargon required.
        </p>
      </div>
      <div class="clock-panel" aria-label="Current local time">
        <span class="eyebrow">Right now</span>
        <time id="clock" class="clock">--:--:--</time>
        <span id="today" class="muted"></span>
      </div>
    </section>

    <section class="search-panel" aria-label="Search">
      <span class="search-symbol" aria-hidden="true">⌕</span>
      <form id="search-form">
        <label class="sr-only" for="search">Search NASA and space topics</label>
        <input id="search" placeholder="Search NASA and space topics" autocomplete="off" />
        <button type="submit">Search the web <span aria-hidden="true">↗</span></button>
      </form>
    </section>

    <div class="section-heading">
      <div>
        <p class="eyebrow">Today’s feature</p>
        <h2>Somewhere out there</h2>
      </div>
      <button id="refresh" class="ghost-button" type="button">
        <span aria-hidden="true">↻</span> Another look
      </button>
    </div>

    <section id="apod" class="apod-card" aria-live="polite">
      <div class="loading" role="status"><span class="spinner"></span>
        Finding today’s picture...
      </div>
    </section>

    <section class="lower-grid" aria-label="More ways to explore">
      <article class="panel">
        <p class="eyebrow">The archive</p>
        <h3>Visit another day</h3>
        <p class="muted">NASA has been sharing a picture of the cosmos since 1995.</p>
        <label for="apod-date">Choose a date</label>
        <div class="date-row">
          <input id="apod-date" type="date" />
          <button id="date-go" type="button">View picture <span aria-hidden="true">↗</span></button>
        </div>
      </article>

      <article class="panel focus-panel">
        <p class="eyebrow">A little space</p>
        <h3>Focus for 25 minutes</h3>
        <p class="muted">Put the phone down. Give one thing your full attention.</p>
        <div id="timer" class="timer" role="timer" aria-label="25 minutes remaining">25:00</div>
        <div class="timer-actions">
          <button id="timer-toggle" type="button">Start timer</button>
          <button id="timer-reset" class="ghost-button" type="button">Reset</button>
        </div>
        <p id="timer-status" class="tiny muted" aria-live="polite">Ready when you are</p>
      </article>
    </section>

    <footer>
      <span>Made for curious people</span>
      <span>Images and data from NASA’s APOD API</span>
    </footer>
  </main>
`;

const today = new Date();
const dateInput = $("#apod-date");

dateInput.max = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0")
].join("-");

function updateClock() {
  const now = new Date();
  $("#clock").textContent = now.toLocaleTimeString([], { hour12: false });
  $("#today").textContent = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

updateClock();
setInterval(updateClock, 1000);

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function getYouTubeId(url) {
  try {
    const videoURL = new URL(url);
    if (videoURL.hostname.endsWith("youtu.be")) {
      return videoURL.pathname.slice(1);
    }
    if (videoURL.pathname === "/watch") {
      return videoURL.searchParams.get("v") || "";
    }
    if (videoURL.pathname.startsWith("/embed/")) {
      return videoURL.pathname.split("/")[2] || "";
    }
  } catch {
    return "";
  }
  return "";
}

async function loadAPOD(date = "") {
  const card = $("#apod");
  $("#refresh").disabled = true;
  card.innerHTML = `
    <div class="loading" role="status">
      <span class="spinner"></span>
      Finding a picture worth looking at...
    </div>`;

  try {
    const params = new URLSearchParams({ api_key: API_KEY });
    if (date) params.set("date", date);

    const response = await fetch(`https://api.nasa.gov/planetary/apod?${params}`);
    if (!response.ok) {
      throw new Error(
        response.status === 429
          ? "NASA’s request limit was reached. Try again in a little while."
          : `NASA returned HTTP ${response.status}.`
      );
    }

    const data = await response.json();
    const title = escapeHTML(data.title);
    const explanation = escapeHTML(data.explanation);
    const copyright = escapeHTML(data.copyright || "NASA / Public Domain");
    const safeDate = escapeHTML(data.date);
    let media = "";

    if (data.media_type === "image") {
      const imageURL = escapeHTML(data.url);
      const highResURL = escapeHTML(data.hdurl || data.url);
      media = `
        <a href="${highResURL}" target="_blank" rel="noopener noreferrer">
          <img class="apod-image" src="${imageURL}" alt="${title}" loading="lazy" />
        </a>`;
    } else if (data.media_type === "video") {
      const videoID = getYouTubeId(data.url);
      media = /^[\w-]{11}$/.test(videoID)
        ? `<iframe class="apod-video"
             src="https://www.youtube-nocookie.com/embed/${videoID}"
             title="${title}" loading="lazy" allowfullscreen></iframe>`
        : `<video class="apod-video" src="${escapeHTML(data.url)}" controls playsinline>
             Your browser does not support embedded video.
           </video>`;
    } else {
      media = `<p class="media-note">No preview is available for this item.</p>`;
    }

    card.innerHTML = `
      <div class="apod-media">${media}</div>
      <div class="apod-info">
        <div class="apod-meta">
          <span class="tag">NASA APOD</span>
          <span class="muted">${safeDate}</span>
        </div>
        <h3>${title}</h3>
        <p class="explanation">${explanation}</p>
        <div class="apod-credit">Image credit: ${copyright}</div>
      </div>`;
  } catch (error) {
    card.innerHTML = `
      <div class="error-panel">
        <p class="eyebrow">A small interruption</p>
        <h3>We couldn’t reach NASA right now.</h3>
        <p>${escapeHTML(error.message)}</p>
        <button id="retry" type="button">Try again <span aria-hidden="true">↻</span></button>
      </div>`;
    $("#retry").addEventListener("click", () => loadAPOD(date));
  } finally {
    $("#refresh").disabled = false;
  }
}

$("#refresh").addEventListener("click", () => loadAPOD(dateInput.value));

$("#date-go").addEventListener("click", () => {
  const date = dateInput.value;
  if (!date) {
    dateInput.focus();
    return;
  }
  if (date > dateInput.max) {
    dateInput.setCustomValidity("Choose today or an earlier date.");
    dateInput.reportValidity();
    dateInput.setCustomValidity("");
    return;
  }
  loadAPOD(date);
});

$("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const query = $("#search").value.trim();
  if (!query) return;
  window.open(
    `https://www.google.com/search?q=${encodeURIComponent(query + " NASA")}`,
    "_blank",
    "noopener,noreferrer"
  );
});

let seconds = 25 * 60;
let running = false;
let interval = null;

function drawTimer() {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  $("#timer").textContent = `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
  $("#timer").setAttribute(
    "aria-label",
    `${minutes} minute${minutes === 1 ? "" : "s"} ${remainder} seconds remaining`
  );
}

$("#timer-toggle").addEventListener("click", () => {
  if (running) {
    clearInterval(interval);
    running = false;
    $("#timer-toggle").textContent = "Resume timer";
    $("#timer-status").textContent = "Paused";
    return;
  }

  if (seconds === 0) seconds = 25 * 60;
  running = true;
  $("#timer-toggle").textContent = "Pause timer";
  $("#timer-status").textContent = "In progress";

  interval = setInterval(() => {
    seconds--;
    drawTimer();
    if (seconds <= 0) {
      clearInterval(interval);
      running = false;
      $("#timer-toggle").textContent = "Start again";
      $("#timer-status").textContent = "Finished — nice work";
    }
  }, 1000);
});

$("#timer-reset").addEventListener("click", () => {
  clearInterval(interval);
  running = false;
  seconds = 25 * 60;
  drawTimer();
  $("#timer-toggle").textContent = "Start timer";
  $("#timer-status").textContent = "Ready when you are";
});

loadAPOD();
