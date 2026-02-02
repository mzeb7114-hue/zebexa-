const SUPABASE_URL = "https://tnglwzaguyhgnwrnisvm.supabase.co";
const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ2x3emFndXloZ253cm5pc3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTUxMTEsImV4cCI6MjA4NDU3MTExMX0.XSku_Zd_H1Xng1owUcIDSPa5APwCk9dQZdoaNdi3pvg";

/* 🔒 REUSE CLIENT */
window.supabaseClient =
  window.supabaseClient ||
  window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const supabase = window.supabaseClient;
const container = document.getElementById("cards");

/* 🧠 AUTH STATE — NO GUESSING */
supabase.auth.onAuthStateChange(async (_event, session) => {
  if (!session) {
    window.location.href = "index.html";
    return;
  }
  renderCards();
});

function card(title, text, action) {
  const el = document.createElement("div");
  el.className = "card";
  el.innerHTML = `
    <div class="title">${title}</div>
    <div class="subtext">${text}</div>
  `;
  el.onclick = action;
  container.appendChild(el);
}

function renderCards() {
  container.innerHTML = "";

  card(
    "Arrive",
    "Nothing is required of you here.",
    () => alert("You’re here. That’s enough for now.")
  );

  card(
    "Proceed",
    "Continue forward only as it feels appropriate, without haste or obligation.",
    () => alert("Workspace comes next.")
  );

  card(
    "Reflect",
    "Observe what has taken shape so far, with calm attention and no demand for judgment.",
    () => alert("Reflection space comes next.")
  );
    }
