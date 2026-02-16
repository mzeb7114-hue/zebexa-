// ===============================
// EXA AUTH - FINAL WORKING VERSION
// Powered by zebexa
// Muhammad Zeb project
// ===============================

const SUPABASE_URL = "https://tnglwzaguyhgnwrnisvm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI6ImFub24iLCJpYXQiOjE3Njg5OTUxMTEsImV4cCI6MjA4NDU3MTExMX0.XSku_Zd_H1Xng1owUcIDSPa5APwCk9dQZdoaNdi3pvg".replace("Ijo6","Ijo"); // keep key safe formatting

const supabase = window.__supabase ?? (
  window.__supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  )
);

const form = document.getElementById("authForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");
const toggleBtn = document.getElementById("toggleBtn");
const submitBtn = document.getElementById("submitBtn");

let isLogin = false;

submitBtn.textContent = "Enter when it feels true";
toggleBtn.textContent = "It is pleasure to receive you";

toggleBtn.onclick = () => {
  isLogin = !isLogin;

  submitBtn.textContent = isLogin
    ? "It is pleasure to receive you"
    : "Enter when it feels true";

  toggleBtn.textContent = isLogin
    ? "Enter when it feels true"
    : "Return when it feels worthy of you";

  message.textContent = "";
};

form.onsubmit = async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  message.textContent = isLogin
    ? "We are preparing your place"
    : "Your arrival is being honored";

  try {

    // LOGIN
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        message.textContent = error.message;
        return;
      }

      window.location.href = "orientation.html";
      return;
    }

    // SIGNUP
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      message.textContent = error.message;
      return;
    }

    if (data.user) {
      await supabase.from("profiles").upsert({
        user_id: data.user.id,
        full_name: "",
        role: "student",
        avatar_url: "",
        verified: false,
        display_name: "",
        onboarded: false
      });
    }

    window.location.href = "orientation.html";

  } catch (err) {
    console.log(err);
    message.textContent = "Unexpected error";
  }
};
