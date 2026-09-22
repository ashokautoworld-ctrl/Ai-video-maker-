const textMode = document.getElementById("textMode");
const lyricsMode = document.getElementById("lyricsMode");
const inputLabel = document.getElementById("inputLabel");
const prompt = document.getElementById("prompt");
const generateBtn = document.getElementById("generateBtn");
const status = document.getElementById("status");
const projectList = document.getElementById("projectList");

let currentMode = "text";

textMode.addEventListener("click", () => {
  currentMode = "text";

  textMode.classList.add("active");
  lyricsMode.classList.remove("active");

  inputLabel.textContent = "Enter your video idea";

  prompt.placeholder =
    "Example: A girl walking alone in the rain, cinematic night scene...";
});

lyricsMode.addEventListener("click", () => {
  currentMode = "lyrics";

  lyricsMode.classList.add("active");
  textMode.classList.remove("active");

  inputLabel.textContent = "Paste your lyrics";

  prompt.placeholder =
    "Paste your full song lyrics here...";
});

generateBtn.addEventListener("click", async () => {

  const input = prompt.value.trim();
  const style = document.getElementById("style").value;
  const ratio = document.getElementById("ratio").value;
  const duration = document.getElementById("duration").value;

  if (!input) {
    status.textContent = "⚠️ Please enter text or lyrics.";
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = "⏳ Preparing...";
  status.textContent = "AI is preparing your video project...";

  const project = {
    id: Date.now(),
    mode: currentMode,
    input: input,
    style: style,
    ratio: ratio,
    duration: duration,
    date: new Date().toLocaleString()
  };

  saveProject(project);

  /*
    Actual AI video generation will be connected here later.
    For now, this creates and saves the project.
  */

  setTimeout(() => {
    status.textContent =
      "✅ Project created. AI video generation will be connected next.";

    generateBtn.disabled = false;
    generateBtn.textContent = "✨ Generate Video";

    prompt.value = "";

    showProjects();
  }, 1000);
});


function saveProject(project) {

  let projects =
    JSON.parse(localStorage.getItem("aiVideoProjects")) || [];

  projects.unshift(project);

  localStorage.setItem(
    "aiVideoProjects",
    JSON.stringify(projects)
  );
}


function showProjects() {

  let projects =
    JSON.parse(localStorage.getItem("aiVideoProjects")) || [];

  if (projects.length === 0) {
    projectList.innerHTML =
      '<p class="empty">No projects yet.</p>';
    return;
  }

  projectList.innerHTML = "";

  projects.forEach(project => {

    const item = document.createElement("div");

    item.style.background = "#101017";
    item.style.padding = "14px";
    item.style.borderRadius = "10px";
    item.style.marginBottom = "10px";

    item.innerHTML = `
      <strong>
        ${project.mode === "lyrics" ? "🎵 Lyrics" : "📝 Text"}
      </strong>

      <p style="margin-top:8px;color:#aaa;">
        ${escapeHTML(project.input.substring(0, 100))}
        ${project.input.length > 100 ? "..." : ""}
      </p>

      <small style="color:#666;">
        ${project.style} • ${project.ratio} • ${project.duration}s
      </small>
    `;

    projectList.appendChild(item);
  });
}


function escapeHTML(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}


showProjects();
