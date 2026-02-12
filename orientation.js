// orientation.js - COMPLETE FIXED VERSION
const SUPABASE_URL = "https://tnglwzaguyhgnwrnisvm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ2x3emFndXloZ253cm5pc3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTUxMTEsImV4cCI6MjA4NDU3MTExMX0.XSku_Zd_H1Xng1owUcIDSPa5APwCk9dQZdoaNdi3pvg";

const supabaseClient =
  window.__supabase ??
  (window.__supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  ));

// FIXED: Immediate session check with no delay
checkSession();

async function checkSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = "index.html";
  }
}

// Presence → NAVIGATE
document.getElementById("presence-card").addEventListener("click", () => {
  window.location.href = "presence-live.html";
});

// Other cards → placeholder UI with immediate feedback
document.getElementById("learning-card").addEventListener("click", () => {
  // FIXED: Immediate visual feedback
  const brand = document.querySelector(".brand");
  brand.innerHTML = `
    <h1 class="exa">EXA</h1>
    <p class="tagline">
      Learning selected<br />
      <span>Dashboard coming soon</span>
    </p>
  `;
});

document.getElementById("moments-card").addEventListener("click", () => {
  // FIXED: Immediate visual feedback
  const brand = document.querySelector(".brand");
  brand.innerHTML = `
    <h1 class="exa">EXA</h1>
    <p class="tagline">
      Moments selected<br />
      <span>Dashboard coming soon</span>
    </p>
  `;
});

// FIXED: Added auth state change listener to handle new sign ups
supabaseClient.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && window.location.pathname.includes('orientation.html')) {
    console.log("User signed in, staying on orientation");
  }
});
