<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ToastToast</title>
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
      #video-player {
        height: calc(var(--vh, 1vh) * 60);
      }

      @media (min-width: 640px) {
        #video-player {
          height: calc(var(--vh, 1vh) * 90);
        }
      }

      @media (min-width: 1024px) {
        #video-player {
          height: 100%;
        }
      }
    </style>
  </head>

  <body class="bg-white text-black">
    <div class="lg:flex flex-col md:flex-row h-screen">
      <div id="video-container" class="flex-1 bg-black relative">
        <iframe
          id="video-player"
          class="w-full h-[60vh] sm:h-[90vh] lg:h-full sm:w-full lg:w-full"
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
          class="w-full p-2 rounded bg-gray-200 text-black mb-4"
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
      class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30"
    >
      <div class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xl relative">
        <button
          id="close-frame"
          class="absolute top-2 right-2 text-black text-xl"
        >
          ✕
        </button>
        <h1 class="text-3xl font-bold mb-6 text-center">📋 URL List Manager</h1>
        <div id="url-list" class="space-y-3"></div>
        <button
          id="add-url"
          class="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full"
        >
          + Add URL
        </button>
        <div class="mt-6 space-y-2">
          <div class="flex space-x-2">
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
            class="border p-3 rounded-lg w-full mt-2 h-24 resize-none"
          ></textarea>
        </div>
        <div class="mt-6">
          <button
            id="debug-btn"
            class="bg-black text-white px-4 py-2 rounded-lg w-full"
          >
            🛠 Developer Debug Panel
          </button>
        </div>
        <a
          id="full-scale-link"
          class="text-sm text-gray-500 flex justify-center mt-4 hover:text-black"
          >Full scale version</a
        >
        <script>
          const link = document.getElementById("full-scale-link");
          const path = window.location.pathname
            .split("/")
            .slice(0, -1)
            .join("/");
          link.href = `${path}/apis.html`;
        </script>
        <div
          id="debug-panel"
          class="hidden fixed top-10 left-1/2 transform -translate-x-1/2 bg-white border rounded-2xl shadow-2xl p-6 w-96 z-20"
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
    </div>
  </body>
  <script src="src/edit.js"></script>
  <script src="src/player.js"></script>
</html>
