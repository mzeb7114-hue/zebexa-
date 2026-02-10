document.addEventListener("DOMContentLoaded", async () => {
  const statusEl = document.getElementById("status");
  const outputEl = document.getElementById("output");

  statusEl.textContent = "Checking presence…";

  // 1️⃣ Get authenticated user
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    statusEl.textContent = "Not signed in";
    outputEl.textContent = "Please sign in to continue.";
    return;
  }

  // 2️⃣ Check profile onboarding state
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("onboarded")
    .eq("id", user.id)
    .single();

  // 3️⃣ If profile missing or not onboarded → redirect
  if (profileError || !profile || profile.onboarded !== true) {
    window.location.href = "create-profile.html";
    return;
  }

  // 4️⃣ Profile complete → Presence active
  statusEl.textContent = "Presence active";
  outputEl.textContent = "Welcome to Presence.";

});
