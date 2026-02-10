document.getElementById("continue").addEventListener("click", async () => {
  const name = document.getElementById("name").value.trim();
  const messageEl = document.getElementById("message");

  if (!name) {
    messageEl.textContent = "Display name is required.";
    return;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    messageEl.textContent = "Not authenticated.";
    return;
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: name,
      onboarded: true
    })
    .eq("id", user.id);

  if (error) {
    messageEl.textContent = "Failed to save profile.";
    console.error(error);
    return;
  }

  // 🎉 Profile complete → go to Presence
  window.location.href = "/presence-live.html";
});
