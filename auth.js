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

let isLogin = false; // Start with SIGN UP mode

// Initial text - Start with sign up mode
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
    if (isLogin) {
      // LOGIN FLOW
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setTimeout(() => {
            isLogin = false;
            submitBtn.textContent = "Enter when it feels true";
            toggleBtn.textContent = "It is pleasure to receive you";
            message.textContent = "perhaps you need to arrive first";
          }, 2000);
        } else {
          message.textContent = error.message;
        }
      } else {
        message.textContent = "We have been expecting you";
        setTimeout(() => {
          window.location.href = "orientation.html";
        }, 200);
      }
    } else {
      // SIGN UP FLOW
      const { data, error } = await supabaseClient.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: window.location.origin + "/orientation.html"
        }
      });
      
      if (error) {
        if (error.message.includes("User already registered")) {
          const { data: loginData, error: loginError } = await supabaseClient.auth.signInWithPassword({ email, password });
          
          if (loginError) {
            setTimeout(() => {
              isLogin = true;
              submitBtn.textContent = "It is pleasure to receive you";
              toggleBtn.textContent = "Enter when it feels true";
              message.textContent = "you have been here before";
            }, 2000);
          } else {
            setTimeout(() => {
              window.location.href = "orientation.html";
            }, 300);
          }
        } else {
          message.textContent = error.message;
        }
      } else {
        if (data?.user?.identities?.length === 0) {
          setTimeout(() => {
            isLogin = true;
            submitBtn.textContent = "It is pleasure to receive you";
            toggleBtn.textContent = "Enter when it feels true";
          }, 2000);
        } else {
          message.textContent = "Your arrival is honored";
          setTimeout(() => {
            window.location.href = "orientation.html";
          }, 300);
        }
      }
    }
  } catch (error) {
    message.textContent = "An unexpected error occurred";
    console.error("Auth error:", error);
  }
});
