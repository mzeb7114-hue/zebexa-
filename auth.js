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
    // User is already logged in, show orientation page
    showOrientationPage();
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
        showOrientationPage();
      }, 800);
    } else {
      message.textContent = "Your arrival is honored";
    }
  }
});

function showOrientationPage() {
  // Hide the login container
  const app = document.getElementById("app");
  if (app) {
    app.classList.add("hidden");
  }
  
  // Create and show orientation page
  const orientationHTML = `
    <div class="container fade-in" id="orientation">
      <section class="brand">
        <h1 class="exa">EXA</h1>
        <p class="tagline">
          Choose your way of seeing<br />
          <span>What calls to you now?</span>
        </p>
      </section>

      <section class="cards-grid">
        <div class="orientation-card" id="presence-card">
          <div class="card-content">
            <h3 class="card-title">Presence</h3>
            <p class="card-description">
              Identity, belonging, and current state.
            </p>
            <div class="card-tables">
              profiles · students · teachers · schools
            </div>
          </div>
        </div>

        <div class="orientation-card" id="learning-card">
          <div class="card-content">
            <h3 class="card-title">Learning</h3>
            <p class="card-description">
              Structured education and growth.
            </p>
            <div class="card-tables">
              courses · subjects · syllabus · classes
            </div>
          </div>
        </div>

        <div class="orientation-card" id="moments-card">
          <div class="card-content">
            <h3 class="card-title">Moments</h3>
            <p class="card-description">
              Time-based life inside the system.
            </p>
            <div class="card-tables">
              attendance · exams · events · messages
            </div>
          </div>
        </div>
      </section>

      <footer class="footer">
        <p class="powered">
          powered by <span class="zebexa">zebexa</span>
        </p>
      </footer>
    </div>
  `;
  
  // Add orientation page to body
  const orientationContainer = document.createElement('div');
  orientationContainer.innerHTML = orientationHTML;
  document.body.appendChild(orientationContainer.firstElementChild);
  
  // Add click handlers for cards
  setTimeout(() => {
    document.getElementById('presence-card').addEventListener('click', () => {
      navigateToDashboard('presence');
    });
    
    document.getElementById('learning-card').addEventListener('click', () => {
      navigateToDashboard('learning');
    });
    
    document.getElementById('moments-card').addEventListener('click', () => {
      navigateToDashboard('moments');
    });
  }, 100);
}

function navigateToDashboard(view) {
  // For now, just show a message - you'll implement actual navigation later
  const orientation = document.getElementById('orientation');
  const brandSection = orientation.querySelector('.brand');
  
  brandSection.innerHTML = `
    <h1 class="exa">EXA</h1>
    <p class="tagline">
      ${view.charAt(0).toUpperCase() + view.slice(1)} selected<br />
      <span>Dashboard coming soon</span>
    </p>
  `;
  
  // You can add actual routing here later
  console.log(`Navigating to ${view} dashboard`);
    }
