const placeholderTags = ["#type", "#id", "#season", "#episode"];
const placeholderRegex = /#type|#id|#season|#episode/g;
const maxUrls = 999;

function saveData() {
  document.cookie = `urlList=${encodeURIComponent(
    JSON.stringify(getUrlList())
  )};path=/`;
}

function loadData() {
  const match = document.cookie.match(/urlList=([^;]+)/);
  return match ? JSON.parse(decodeURIComponent(match[1])) : [];
}

function getUrlList() {
  return Array.from(document.querySelectorAll(".url-input")).map(
    (input) => input.value
  );
}

function addUrl(value = "") {
  if (document.querySelectorAll(".url-input").length >= maxUrls) return;

  const container = document.createElement("div");
  container.className =
    "flex items-center space-x-2 bg-white p-2 rounded-lg border";

  const moveUpBtn = document.createElement("button");
  moveUpBtn.innerHTML = "▲";
  moveUpBtn.className = "text-black px-2 py-1";
  moveUpBtn.onclick = () => {
    const prev = container.previousElementSibling;
    if (prev) container.parentNode.insertBefore(container, prev);
    saveData();
  };

  const moveDownBtn = document.createElement("button");
  moveDownBtn.innerHTML = "▼";
  moveDownBtn.className = "text-black px-2 py-1";
  moveDownBtn.onclick = () => {
    const next = container.nextElementSibling;
    if (next) container.parentNode.insertBefore(next, container);
    saveData();
  };

  const input = document.createElement("input");
  input.type = "text";
  input.value = value;
  input.className = "url-input border p-3 rounded-lg flex-1";

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "✕";
  removeBtn.className = "text-black px-2 py-1";
  removeBtn.onclick = () => {
    container.remove();
    saveData();
  };

  container.appendChild(moveUpBtn);
  container.appendChild(moveDownBtn);
  container.appendChild(input);
  container.appendChild(removeBtn);
  document.getElementById("url-list").appendChild(container);

  input.addEventListener("input", saveData);
}

document.getElementById("add-url").onclick = () => addUrl();

document.getElementById("export-btn").onclick = () => {
  const data = btoa(JSON.stringify(getUrlList()));
  document.getElementById("import-input").value = data;
};

document.getElementById("import-btn").onclick = () => {
  try {
    const data = JSON.parse(
      atob(document.getElementById("import-input").value)
    );
    document.getElementById("url-list").innerHTML = "";
    data.forEach((url) => addUrl(url));
    saveData();
  } catch (e) {
    alert("Incorrect format");
  }
};

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

    debugInfo.innerHTML += `<div class="p-3 border rounded-lg bg-gray-50">
        <strong class="text-black">URL ${
          index + 1
        }:</strong> <a href="${url}" class="text-black underline break-all" target="_blank">${url}</a><br>
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
};

loadData().forEach(addUrl);
