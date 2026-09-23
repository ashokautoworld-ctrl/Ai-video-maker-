const topic = document.getElementById("topic");
const mood = document.getElementById("mood");
const singer = document.getElementById("singer");
const language = document.getElementById("language");
const length = document.getElementById("length");

const generateBtn = document.getElementById("generateBtn");
const lyrics = document.getElementById("lyrics");
const status = document.getElementById("status");

const copyBtn = document.getElementById("copyBtn");
const saveBtn = document.getElementById("saveBtn");
const regenerateBtn = document.getElementById("regenerateBtn");const newSongBtn = document.getElementById("newSongBtn");
const clearBtn = document.getElementById("clearBtn");
const projectList = document.getElementById("projectList");

async function generateLyrics() {
  const songTopic = topic.value.trim();

  if (!songTopic) {
    status.textContent = "⚠️ Please enter your song topic.";
    return;
  }

  generateBtn.disabled = true;
  regenerateBtn.disabled = true;

  generateBtn.textContent = "⏳ Creating lyrics...";
  regenerateBtn.textContent = "⏳ Creating...";
  status.textContent = "AI is preparing your song...";

  try {
    const response = await fetch("/api/generate-lyrics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        topic: songTopic,
        mood: mood.value,
        singer: singer.value,
        language: language.value,
        length: length.value
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Lyrics generation failed.");
    }

    lyrics.value = data.lyrics;
    status.textContent = "✅ Lyrics generated successfully!";
  }
  catch (error) {
    console.error(error);
    status.textContent = "❌ " + error.message;
  }
  finally {
    generateBtn.disabled = false;
    regenerateBtn.disabled = false;

    generateBtn.textContent = "✨ Generate Lyrics";
    regenerateBtn.textContent = "🔄 Regenerate Lyrics";
  }
}

generateBtn.addEventListener("click", generateLyrics);

regenerateBtn.addEventListener("click", generateLyrics);


copyBtn.addEventListener("click", async () => {
  const text = lyrics.value.trim();

  if (!text) {
    status.textContent = "⚠️ No lyrics to copy.";
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    status.textContent = "✅ Lyrics copied!";
  }
  catch {
    lyrics.select();
    document.execCommand("copy");
    status.textContent = "✅ Lyrics copied!";
  }
});


saveBtn.addEventListener("click", () => {
  const text = lyrics.value.trim();

  if (!text) {
    status.textContent = "⚠️ No lyrics to save.";
    return;
  }

  const project = {
    id: Date.now(),
    topic: topic.value.trim(),
    mood: mood.value,
    singer: singer.value,
    language: language.value,
    length: length.value,
    lyrics: text,
    date: new Date().toLocaleString()
  };

  let projects =
    JSON.parse(localStorage.getItem("aiLyricsProjects")) || [];

  projects.unshift(project);

  localStorage.setItem(
    "aiLyricsProjects",
    JSON.stringify(projects)
  );

  status.textContent = "💾 Lyrics saved!";
  showProjects();
});


clearBtn.addEventListener("click", () => {
  lyrics.value = "";
  status.textContent = "🗑️ Lyrics cleared.";
});


function showProjects() {
  const projects =
    JSON.parse(localStorage.getItem("aiLyricsProjects")) || [];

  if (projects.length === 0) {
    projectList.innerHTML =
      '<p class="empty">No lyrics saved yet.</p>';
    return;
  }

  projectList.innerHTML = "";

  projects.forEach(project => {

    const item = document.createElement("div");
    item.className = "project-item";

    item.innerHTML = `
      <strong>🎵 ${escapeHTML(project.topic)}</strong>

      <p>${escapeHTML(project.lyrics)}</p>

      <small style="color:#666;">
        ${escapeHTML(project.mood)}
        •
        ${escapeHTML(project.singer)}
        •
        ${escapeHTML(project.language)}
        •
        ${escapeHTML(project.date)}
      </small>

      <div class="project-actions">

        <button
          class="open-project"
          onclick="openProject(${project.id})">
          📂 Open / Edit
        </button>

        <button
          class="delete-project"
          onclick="deleteProject(${project.id})">
          🗑️ Delete
        </button>

      </div>
    `;

    projectList.appendChild(item);
  });
}


function openProject(id) {

  const projects =
    JSON.parse(localStorage.getItem("aiLyricsProjects")) || [];

  const project = projects.find(p => p.id === id);

  if (!project) return;

  topic.value = project.topic;
  mood.value = project.mood;
  singer.value = project.singer;
  language.value = project.language;
  length.value = project.length;
  lyrics.value = project.lyrics;

  status.textContent = "📂 Lyrics opened for editing.";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


function deleteProject(id) {

  const confirmDelete =
    confirm("Delete this saved lyrics?");

  if (!confirmDelete) return;

  let projects =
    JSON.parse(localStorage.getItem("aiLyricsProjects")) || [];

  projects = projects.filter(
    project => project.id !== id
  );

  localStorage.setItem(
    "aiLyricsProjects",
    JSON.stringify(projects)
  );

  status.textContent = "🗑️ Lyrics deleted.";

  showProjects();
}


function escapeHTML(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}


showProjects();
