// presence.js - Complete profile display with all fields
const SUPABASE_URL = "https://tnglwzaguyhgnwrnisvm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ2x3emFndXloZ253cm5pc3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTUxMTEsImV4cCI6MjA4NDU3MTExMX0.XSku_Zd_H1Xng1owUcIDSPa5APwCk9dQZdoaNdi3pvg";

const supabaseClient = window.__supabase ?? (window.__supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
));

let currentUser = null;
let profileData = null;

// DOM Elements
const loadingEl = document.getElementById('profile-loading');
const contentEl = document.getElementById('profile-content');
const errorEl = document.getElementById('profile-error');

// Display elements
const avatarPlaceholder = document.getElementById('avatar-placeholder');
const avatarImage = document.getElementById('avatar-image');
const displayName = document.getElementById('display-name');
const displayRole = document.getElementById('display-role');
const displayEmail = document.getElementById('display-email');
const displayAge = document.getElementById('display-age');
const displayGender = document.getElementById('display-gender');
const displayPhone = document.getElementById('display-phone');
const displayCity = document.getElementById('display-city');
const displayCountry = document.getElementById('display-country');
const displayAddress = document.getElementById('display-address');
const displayNote = document.getElementById('display-note');
const displayBio = document.getElementById('display-bio');
const memberSince = document.getElementById('member-since');
const roleInfoContainer = document.getElementById('role-info');

// Check authentication and load profile
document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await supabaseClient.auth.getSession();
  
  if (!session) {
    window.location.href = 'index.html';
    return;
  }
  
  currentUser = session.user;
  await loadProfile();
});

async function loadProfile() {
  try {
    const { data: profile, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', currentUser.id)
      .single();
    
    if (error || !profile) {
      // No profile exists
      loadingEl.style.display = 'none';
      errorEl.style.display = 'block';
      return;
    }
    
    profileData = profile;
    displayProfile(profile);
    
  } catch (error) {
    console.error('Error loading profile:', error);
    loadingEl.style.display = 'none';
    errorEl.style.display = 'block';
  }
}

function displayProfile(profile) {
  // Hide loading, show content
  loadingEl.style.display = 'none';
  contentEl.style.display = 'block';
  
  // Display avatar
  if (profile.avatar_url) {
    const { data } = supabaseClient.storage
      .from('avatars')
      .getPublicUrl(profile.avatar_url);
    
    if (data?.publicUrl) {
      avatarImage.src = data.publicUrl;
      avatarImage.style.display = 'block';
      avatarPlaceholder.style.display = 'none';
    }
  }
  
  // Basic info
  displayName.textContent = profile.full_name || 'honored guest';
  displayEmail.textContent = profile.email || currentUser.email;
  
  // Format role display
  let roleText = profile.role || 'seeker';
  if (profile.role === 'other' && profile.custom_role) {
    roleText = profile.custom_role;
  }
  displayRole.textContent = roleText;
  
  // Age
  displayAge.textContent = profile.age || '—';
  
  // Gender - format nicely
  let genderText = profile.gender || '—';
  if (genderText === 'prefer-not-to-say') genderText = 'prefer not to say';
  displayGender.textContent = genderText;
  
  displayPhone.textContent = profile.phone || '—';
  displayCity.textContent = profile.city || '—';
  displayCountry.textContent = profile.country || '—';
  displayAddress.textContent = profile.address || '—';
  displayNote.textContent = profile.personal_note || '—';
  displayBio.textContent = profile.bio || '—';
  
  // Member since
  if (profile.created_at) {
    const date = new Date(profile.created_at);
    memberSince.textContent = `present since ${date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
  }
  
  // Role-specific information
  displayRoleInfo(profile);
}

function displayRoleInfo(profile) {
  let html = '';
  
  if (profile.role === 'student') {
    html = `
      <div class="detail-item">
        <div class="detail-label">institution</div>
        <div class="detail-value ${!profile.school ? 'empty' : ''}">${profile.school || '—'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">year/grade</div>
        <div class="detail-value ${!profile.grade ? 'empty' : ''}">${profile.grade || '—'}</div>
      </div>
    `;
  } else if (profile.role === 'teacher') {
    html = `
      <div class="detail-item">
        <div class="detail-label">subjects</div>
        <div class="detail-value ${!profile.subjects ? 'empty' : ''}">${profile.subjects || '—'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">institution</div>
        <div class="detail-value ${!profile.institution ? 'empty' : ''}">${profile.institution || '—'}</div>
      </div>
    `;
  } else if (profile.role === 'guardian') {
    html = `
      <div class="detail-item">
        <div class="detail-label">students in care</div>
        <div class="detail-value ${!profile.students ? 'empty' : ''}">${profile.students || '—'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">contact preference</div>
        <div class="detail-value ${!profile.contact_preference ? 'empty' : ''}">${profile.contact_preference || '—'}</div>
      </div>
    `;
  } else if (profile.role === 'other') {
    html = `
      <div class="detail-item">
        <div class="detail-label">your path</div>
        <div class="detail-value">${profile.custom_role || 'seeker'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">purpose</div>
        <div class="detail-value ${!profile.purpose ? 'empty' : ''}">${profile.purpose || '—'}</div>
      </div>
      <div class="detail-item full-width-detail">
        <div class="detail-label">contribution</div>
        <div class="detail-value ${!profile.contribution ? 'empty' : ''}">${profile.contribution || '—'}</div>
      </div>
    `;
  }
  
  // If no role-specific fields, show a message
  if (!html) {
    html = `
      <div class="detail-item full-width-detail">
        <div class="detail-label">note</div>
        <div class="detail-value empty">your path is yet to be written</div>
      </div>
    `;
  }
  
  roleInfoContainer.innerHTML = html;
}

// Navigation
document.getElementById('back-to-orientation')?.addEventListener('click', () => {
  window.location.href = 'orientation.html';
});

document.getElementById('back-from-error')?.addEventListener('click', () => {
  window.location.href = 'orientation.html';
});

// Auth state changes
supabaseClient.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    window.location.href = 'index.html';
  }
});
