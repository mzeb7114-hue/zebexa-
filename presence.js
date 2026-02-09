document.addEventListener("DOMContentLoaded", async () => {
  const statusEl = document.getElementById("status");
  const outputEl = document.getElementById("output");

  statusEl.textContent = "Checking presence…";

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    statusEl.textContent = "Not signed in";
    outputEl.textContent = "You are currently not authenticated.";
    return;
  }

  statusEl.textContent = "Signed in";
  outputEl.textContent = `User ID: ${user.id}`;
});
