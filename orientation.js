const SUPABASE_URL = "https://tnglwzaguyhgnwrnisvm.supabase.co";
const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ2x3emFndXloZ253cm5pc3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTUxMTEsImV4cCI6MjA4NDU3MTExMX0.XSku_Zd_H1Xng1owUcIDSPa5APwCk9dQZdoaNdi3pvg";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const container = document.getElementById("cards");

async function init() {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const { data: state } = await supabase
    .from("orientation_state")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!state) {
    await supabase.from("orientation_state").insert({
      user_id: user.id,
      has_arrived: false
    });
    renderArrive();
    return;
  }

  state.has_arrived ? renderNext() : renderArrive();
}

function card(title, text, action) {
  const el = document.createElement("div");
  el.className = "card";
  el.innerHTML = `<div class="title">${title}</div><div class="subtext">${text}</div>`;
  el.onclick = action;
  container.appendChild(el);
}

function renderArrive() {
  container.innerHTML = "";
  card("Arrive", "Nothing is required of you here.", async () => {
    const { data } = await supabase.auth.getUser();
    await supabase
      .from("orientation_state")
      .update({ has_arrived: true })
      .eq("user_id", data.user.id);

    alert("You’re here. That’s enough for now.");
    location.reload();
  });
}

function renderNext() {
  container.innerHTML = "";

  card("Proceed",
    "Continue forward only as it feels appropriate, without haste or obligation.",
    () => window.location.href = "workspace.html"
  );

  card("Reflect",
    "Observe what has taken shape so far, with calm attention and no demand for judgment.",
    () => window.location.href = "reflect.html"
  );
}

init();
