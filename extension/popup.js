const API_URL = "https://focusdock-api.onrender.com/api/tasks";

const titleInput = document.getElementById("title");
const notesInput = document.getElementById("notes");
const saveTaskButton = document.getElementById("save-task");
const saveTabButton = document.getElementById("save-tab");
const messageEl = document.getElementById("message");

const setMessage = (text, tone = "") => {
  messageEl.textContent = text;
  messageEl.className = `message ${tone ? `message--${tone}` : ""}`.trim();
};

const postTask = async (payload) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let message = "Unable to save task.";

    try {
      const data = await response.json();
      message = data.message || message;
    } catch (_error) {
      // Ignore JSON parsing issues and use fallback message.
    }

    throw new Error(message);
  }

  return response.json();
};

const buildBasePayload = () => ({
  status: "todo",
  priority: "medium",
  reminderEnabled: false,
  pinned: false,
  subtasks: []
});

saveTaskButton.addEventListener("click", async () => {
  const title = titleInput.value.trim();
  const notes = notesInput.value.trim();

  if (!title) {
    setMessage("Task title is required.", "error");
    return;
  }

  saveTaskButton.disabled = true;
  setMessage("Saving...");

  try {
    await postTask({
      ...buildBasePayload(),
      title,
      notes,
      description: "",
      tags: ["extension"]
    });

    titleInput.value = "";
    notesInput.value = "";
    setMessage("Task saved to FocusDock.", "success");
  } catch (error) {
    setMessage(error.message || "Unable to save task.", "error");
  } finally {
    saveTaskButton.disabled = false;
  }
});

saveTabButton.addEventListener("click", async () => {
  saveTabButton.disabled = true;
  setMessage("Saving current tab...");

  try {
    const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const activeTab = tabs[0];

    if (!activeTab) {
      throw new Error("No active tab found.");
    }

    await postTask({
      ...buildBasePayload(),
      title: activeTab.title || "Saved browser tab",
      notes: activeTab.url || "",
      description: "",
      tags: ["browser", "extension"]
    });

    setMessage("Current tab saved to FocusDock.", "success");
  } catch (error) {
    setMessage(error.message || "Unable to save current tab.", "error");
  } finally {
    saveTabButton.disabled = false;
  }
});
