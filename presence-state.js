// presence-state.js
// Reads the current presence state for the authenticated user

async function loadPresenceState() {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("No authenticated user");
    return;
  }

  const { data, error } = await supabase
    .from("orientation_state")
    .select("view, updated_at")
    .eq("id", user.id)
    .single();

  if (error) {
    console.log("No presence state yet");
    return;
  }

  const statusEl = document.getElementById("status");
  const outputEl = document.getElementById("output");

  if (statusEl) {
    statusEl.textContent = `Presence: ${data.view}`;
  }

  if (outputEl) {
    outputEl.textContent = `Last updated: ${new Date(data.updated_at).toLocaleString()}`;
  }
}

loadPresenceState();
