const apiKey = "2c6781f841ce2ad1608de96743a62eb9";
const params = new URLSearchParams(window.location.search);
const tmdbId = params.get("tmdbId") || "2317";
let currentEpisode = +params.get("episode") || 1;
let currentSeason = +params.get("season") || 1;

const elements = Object.fromEntries(
  [
    "server-select",
    "season-select",
    "playlist",
    "video-player",
    "prev-episode",
    "next-episode",
    "edit-button",
    "prev-server",
    "next-server",
    "season-label",
  ].map((id) => [id, document.getElementById(id)])
);

const episodesPerSeason = {};

const loadAPIs = () => {
  const data = localStorage.getItem("urlList");
  return data ? JSON.parse(data) : [];
};

const parseTypeMapping = (url) => {
  const match = url.match(/#type(&[\w]+=\w+)*/);
  const mapping = { tv: "tv", movie: "movie" };
  if (match) {
    const params = match[0].split("&").slice(1);
    params.forEach((p) => {
      const [key, value] = p.split("=");
      if (key && value) mapping[key] = value;
    });
  }
  return mapping;
};

const replacePlaceholders = (url, { tvMovie, tmdbId, season, episode }) => {
  const mapping = parseTypeMapping(url);
  const mediaType =
    mapping[tvMovie] || mapping["tv"] || mapping["movie"] || "tv";

  let newUrl = url
    .replace(/#type(&[\w]+=\w+)*/g, mediaType)
    .replace(/#id/g, tmdbId);

  if (mediaType === mapping["tv"]) {
    newUrl = newUrl.replace(/#season/g, season).replace(/#episode/g, episode);
  } else {
    newUrl = newUrl.replace(/([&?])(s=|e=)([^&]*)/g, "");
    newUrl = newUrl.replace(/#season|#episode/g, "");
  }

  newUrl = newUrl.replace(/([&?])(&|$)/g, "$1").replace(/\/$/, "");

  return newUrl;
};

const fetchData = (url) => fetch(url).then((res) => res.json());

async function fetchSeasons() {
  if (mediaType === "tv") {
    const { seasons } = await fetchData(
      `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${apiKey}`
    );
    elements["season-select"].innerHTML = seasons
      .map(
        ({ season_number, name }) =>
          `<option value="${season_number}">${name}</option>`
      )
      .join("");
    elements["season-select"].value = currentSeason;
    loadEpisodes(currentSeason);
    toggleElements(["season-select", "season-label"], "inline");
  } else {
    toggleElements(["season-select", "season-label"], "none");
  }
}

async function loadEpisodes(seasonNumber) {
  if (mediaType === "tv") {
    const { episodes } = await fetchData(
      `https://api.themoviedb.org/3/tv/${tmdbId}/season/${seasonNumber}?api_key=${apiKey}`
    );
    episodesPerSeason[seasonNumber] = episodes.length;
    elements["playlist"].innerHTML = episodes
      .map(
        ({ episode_number, name }) =>
          `<div class="episode-item p-2 bg-gray-100 rounded cursor-pointer" data-episode="${episode_number}" data-season="${seasonNumber}"><strong>Ep ${episode_number}:</strong> ${name}</div>`
      )
      .join("");
    updateUI();
  }
}

async function getMediaType() {
  for (const type of ["tv", "movie"]) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/${type}/${tmdbId}?api_key=${apiKey}`
      );
      if (res.ok) return type;
    } catch (error) {
      console.error(`${type.toUpperCase()} fetch error:`, error);
    }
  }
  return "tv";
}

let mediaType = "tv";
getMediaType().then((type) => {
  if (type) mediaType = type;
  fetchSeasons();
  updateVideoPlayer();
});

function updateVideoPlayer() {
  elements["video-player"].src = replacePlaceholders(
    elements["server-select"].value,
    {
      tvMovie: mediaType,
      tmdbId,
      season: mediaType === "tv" ? currentSeason : undefined,
      episode: mediaType === "tv" ? currentEpisode : undefined,
    }
  );
  const queryParams = new URLSearchParams({ tmdbId });
  if (mediaType === "tv") {
    queryParams.set("season", currentSeason);
    queryParams.set("episode", currentEpisode);
  }
  history.pushState(null, "", `?${queryParams}`);
  updateUI();
}

function updateUI() {
  if (mediaType === "tv") {
    document
      .querySelectorAll(".episode-item")
      .forEach((el) =>
        el.classList.toggle(
          "highlight",
          el.dataset.episode == currentEpisode &&
            el.dataset.season == currentSeason
        )
      );
    toggleNavigation(currentEpisode);
  } else {
    toggleElements(["prev-episode", "next-episode"], "none");
  }
}

function toggleElements(ids, display) {
  ids.forEach((id) => (elements[id].style.display = display));
}

function toggleNavigation(episode) {
  elements["prev-episode"].classList.toggle("disabled", episode <= 1);
  elements["next-episode"].classList.toggle(
    "disabled",
    episode >= (episodesPerSeason[currentSeason] || 0)
  );
  toggleElements(["prev-episode", "next-episode"], "inline");
}

["server-select", "season-select"].forEach((id) => {
  elements[id].addEventListener("change", (e) =>
    id === "server-select" ? updateVideoPlayer() : loadEpisodes(e.target.value)
  );
});

elements["playlist"].addEventListener("click", (e) => {
  const item = e.target.closest(".episode-item");
  if (item) {
    currentEpisode = +item.dataset.episode;
    currentSeason = +item.dataset.season;
    updateVideoPlayer();
  }
});

[
  ["prev-episode", -1],
  ["next-episode", 1],
].forEach(([id, delta]) => {
  elements[id].addEventListener("click", () => {
    const newEp = currentEpisode + delta;
    if (newEp >= 1 && newEp <= (episodesPerSeason[currentSeason] || 0)) {
      currentEpisode = newEp;
      updateVideoPlayer();
    }
  });
});

[
  ["prev-server", -1],
  ["next-server", 1],
].forEach(([id, delta]) => {
  elements[id].addEventListener("click", () => {
    const select = elements["server-select"];
    const newIndex = select.selectedIndex + delta;
    if (newIndex >= 0 && newIndex < select.options.length) {
      select.selectedIndex = newIndex;
      updateVideoPlayer();
    }
  });
});

function populateServerOptions() {
  elements["server-select"].innerHTML = loadAPIs()
    .map((entry) => {
      let name, url;

      if (entry.includes(":http")) {
        [name, url] = entry.split(":http");
        url = "http" + url;
      } else {
        url = entry;
        const domainMatch = url.match(/https?:\/\/(.*?)(?:\/|$)/);
        name = domainMatch ? domainMatch[1] : url;
      }

      return `<option value="${url}">${name}</option>`;
    })
    .join("");
}

populateServerOptions();

const closeButton = document.createElement("button");
closeButton.textContent = "Close";
closeButton.className =
  "p-2 bg-black text-white rounded mt-2 w-full hover:bg-red-700";
closeButton.style.transition = "background-color 0.3s";
closeButton.addEventListener("mouseout", () => {
  closeButton.style.backgroundColor = "";
});
closeButton.addEventListener("click", () => {
  window.location.href = "index.html";
});

elements["next-episode"].parentNode.insertAdjacentElement(
  "afterend",
  closeButton
);

document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    // Force Safari to repaint the layout
    document.documentElement.style.display = "none";
    setTimeout(() => {
      document.documentElement.style.display = "block";
    }, 50);
  }
});
