// profile.js — the truth of who you are
const SUPABASE_URL = "https://tnglwzaguyhgnwrnisvm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ2x3emFndXloZ253cm5pc3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTUxMTEsImV4cCI6MjA4NDU3MTExMX0.XSku_Zd_H1Xng1owUcIDSPa5APwCk9dQZdoaNdi3pvg";

const supabaseClient = window.__supabase ?? (window.__supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
));

let currentUser = null;
let currentProfile = null;

checkAuth();

async function checkAuth() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = "index.html";
    return;
  }
  
  currentUser = session.user;
  document.getElementById('profile-email').textContent = session.user.email;
  
  await loadProfile();
}

async function loadProfile() {
  const { data: profile, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', currentUser.id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = not found
    console.error('error reading profile:', error);
  }

  currentProfile = profile;
  
  if (profile) {
    // profile exists — show view mode
    document.getElementById('display-name').textContent = profile.full_name || '——';
    document.getElementById('display-type').textContent = profile.user_type || '——';
    document.getElementById('display-bio').textContent = profile.bio || '——';
    
    document.getElementById('profile-view').style.display = 'block';
    document.getElementById('profile-edit').style.display = 'none';
  } else {
    // no profile yet — show edit mode
    document.getElementById('profile-view').style.display = 'none';
    document.getElementById('profile-edit').style.display = 'block';
  }
}

// edit button
document.getElementById('edit-profile-btn')?.addEventListener('click', () => {
  document.getElementById('fullName').value = currentProfile?.full_name || '';
  document.getElementById('userType').value = currentProfile?.user_type || '';
  document.getElementById('bio').value = currentProfile?.bio || '';
  
  document.getElementById('profile-view').style.display = 'none';
  document.getElementById('profile-edit').style.display = 'block';
});

// cancel edit
document.getElementById('cancel-edit-btn')?.addEventListener('click', () => {
  if (currentProfile) {
    document.getElementById('profile-view').style.display = 'block';
    document.getElementById('profile-edit').style.display = 'none';
  } else {
    // if no profile and they cancel... maybe sign out?
    if (confirm('you arrived without a name — leave?')) {
      supabaseClient.auth.signOut();
      window.location.href = 'index.html';
    }
  }
});

// save profile
document.getElementById('profile-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const fullName = document.getElementById('fullName').value.trim();
  const userType = document.getElementById('userType').value;
  const bio = document.getElementById('bio').value.trim();
  
  if (!fullName || !userType) {
    alert('a name and presence are needed to continue');
    return;
  }
  
  const profileData = {
    id: currentUser.id,
    full_name: fullName,
    user_type: userType,
    bio: bio,
    email: currentUser.email,
    updated_at: new Date().toISOString()
  };
  
  const { error } = await supabaseClient
    .from('profiles')
    .upsert(profileData);
  
  if (error) {
    console.error('error saving profile:', error);
    alert('something interrupted the truth of this');
  } else {
    await loadProfile(); // reload to show view mode
  }
});

// back to orientation
document.getElementById('back-to-orientation')?.addEventListener('click', () => {
  window.location.href = 'orientation.html';
});
