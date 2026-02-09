// auth.js - UPDATED VERSION
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

let isLogin = true;

// Check existing session on page load
checkSession();

async function checkSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  
  if (session) {
    // User is already logged in, go to orientation page
    window.location.href = "orientation.html";
    return true;
  }
  return false;
}

// Initial text
submitBtn.textContent = "It is pleasure to receive you";
toggleBtn.textContent = "Enter when it feels true";

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
    : "Return when it feels worthy of you";

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

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
      }, 800);
    } else {
      message.textContent = "Your arrival is honored";
    }
  }
});
