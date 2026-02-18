// profile.js — the truth of who you are, refined
const SUPABASE_URL = "https://tnglwzaguyhgnwrnisvm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ2x3emFndXloZ253cm5pc3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTUxMTEsImV4cCI6MjA4NDU3MTExMX0.XSku_Zd_H1Xng1owUcIDSPa5APwCk9dQZdoaNdi3pvg";

const supabaseClient = window.__supabase ?? (window.__supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
));

let currentUser = null;
let currentProfile = null;
let currentPhotoUrl = null;

// DOM elements
const photoUpload = document.getElementById('photo-upload');
const cameraUpload = document.getElementById('camera-upload');
const photoPreview = document.getElementById('photo-preview');
const photoPlaceholder = document.getElementById('photo-placeholder');
const photoDisplay = document.getElementById('profile-photo-display');
const noPhotoPlaceholder = document.getElementById('no-photo-placeholder');
const userTypeSelect = document.getElementById('userType');
const publicVisibility = document.getElementById('publicVisibility');
const publicField = document.getElementById('public-field');
const displayPublic = document.getElementById('display-public');

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

  if (error && error.code !== 'PGRST116') {
    console.error('error reading profile:', error);
  }

  currentProfile = profile;
  
  if (profile) {
    // Display profile
    document.getElementById('display-name').textContent = profile.full_name || '——';
    document.getElementById('display-type').textContent = profile.user_type || '——';
    document.getElementById('display-bio').textContent = profile.bio || '——';
    
    // Handle public visibility display
    if (profile.user_type === 'public') {
      publicField.style.display = 'block';
      displayPublic.textContent = profile.public_visibility === 'private' ? 
        'visible only to those you honor' : 'visible to all (like royalty)';
    } else {
      publicField.style.display = 'none';
    }
    
    // Load profile photo if exists
    if (profile.avatar_url) {
      currentPhotoUrl = profile.avatar_url;
      if (photoDisplay) {
        photoDisplay.src = profile.avatar_url;
        photoDisplay.style.display = 'block';
        if (noPhotoPlaceholder) noPhotoPlaceholder.style.display = 'none';
      }
    } else {
      if (photoDisplay) photoDisplay.style.display = 'none';
      if (noPhotoPlaceholder) noPhotoPlaceholder.style.display = 'block';
    }
    
    document.getElementById('profile-view').style.display = 'block';
    document.getElementById('profile-edit').style.display = 'none';
  } else {
    document.getElementById('profile-view').style.display = 'none';
    document.getElementById('profile-edit').style.display = 'block';
  }
}

// Show/hide public visibility based on user type
userTypeSelect?.addEventListener('change', () => {
  if (userTypeSelect.value === 'public') {
    publicVisibility.style.display = 'block';
  } else {
    publicVisibility.style.display = 'none';
  }
});

// Photo upload handlers with luxurious language
document.querySelector('label[for="photo-upload"]')?.addEventListener('click', (e) => {
  e.preventDefault();
  photoUpload.click();
});

document.getElementById('take-photo-btn')?.addEventListener('click', () => {
  cameraUpload.click();
});

photoUpload?.addEventListener('change', handlePhotoSelect);
cameraUpload?.addEventListener('change', handlePhotoSelect);

async function handlePhotoSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Show preview
  const reader = new FileReader();
  reader.onload = (e) => {
    photoPreview.src = e.target.result;
    photoPreview.style.display = 'block';
    photoPlaceholder.style.display = 'none';
  };
  reader.readAsDataURL(file);
  
  // Upload to Supabase Storage
  await uploadPhoto(file);
}

async function uploadPhoto(file) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${currentUser.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    const { error: uploadError } = await supabaseClient.storage
      .from('profiles')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;
    
    const { data: { publicUrl } } = supabaseClient.storage
      .from('profiles')
      .getPublicUrl(filePath);
    
    currentPhotoUrl = publicUrl;
    
  } catch (error) {
    console.error('error uploading photo:', error);
    alert('the likeness could not be preserved');
  }
}

// Edit button
document.getElementById('edit-profile-btn')?.addEventListener('click', () => {
  document.getElementById('fullName').value = currentProfile?.full_name || '';
  document.getElementById('userType').value = currentProfile?.user_type || '';
  document.getElementById('bio').value = currentProfile?.bio || '';
  
  if (currentProfile?.user_type === 'public') {
    publicVisibility.style.display = 'block';
    publicVisibility.value = currentProfile?.public_visibility || 'public';
  }
  
  // Show current photo in edit mode
  if (currentProfile?.avatar_url) {
    photoPreview.src = currentProfile.avatar_url;
    photoPreview.style.display = 'block';
    photoPlaceholder.style.display = 'none';
  }
  
  document.getElementById('profile-view').style.display = 'none';
  document.getElementById('profile-edit').style.display = 'block';
});

// Cancel edit
document.getElementById('cancel-edit-btn')?.addEventListener('click', () => {
  if (currentProfile) {
    document.getElementById('profile-view').style.display = 'block';
    document.getElementById('profile-edit').style.display = 'none';
  } else {
    if (confirm('you arrived without a name — leave?')) {
      supabaseClient.auth.signOut();
      window.location.href = 'index.html';
    }
  }
});

// Save profile
document.getElementById('profile-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const fullName = document.getElementById('fullName').value.trim();
  const userType = document.getElementById('userType').value;
  const bio = document.getElementById('bio').value.trim();
  const publicVisibilityValue = publicVisibility.value;
  
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
    public_visibility: userType === 'public' ? publicVisibilityValue : null,
    updated_at: new Date().toISOString()
  };
  
  if (currentPhotoUrl) {
    profileData.avatar_url = currentPhotoUrl;
  }
  
  const { error } = await supabaseClient
    .from('profiles')
    .upsert(profileData);
  
  if (error) {
    console.error('error saving profile:', error);
    alert('something interrupted the truth of this');
  } else {
    await loadProfile();
  }
});

// Back to orientation
document.getElementById('back-to-orientation')?.addEventListener('click', () => {
  window.location.href = 'orientation.html';
});
