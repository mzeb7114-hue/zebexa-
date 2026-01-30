// ================= SUPABASE CONFIG =================
const SUPABASE_URL = "https://tnglwzaguyhgnwrnisvm.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ2x3emFndXloZ253cm5pc3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTUxMTEsImV4cCI6MjA4NDU3MTExMX0.XSku_Zd_H1Xng1owUcIDSPa5APwCk9dQZdoaNdi3pvg";

// SAFE SINGLE CLIENT
const supabaseClient =
  window.__supabase ??
  (window.__supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  ));

// ================= ELEMENTS =================
const form = document.getElementById("authForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");
const toggleBtn = document.getElementById("toggleBtn");
const submitBtn = document.getElementById("submitBtn");
const switchText = document.getElementById("switchText");

// ================= STATE =================
let isLogin = true;

// ================= TOGGLE =================
toggleBtn.addEventListener("click", () => {
  isLogin = !isLogin;

  submitBtn.textContent = isLogin ? "Login" : "Create Account";
  switchText.textContent = isLogin
    ? "Don’t have an account?"
    : "Already have an account?";
  toggleBtn.textContent = isLogin ? "Create one" : "Login";

  message.textContent = "";
});

// ================= AUTH =================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  message.textContent = "Please wait…";
  message.style.color = "#9aa0a6";

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  const { error } = isLogin
    ? await supabaseClient.auth.signInWithPassword({ email, password })
    : await supabaseClient.auth.signUp({ email, password });

  if (error) {
    message.textContent = error.message;
    message.style.color = "#ff6b6b";
  } else {
    message.textContent = isLogin
      ? "Welcome back."
      : "Account created. Check your email.";
    message.style.color = "#4caf50";
  }
});
