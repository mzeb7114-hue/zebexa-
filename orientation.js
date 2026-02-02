const SUPABASE_URL = "https://tnglwzaguyhgnwrnisvm.supabase.co";
const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ2x3emFndXloZ253cm5pc3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTUxMTEsImV4cCI6MjA4NDU3MTExMX0.XSku_Zd_H1Xng1owUcIDSPa5APwCk9dQZdoaNdi3pvg";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const container = document.getElementById("cards");

(async () => {
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    window.location.replace("index.html");
    return;
  }

  renderCards();
})();

function renderCards() {
  container.innerHTML = "";

  container.appendChild(makeCard(
    "Arrive",
    "Nothing is required of you here."
  ));

  container.appendChild(makeCard(
    "Proceed",
    "Move forward only when it feels appropriate."
  ));

  container.appendChild(makeCard(
    "Reflect",
    "Observe quietly, without pressure or expectation."
  ));
}

function makeCard(title, text) {
  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `
    <div class="title">${title}</div>
    <div class="subtext">${text}</div>
  `;
  return div;
    }
