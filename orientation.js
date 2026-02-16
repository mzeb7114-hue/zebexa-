// ===============================
// EXA ORIENTATION - FINAL VERSION
// Powered by zebexa
// Muhammad Zeb project
// ===============================

const SUPABASE_URL = "https://tnglwzaguyhgnwrnisvm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI6ImFub24iLCJpYXQiOjE3Njg5OTUxMTEsImV4cCI6MjA4NDU3MTExMX0.XSku_Zd_H1Xng1owUcIDSPa5APwCk9dQZdoaNdi3pvg".replace("Ijo6","Ijo");

const supabase = window.__supabase ?? (
  window.__supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  )
);

init();

async function init() {

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = "index.html";
    return;
  }

  const user = session.user;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error || !profile) {
    alert("Profile missing in EXA");
    window.location.href = "index.html";
    return;
  }

  console.log("Welcome to EXA zebexa:", profile);
}

// Presence
document.getElementById("presence-card").onclick = () => {
  alert("Presence module coming next in EXA");
};

// Learning
document.getElementById("learning-card").onclick = () => {
  alert("Learning module coming next in EXA");
};

// Moments
document.getElementById("moments-card").onclick = () => {
  alert("Moments module coming next in EXA");
};
