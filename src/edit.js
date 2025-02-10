const placeholderTags = ["#type", "#id", "#season", "#episode"];
const placeholderRegex = /#type|#id|#season|#episode/g;
const maxUrls = 999;

function saveData() {
  localStorage.setItem("urlList", JSON.stringify(getUrlList()));
}

const loadData = () => {
  const data = localStorage.getItem("urlList");
  return data ? JSON.parse(data) : [];
};

function getUrlList() {
  return Array.from(document.querySelectorAll(".url-input")).map(
    (input) => input.value
  );
}

function addUrl(value = "") {
  if (document.querySelectorAll(".url-input").length >= maxUrls) return;

  const container = document.createElement("div");
  container.className =
    "flex items-center space-x-2 bg-white p-2 rounded-lg border dark:bg-[#25282a] dark:text-white dark:border-gray-600";

  const moveUpBtn = document.createElement("button");
  moveUpBtn.innerHTML = "▲";
  moveUpBtn.className = "text-black px-2 py-1";
  moveUpBtn.onclick = () => {
    const prev = container.previousElementSibling;
    if (prev) container.parentNode.insertBefore(container, prev);
  };

  const moveDownBtn = document.createElement("button");
  moveDownBtn.innerHTML = "▼";
  moveDownBtn.className = "text-black px-2 py-1";
  moveDownBtn.onclick = () => {
    const next = container.nextElementSibling;
    if (next) container.parentNode.insertBefore(next, container);
  };

  const input = document.createElement("input");
  input.type = "text";
  input.value = value;
  input.className =
    "url-input border p-3 rounded-lg flex-1 dark:bg-[#25282a] dark:text-white dark:border-gray-600";

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "✕";
  removeBtn.className = "text-black px-2 py-1";
  removeBtn.onclick = () => {
    container.remove();
  };

  container.appendChild(moveUpBtn);
  container.appendChild(moveDownBtn);
  container.appendChild(input);
  container.appendChild(removeBtn);
  document.getElementById("url-list").appendChild(container);

  document.getElementById("save-btn").onclick = () => {
    saveData();
    const popup = document.createElement("div");
    popup.className =
      "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-600 dark:bg-green-800 text-white p-4 rounded-lg z-1000";
    popup.textContent = "Data saved!";
    document.body.appendChild(popup);
    setTimeout(() => {
      document.body.removeChild(popup);
    }, 1000);
  };
}

document.getElementById("add-url").onclick = () => addUrl();

document.getElementById("debug-btn").onclick = () => {
  const debugInfo = document.getElementById("debug-info");
  debugInfo.innerHTML = "";
  getUrlList().forEach((url, index) => {
    const placeholders = [...url.matchAll(placeholderRegex)].map(
      (match) => match[0]
    );
    const uniquePlaceholders = [...new Set(placeholders)];
    const missing = placeholderTags.filter(
      (tag) => !uniquePlaceholders.includes(tag)
    );
    const completeness = `${uniquePlaceholders.length}/4`;

    debugInfo.innerHTML += `<div class="p-3 border rounded-lg bg-gray-50 dark:bg-[#25282a] dark:border-gray-600 dark:text-white">
        <strong class="text-black dark:text-white">URL ${
          index + 1
        }:</strong> <a href="${url}" class="text-black underline break-all dark:text-white" target="_blank">${url}</a><br>
        <span>📍 Placeholders found: <strong>${
          uniquePlaceholders.length ? uniquePlaceholders.join(", ") : "None"
        }</strong></span><br>
        <span>✅ Completeness: <strong>${completeness}</strong>${
      missing.length ? ` (❌ Missing: ${missing.join(", ")})` : ""
    }</span><br>
        <span>🔍 Valid: <strong>${
          uniquePlaceholders.length === placeholderTags.length ? "Yes" : "No"
        }</strong></span>
      </div>`;
  });
  document.getElementById("debug-panel").classList.remove("hidden");
};

document.getElementById("close-debug").onclick = () => {
  document.getElementById("debug-panel").classList.add("hidden");
};

document.getElementById("editButton").onclick = () => {
  document.getElementById("url-list-frame").classList.remove("hidden");
};

document.getElementById("close-frame").onclick = () => {
  document.getElementById("url-list-frame").classList.add("hidden");
  populateServerOptions(); // Refresh server-select options
};

loadData().forEach(addUrl);

function populateServerOptions() {
  const serverSelect = document.getElementById("server-select");
  serverSelect.innerHTML = getUrlList()
    .map((url, index) => `<option value="${index}">${url}</option>`)
    .join("");
}
