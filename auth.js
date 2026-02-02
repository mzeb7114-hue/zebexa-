// ===============================
// SUPABASE CONFIG (LOCKED)
// ===============================
const SUPABASE_URL = "https://tnglwzaguyhgnwrnisvm.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ2x3emFndXloZ253cm5pc3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTUxMTEsImV4cCI6MjA4NDU3MTExMX0.XSku_Zd_H1Xng1owUcIDSPa5APwCk9dQZdoaNdi3pvg";

// Prevent double initialization (VERY IMPORTANT)
const supabase =
  window.__supabase ??
  (window.__supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  ));

// ===============================
// DOM ELEMENTS
// ===============================
const form = document.getElementById("authForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");
const toggleBtn = document.getElementById("toggleBtn");
const submitBtn = document.getElementById("submitBtn");

// ===============================
// STATE
// ===============================
let isLogin = true;

// ===============================
// TOGGLE LOGIN / SIGNUP
// ===============================
toggleBtn.addEventListener("click", () => {
  isLogin = !isLogin;
  submitBtn.textContent = isLogin
    ? "It is a pleasure to receive you"
    : "Enter when it feels true";
  message.textContent = "";
});

// ===============================
// AUTH SUBMIT
// ===============================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  message.textContent = "We are preparing your place";

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  let result;

  if (isLogin) {
    result = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  } else {
    result = await supabase.auth.signUp({
      email,
      password,
    });
  }

  if (result.error) {
    message.textContent = "The doors did not recognize this invitation.";
    return;
  }

  // ===============================
  // SUCCESS → REDIRECT
  // ===============================
  message.textContent = "We have been expecting you";

  setTimeout(() => {
    window.location.href = "orientation.html";
  }, 900);
});

// ===============================
// AUTO REDIRECT IF ALREADY LOGGED IN
// ===============================
(async () => {
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    window.location.href = "orientation.html";
  }
})();
