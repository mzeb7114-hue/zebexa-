const SUPABASE_URL = "https://tnglwzaguyhgnwrnisvm.supabase.co";
const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ2x3emFndXloZ253cm5pc3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTUxMTEsImV4cCI6MjA4NDU3MTExMX0.XSku_Zd_H1Xng1owUcIDSPa5APwCk9dQZdoaNdi3pvg";

const supabaseClient =
  window.__supabase ??
  (window.__supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  ));

const form = document.getElementById("authForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");
const toggleBtn = document.getElementById("toggleBtn");
const submitBtn = document.getElementById("submitBtn");

let isLogin = true;

toggleBtn.addEventListener("click", () => {
  isLogin = !isLogin;
  submitBtn.textContent = isLogin
    ? "It is a pleasure to receive you"
    : "Enter when it feels true";
  message.textContent = "";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  message.textContent = "We are preparing your place";

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  const { error } = isLogin
    ? await supabaseClient.auth.signInWithPassword({ email, password })
    : await supabaseClient.auth.signUp({ email, password });

  if (error) {
    message.textContent = "The doors did not recognize this invitation.";
  } else {
    message.textContent = "We have been expecting you";
  }
});
