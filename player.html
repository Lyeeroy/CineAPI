<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CineAPI</title>
    <script src="https://cdn.tailwindcss.com"></script>

    <style>
      body {
        transition: background 0.3s, color 0.3s;
      }
      .episode-item:hover {
        background: #111;
        color: #fff;
      }
      .highlight {
        background: black !important;
        color: white !important;
      }
      .disabled {
        background: gray !important;
        cursor: not-allowed !important;
      }
      .responsive-container {
        width: 100%; /* Default width */
        height: 90vh; /* Default height for horizontal orientation */
      }

      /*mobile devices in portrait orientation */
      @media (max-width: 640px) and (orientation: portrait) {
        .responsive-container {
          height: calc(80vw); /* 16:9 aspect ratio (100vw * 9 / 16) */
        }
      }

      /*mobile devices in landscape orientation */
      @media (max-width: 640px) and (orientation: landscape) {
        .responsive-container {
          height: 90vh; /* Maintain 90vh */
        }
      }

      /*tablets in portrait orientation */
      @media (min-width: 641px) and (max-width: 1024px) and (orientation: portrait) {
        .responsive-container {
          height: calc(100vw * 9 / 16); /* 16:9 aspect ratio */
        }
      }

      /*larger screens */
      @media (min-width: 1025px) {
        .responsive-container {
          height: 100%; /* Full height */
          width: 100%; /* Full width */
        }
      }
    </style>
  </head>

  <body class="bg-white text-black">
    <div class="lg:flex flex-col md:flex-row h-[100dvh] max-h-screen min-h-0">
      <div id="video-container" class="flex-1 bg-black relative">
        <iframe
          id="video-player"
          class="responsive-container"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>

      <div
        class="md:flex md:flex-col w-full lg:w-1/3 bg-white p-4 shadow-xl border-t md:border-l border-gray-300 lg:w-96 overflow-y-auto"
      >
        <label for="season-select" class="text-sm font-semibold">Source:</label>

        <div class="flex items-center">
          <button
            id="prev-server"
            class="px-4 py-2 bg-gray-200 text-black rounded-l-lg active:bg-gray-300 transition"
          >
            &#8249;
          </button>
          <select
            id="server-select"
            class="px-4 py-2 w-full bg-gray-200 text-black outline-none appearance-none"
          ></select>
          <button
            id="next-server"
            class="px-4 py-2 bg-gray-200 text-black rounded-r-lg active:bg-gray-300 transition"
          >
            &#8250;
          </button>
          <button
            id="editButton"
            class="ml-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Edit
          </button>
        </div>

        <label
          id="season-label"
          for="season-select"
          class="text-sm font-semibold"
          >Season:</label
        >
        <select
          id="season-select"
          class="w-full px-4 py-2 rounded bg-gray-200 text-black mb-4"
        ></select>

        <div
          id="playlist"
          class="space-y-2 overflow-y-auto flex-1 sm:max-h-[50vh] lg:max-h-none"
        ></div>

        <div class="flex justify-between text-white bg-white rounded-t-xl mt-2">
          <button
            id="prev-episode"
            class="w-1/2 p-2 mr-1 bg-black text-white rounded"
          >
            Previous
          </button>
          <button
            id="next-episode"
            class="w-1/2 p-2 ml-1 bg-black text-white rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <div
      id="url-list-frame"
      class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-full lg:max-w-[80vh] h-full md:max-h-[90vh] flex flex-col relative"
      >
        <div class="p-4 flex items-center justify-between border-b">
          <h1 class="text-xl md:text-2xl font-bold">📋 URL List Manager</h1>
          <div class="flex items-center space-x-3">
            <button id="api_full" class="text-black text-2xl">▢</button>
            <button id="close-frame" class="text-black text-2xl">✕</button>
          </div>
          <script>
            const link2 = document.getElementById("api_full");
            const path2 = window.location.pathname
              .split("/")
              .slice(0, -1)
              .join("/");
            link2.addEventListener("click", () => {
              window.location.href = `${path2}/apis.html`;
            });
          </script>
        </div>

        <div id="url-list" class="flex-1 p-4 space-y-3 overflow-y-auto"></div>

        <div class="p-4 border-t">
          <button
            id="add-url"
            class="bg-black text-white px-4 py-3 rounded-lg w-full"
          >
            + Add URL
          </button>
          <div class="mt-4 flex space-x-2">
            <button
              id="export-btn"
              class="bg-black text-white px-4 py-2 rounded-lg w-1/2"
            >
              ↑ Export
            </button>
            <button
              id="import-btn"
              class="bg-black text-white px-4 py-2 rounded-lg w-1/2"
            >
              ↓ Import
            </button>
          </div>
          <textarea
            id="import-input"
            placeholder="Paste code to import or see exported code here"
            class="border p-3 rounded-lg w-full mt-3 h-24 resize-none"
          ></textarea>

          <button
            id="debug-btn"
            class="bg-black text-white px-4 py-2 rounded-lg w-full mt-4"
          >
            🛠 Debug Panel
          </button>

          <a
            id="full-scale-link"
            class="text-sm text-gray-500 flex justify-center mt-4 hover:text-black"
          >
            Full scale version
          </a>
        </div>
      </div>
    </div>

    <script>
      const link = document.getElementById("full-scale-link");
      const path = window.location.pathname.split("/").slice(0, -1).join("/");
      link.href = `${path}/apis.html`;
    </script>

    <div
      id="debug-panel"
      class="hidden fixed top-10 left-1/2 transform -translate-x-1/2 bg-white border rounded-2xl shadow-2xl p-6 w-96 z-20 max-h-[90vh] overflow-y-auto z-50"
    >
      <h2 class="text-2xl font-bold mb-4 text-center">Debug Panel 📝</h2>
      <div id="debug-info" class="text-sm space-y-4"></div>
      <button
        id="close-debug"
        class="bg-black text-white px-4 py-2 rounded-lg w-full mt-4"
      >
        Close
      </button>
    </div>
    </div>
  </body>
  <script src="src/edit.js"></script>
  <script src="src/player.js"></script>
</html>
