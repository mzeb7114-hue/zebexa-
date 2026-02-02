/* ===============================
   SUPABASE CONFIG
================================ */

const SUPABASE_URL = "https://tnglwzaguyhgnwrnisvm.supabase.co";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ2x3emFndXloZ253cm5pc3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTUxMTEsImV4cCI6MjA4NDU3MTExMX0.XSku_Zd_H1Xng1owUcIDSPa5APwCk9dQZdoaNdi3pvg";

/* ===============================
   CREATE CLIENT (SAFE FOR CODEPEN)
================================ */

let supabaseClient;

if (!window._supabaseClient) {
  window._supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );
}

supabaseClient = window._supabaseClient;

/* ===============================
   DOM READY
================================ */

document.addEventListener("DOMContentLoaded", () => {
  const enterButton = document.querySelector(".enter-btn");
  const emailInput = document.querySelector("#email");
  const passwordInput = document.querySelector("#password");

  if (!enterButton) return;

  enterButton.addEventListener("click", async () => {
    const email = emailInput?.value?.trim();
    const password = passwordInput?.value?.trim();

    if (!email || !password) {
      alert("Nothing required of you here — but email & password are needed.");
      return;
    }

    enterButton.disabled = true;
    enterButton.innerText = "Entering…";

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      enterButton.disabled = false;
      enterButton.innerText = "enter gently";
      return;
    }

    console.log("Signed in:", data.user);

    // TEMP success action (we will replace later)
    alert("Welcome. You are allowed.");
  });
});
