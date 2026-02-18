// orientation.js - refined
const SUPABASE_URL = "https://tnglwzaguyhgnwrnisvm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ2x3emFndXloZ253cm5pc3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTUxMTEsImV4cCI6MjA4NDU3MTExMX0.XSku_Zd_H1Xng1owUcIDSPa5APwCk9dQZdoaNdi3pvg";

const supabaseClient =
  window.__supabase ??
  (window.__supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  ));

checkSession();

async function checkSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    const currentPath = window.location.pathname;
    if (!currentPath.includes('index.html') && !currentPath.includes('auth-callback')) {
      window.location.href = "index.html";
    }
  } else {
    console.log("User is authenticated:", session.user.email);
    checkProfile(session.user.id);
  }
}

async function checkProfile(userId) {
  const { data: profile, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error || !profile) {
    const brand = document.querySelector(".brand .tagline span");
    if (brand) {
      brand.innerHTML = 'before you choose, <a href="profile.html" style="color: #7bb0ff; text-decoration: none; border-bottom: 1px dotted;">who you are</a> matters';
    }
  }
}

document.getElementById("presence-card").addEventListener("click", () => {
  window.location.href = "presence.html";
});

document.getElementById("learning-card").addEventListener("click", () => {
  const brand = document.querySelector(".brand");
  brand.innerHTML = `
    <h1 class="exa">EXA</h1>
    <p class="tagline">
      Learning selected<br />
      <span>what wants to be learned finds you</span>
    </p>
  `;
});

document.getElementById("moments-card").addEventListener("click", () => {
  const brand = document.querySelector(".brand");
  brand.innerHTML = `
    <h1 class="exa">EXA</h1>
    <p class="tagline">
      Moments selected<br />
      <span>time reveals itself in its own way</span>
    </p>
  `;
});

supabaseClient.auth.onAuthStateChange((event, session) => {
  console.log("Auth event:", event);
  
  if (event === 'SIGNED_IN') {
    console.log("User signed in:", session?.user?.email);
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

window.addEventListener('load', () => {
  setTimeout(() => {
    checkSession();
  }, 100);
});
