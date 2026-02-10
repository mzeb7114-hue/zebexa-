document.addEventListener("DOMContentLoaded", async () => {
  const statusEl = document.getElementById("status");
  const outputEl = document.getElementById("output");

  statusEl.textContent = "Checking presence…";

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    statusEl.textContent = "Not signed in";
    outputEl.textContent = "You are currently not authenticated.";
    return;
  }

  // 🔑 NEW: check profile onboarding state
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("onboarded")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.onboarded === false) {
    // 🚪 Redirect to profile creation
    window.location.href = "/create-profile.html";
    return;
  }

  // ✅ Profile is complete → continue presence
  statusEl.textContent = "Presence active";
  outputEl.textContent = "Welcome to Presence.";

});
