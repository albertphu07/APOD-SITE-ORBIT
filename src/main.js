import "./style.css";

const API_KEY = import.meta.env.VITE_NASA_API_KEY || "DEMO_KEY";
const $ = (selector) => document.querySelector(selector);

$("#app").innerHTML = `
  <div class="space-bg"></div>

  <header class="topbar">
    <a class="brand" href="#">
      <span class="brand-icon">✳</span>
      ORBIT<span class="muted"> / MISSION CONTROL</span>
    </a>
    <div class="system-status">
      <span class="live-dot"></span> SYSTEM ONLINE
    </div>
  </header>

  <main class="dashboard">
    <section class="hero">
      <div>
        <p class="eyebrow">PERSONAL SPACE TERMINAL · EARTH</p>
        <h1>Explore the <span>unknown.</span></h1>
        <p class="subtitle">
          Your window into the universe. One discovery at a time.
        </p>
      </div>
      <div class="clock-panel">
        <span class="eyebrow">LOCAL TIME</span>
        <div id="clock" class="clock">--:--:--</div>
        <div id="today" class="muted"></div>
      </div>
    </section>

    <section class="search-panel">
      <span class="search-symbol">⌕</span>
      <form id="search-form">
        <input id="search" placeholder="Search the universe..." 
          aria-label="Search the web" autocomplete="off" />
        <button type="submit">SEARCH ↗</button>
      </form>
    </section>

    <div class="section-heading">
      <div>
        <p class="eyebrow">01 / DAILY INTELLIGENCE</p>
        <h2>Today in the cosmos</h2>
      </div>
      <button id="refresh" class="ghost-button">↻ REFRESH</button>
    </div>

    <section id="apod" class="apod-card">
      <div class="loading"><span class="spinner"></span>
        Establishing connection with NASA...
      </div>
    </section>

    <section class="lower-grid">
      <article class="panel">
        <p class="eyebrow">02 / TIME MACHINE</p>
        <h3>Explore another day</h3>
        <p class="muted">Travel through NASA's daily astronomy archive.</p>
        <label for="apod-date">Select a date</label>
        <div class="date-row">
          <input id="apod-date" type="date" />
          <button id="date-go">EXPLORE ↗</button>
        </div>
      </article>

      <article class="panel focus-panel">
        <p class="eyebrow">03 / DEEP WORK</p>
        <h3>Mission focus</h3>
        <p class="muted">One task. No distractions.</p>
        <div id="timer" class="timer">25:00</div>
        <div class="timer-actions">
          <button id="timer-toggle">START MISSION</button>
          <button id="timer-reset" class="ghost-button">RESET</button>
        </div>
        <p id="timer-status" class="tiny muted">READY FOR LAUNCH</p>
      </article>
    </section>

    <footer>
      <span>ORBIT // EXPLORATION NEVER ENDS</span>
      <span>DATA: NASA APOD API · BUILT ON EARTH</span>
    </footer>
  </main>
`;

const today = new Date();
const dateInput = $("#apod-date");

dateInput.max = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2,0),
  String(today.getDate()).padStart(2, "0")
].join("-");

function updateClock() {
  const now = new Date();
  $("#clock").textContent = now.toLocaleTimeString("en-US", {
    hour12: false
  });
  $("#today").textContent = now.toLocaleDateString("en-US", {
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

async function loadAPOD(date = "") {
  const card = $("#apod");

  card.innerHTML = `
    <div class="loading">
      <span class="spinner"></span>
      Receiving transmission...
    </div>`;

  try {
    const params = new URLSearchParams({
      api_key: API_KEY
    });

    if (date) params.set("date", date);

    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?${params}`
    );

    if (!response.ok) {
      throw new Error(
        response.status === 429
          ? "NASA's request limit was reached. Try again later."
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
      media = `
        <a href="${escapeHTML(data.hdurl || data.url)}"
           target="_blank" rel="noopener noreferrer">
          <img class="apod-image"
               src="${escapeHTML(data.url)}"
               alt="${title}"
               loading="lazy" />
        </a>`;
    } else if (
      data.media_type === "video" &&
      /youtube\.com|youtu\.be/.test(data.url)
    ) {

      const videoURL = new URL(data.url);
      let videoID = "";

      if (videoURL.hostname.endsWith("youtu.be")) {
        videoID = videoURL.pathname.slice(1);
      } else if (videoURL.pathname === "/watch") {
        videoID = videoURL.searchParams.get("v") || "";
      } else if (videoURL.pathname.startsWith("/embed/")) {
        videoID = videoURL.pathname.split("/")[2] || "";
      }

      media = /^[\w-]{11}$/.test(videoID)
        ? `<iframe class="apod-video"
             src="https://www.youtube-nocookie.com/embed/${videoID}"
             title="${title}" loading="lazy"
             allowfullscreen></iframe>`
        : `<p class="media-note">Video link available from NASA.</p>`;
    } else if (data.media_type === "video") {
      media = `
        <video class="apod-video" src="${escapeHTML(data.url)}"
          controls playsinline>
          Your browser does not support embedded video.
        </video>`;
    } else {
      media = `<p class="media-note">No preview available for this item.</p>`;
    }

    card.innerHTML = `
      <div class="apod-media">${media}</div>
      <div class="apod-info">
        <div class="apod-meta">
          <span class="tag">✦ NASA FEATURE</span>
          <span class="muted">${safeDate}</span>
        </div>
        <h3>${title}</h3>
        <p class="explanation">${explanation}</p>
        <div class="apod-credit">IMAGE CREDIT: ${copyright}</div>
      </div>`;
  } catch (error) {
    card.innerHTML = `
      <div class="error-panel">
        <p class="eyebrow">SIGNAL INTERRUPTED</p>
        <h3>We lost contact with NASA.</h3>
        <p>${escapeHTML(error.message)}</p>
        <button id="retry">RETRY CONNECTION ↻</button>
      </div>`;

    $("#retry").addEventListener("click", () => loadAPOD(date));
  }
}

$("#refresh").addEventListener("click", () => {
  loadAPOD(dateInput.value);
});

$("#date-go").addEventListener("click", () => {
  const date = dateInput.value;

  if (!date) {
    dateInput.focus();
    return;
  }

  if (date > dateInput.max) {
    alert("Choose today or an earlier date.");
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

  $("#timer").textContent =
    `${String(minutes).padStart(2, "0")}:` +
    `${String(remainder).padStart(2, "0")}`;
}

$("#timer-toggle").addEventListener("click", () => {
  if (running) {
    clearInterval(interval);
    running = false;
    $("#timer-toggle").textContent = "RESUME MISSION";
    $("#timer-status").textContent = "MISSION PAUSED";
    return;
  }

  if (seconds === 0) seconds = 25 * 60;

  running = true;
  $("#timer-toggle").textContent = "PAUSE MISSION";
  $("#timer-status").textContent = "MISSION IN PROGRESS";

  interval = setInterval(() => {
    seconds--;
    drawTimer();

    if (seconds <= 0) {
      clearInterval(interval);
      running = false;
      $("#timer-toggle").textContent = "START AGAIN";
      $("#timer-status").textContent = "MISSION COMPLETE";
    }
  }, 1000);
});

$("#timer-reset").addEventListener("click", () => {
  clearInterval(interval);
  running = false;
  seconds = 25 * 60;
  drawTimer();
  $("#timer-toggle").textContent = "START MISSION";
  $("#timer-status").textContent = "READY FOR LAUNCH";
});

loadAPOD();

