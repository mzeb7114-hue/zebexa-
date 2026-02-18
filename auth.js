// auth.js — the threshold between outside and presence
const SUPABASE_URL = "https://tnglwzaguyhgnwrnisvm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ2x3emFndXloZ253cm5pc3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTUxMTEsImV4cCI6MjA4NDU3MTExMX0.XSku_Zd_H1Xng1owUcIDSPa5APwCk9dQZdoaNdi3pvg";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM elements
const authForm = document.getElementById('authForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submitBtn');
const messageEl = document.getElementById('message');
const toggleBtn = document.getElementById('toggleBtn');

let isLogin = true;

// Check if user is already logged in
checkSession();

async function checkSession() {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    // User is logged in, check if they have a profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (profile) {
      window.location.href = 'orientation.html';
    } else {
      window.location.href = 'profile.html';
    }
  }
}

// Toggle between login and signup
toggleBtn.addEventListener('click', () => {
  isLogin = !isLogin;
  submitBtn.textContent = isLogin ? 'Login' : 'Sign Up';
  toggleBtn.textContent = isLogin ? 
    'Enter when it feels true' : 
    'Already have presence?';
  messageEl.textContent = '';
});

// Form submission
authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  
  if (!email || !password) {
    messageEl.textContent = 'both email and password are needed';
    return;
  }
  
  submitBtn.disabled = true;
  submitBtn.textContent = isLogin ? 'entering...' : 'becoming...';
  
  if (isLogin) {
    // Login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
    
    if (error) {
      messageEl.textContent = error.message;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Login';
    } else {
      messageEl.textContent = 'welcome back';
      
      // Check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profile) {
        setTimeout(() => {
          window.location.href = 'orientation.html';
        }, 1000);
      } else {
        setTimeout(() => {
          window.location.href = 'profile.html';
        }, 1000);
      }
    }
  } else {
    // Sign up
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    });
    
    if (error) {
      messageEl.textContent = error.message;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign Up';
    } else {
      messageEl.textContent = 'a confirmation email has been sent. check your inbox.';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign Up';
      emailInput.value = '';
      passwordInput.value = '';
    }
  }
});
