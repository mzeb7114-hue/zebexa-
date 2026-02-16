// auth.js - COMPLETE FIXED VERSION
const SUPABASE_URL = "https://tnglwzaguyhgnwrnisvm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ2x3emFndXloZ253cm5pc3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTUxMTEsImV4cCI6MjA4NDU3MTExMX0.XSku_Zd_H1Xng1owUcIDSPa5APwCk9dQZdoaNdi3pvg";

const supabaseClient = window.__supabase ?? (window.__supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
));

const form = document.getElementById("authForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");
const toggleBtn = document.getElementById("toggleBtn");
const submitBtn = document.getElementById("submitBtn");

let isLogin = false;

submitBtn.textContent = "Enter when it feels true";
toggleBtn.textContent = "It is pleasure to receive you";

toggleBtn.addEventListener("click", () => {
  isLogin = !isLogin;

  submitBtn.textContent = isLogin
    ? "It is pleasure to receive you"
    : "Enter when it feels true";

  toggleBtn.textContent = isLogin
    ? "Enter when it feels true"
    : "Return when it feels worthy of you";

  message.textContent = "";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  message.textContent = isLogin
    ? "We are preparing your place"
    : "Your arrival is being honored";

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  try {
    const { data, error } = isLogin
      ? await supabaseClient.auth.signInWithPassword({ email, password })
      : await supabaseClient.auth.signUp({ email, password });

    if (error) {
      message.textContent = error.message;
    } else {
      if (isLogin) {
        message.textContent = "We have been expecting you";
        setTimeout(() => {
          window.location.href = "orientation.html";
        }, 200);
      } else {
        message.textContent = "Your arrival is honored";
        setTimeout(() => {
          window.location.href = "orientation.html";
        }, 300);
      }
    }
  } catch (error) {
    message.textContent = "An unexpected error occurred";
    console.error("Auth error:", error);
  }
});
