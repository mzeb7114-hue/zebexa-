const SUPABASE_URL = "https://tnglwzaguyhgnwrnisvm.supabase.co";
const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ2x3emFndXloZ253cm5pc3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTUxMTEsImV4cCI6MjA4NDU3MTExMX0.XSku_Zd_H1Xng1owUcIDSPa5APwCk9dQZdoaNdi3pvg";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const container = document.getElementById("cards");

(async () => {
  const { data, error } = await supabase.auth.getSession();

  if (!data?.session) {
    window.location.replace("index.html");
    return;
  }

  renderCards();
})();

function renderCards() {
  container.innerHTML = "";

  addCard(
    "Arrive",
    "You are already permitted to be here."
  );

  addCard(
    "Proceed",
    "Move forward without urgency or demand."
  );

  addCard(
    "Reflect",
    "Clarity comes when nothing is forced."
  );
}

function addCard(title, text) {
  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `
    <div class="title">${title}</div>
    <div class="subtext">${text}</div>
  `;
  container.appendChild(div);
}
