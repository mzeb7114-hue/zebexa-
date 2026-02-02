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

  addCard(
    "Arrive",
    "Nothing is required of you here."
  );

  addCard(
    "Proceed",
    "Continue forward only as it feels appropriate, without haste or obligation."
  );

  addCard(
    "Reflect",
    "Observe what has taken shape so far, with calm attention and no demand for judgment."
  );
}

function addCard(title, text) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="title">${title}</div>
    <div class="subtext">${text}</div>
  `;
  container.appendChild(card);
}
