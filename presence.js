document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return;
    }

    // Check onboarding status
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarded")
      .eq("id", user.id)
      .single();

    // If not onboarded → redirect
    if (!profile || profile.onboarded !== true) {
      window.location.replace("create-profile.html");
      return;
    }

    // Otherwise Presence is allowed (do nothing, page continues)
  } catch (e) {
    console.error("Presence check failed", e);
  }
});
