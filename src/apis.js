const placeholderTags = ["#type", "#id", "#season", "#episode"];
const placeholderRegex = /#type|#id|#season|#episode/g;
const maxUrls = 999;
const baseDomain = "https://lyeeroy.github.io/CineAPI/";

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
  input.className = "url-input border p-3 rounded-lg flex-1 w-full";

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

  document.getElementById("save-btn").onclick = () => {
    saveData();
    const popup = document.createElement("div");
    popup.className =
      "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-600 text-white p-4 rounded-lg";
    popup.textContent = "Data saved!";
    document.body.appendChild(popup);
    setTimeout(() => {
      document.body.removeChild(popup);
    }, 1000);
  };
}

document.getElementById("add-url").onclick = () => addUrl();

document.getElementById("copy-btn").onclick = () => {
  const textArea = document.getElementById("import-input");
  const text = textArea.value;
  const tempInput = document.createElement("input");
  document.body.appendChild(tempInput);
  tempInput.value = text;
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
  textArea.classList.add("border-green-700");
  setTimeout(() => {
    textArea.classList.remove("border-green-700");
  }, 100);
};

document.getElementById("export-btn").onclick = () => {
  const select = document.getElementById("export-format");
  const urlListData = btoa(JSON.stringify(getUrlList()));
  let data;
  switch (select.value) {
    case "export-code":
      data = urlListData;
      break;
    case "export-url":
      data = `${baseDomain}apis.html?import=${urlListData}`;
      break;
    case "export-url-redirect":
      data = `${baseDomain}apis.html?import=${urlListData}&redirect=true`;
      break;
  }
  document.getElementById("import-input").value = data;
};

document.getElementById("import-btn").onclick = () => {
  try {
    const inputData = document.getElementById("import-input").value;
    const importData = inputData.includes(`${baseDomain}apis.html?import=`)
      ? inputData.split(`${baseDomain}apis.html?import=`)[1].split("&")[0]
      : inputData;
    const data = JSON.parse(atob(importData));
    document.getElementById("url-list").innerHTML = "";
    data.forEach((url) => addUrl(url));
    saveData();
  } catch (e) {
    alert("Incorrect format");
  }
};

const params = new URLSearchParams(window.location.search);
const importCode = params.get("import");
const redirect = params.get("redirect") === "true";

if (importCode) {
  try {
    const data = JSON.parse(atob(importCode));
    document.getElementById("url-list").innerHTML = "";
    data.forEach((url) => addUrl(url));
    saveData();
    if (redirect) {
      window.location.href = "index.html";
    }
  } catch (e) {
    console.error("Failed to import automatically", e);
  }
} else {
  loadData().forEach(addUrl);
}

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
                  uniquePlaceholders.length
                    ? uniquePlaceholders.join(", ")
                    : "None"
                }</strong></span><br>
                <span>✅ Completeness: <strong>${completeness}</strong>${
      missing.length ? ` (❌ Missing: ${missing.join(", ")})` : ""
    }</span><br>
                <span>🔍 Valid: <strong>${
                  uniquePlaceholders.length === placeholderTags.length
                    ? "Yes"
                    : "No"
                }</strong></span>
            </div>`;
  });
  debugInfo.innerHTML += `<div class="text-center mt-4 text-gray-600">💾 Data stored in cookies as 'urlList'</div>`;
  document.getElementById("debug-panel").classList.remove("hidden");
};

document.getElementById("close-debug").onclick = () => {
  document.getElementById("debug-panel").classList.add("hidden");
};

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.shiftKey && event.key === "D") {
    document.getElementById("debug-btn").click();
  }
});

document.getElementById("toggle-docs").onclick = () => {
  const docs = document.getElementById("documentation");
  const arrow = document.getElementById("arrow");
  docs.classList.toggle("hidden");
  arrow.textContent = docs.classList.contains("hidden") ? "▼" : "▲";
};
