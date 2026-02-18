// orientation.js - COMPLETE FIXED VERSION
const SUPABASE_URL = "https://tnglwzaguyhgnwrnisvm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ2x3emFndXloZ253cm5pc3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTUxMTEsImV4cCI6MjA4NDU3MTExMX0.XSku_Zd_H1Xng1owUcIDSPa5APwCk9dQZdoaNdi3pvg";

const supabaseClient =
  window.__supabase ??
  (window.__supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  ));

// Check session on load
checkSession();

async function checkSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    // Only redirect if we're definitely not logged in and not in the middle of auth
    const currentPath = window.location.pathname;
    if (!currentPath.includes('index.html') && !currentPath.includes('auth-callback')) {
      window.location.href = "index.html";
    }
  } else {
    console.log("User is authenticated:", session.user.email);
  }
}

// Presence → NAVIGATE
document.getElementById("presence-card").addEventListener("click", () => {
  window.location.href = "presence-live.html";
});

// Other cards → placeholder UI with immediate feedback
document.getElementById("learning-card").addEventListener("click", () => {
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
  const brand = document.querySelector(".brand");
  brand.innerHTML = `
    <h1 class="exa">EXA</h1>
    <p class="tagline">
      Moments selected<br />
      <span>Dashboard coming soon</span>
    </p>
  `;
});

// Handle auth state changes
supabaseClient.auth.onAuthStateChange((event, session) => {
  console.log("Auth event:", event);
  
  if (event === 'SIGNED_IN') {
    console.log("User signed in:", session?.user?.email);
    // If we're on the index page, redirect to orientation
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
      window.location.href = "orientation.html";
    }
  }
  
  if (event === 'SIGNED_OUT') {
    console.log("User signed out");
    if (!window.location.pathname.includes('index.html')) {
      window.location.href = "index.html";
    }
  }
});

// Add a small delay to ensure session is checked before any redirects
window.addEventListener('load', () => {
  setTimeout(() => {
    checkSession();
  }, 100);
});
