// presence-live.js
// Records that the authenticated user has entered Presence

async function activatePresence() {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("No authenticated user found");
    return;
  }

  const { error } = await supabase
    .from("orientation_state")
    .upsert({
      id: user.id,
      view: "presence",
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error("Failed to update presence state:", error);
  } else {
    console.log("Presence activated for user:", user.id);
  }
}

// Run immediately when this file loads
activatePresence();
