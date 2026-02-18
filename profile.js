// profile.js — the truth of who you are, honored completely
const SUPABASE_URL = "https://tnglwzaguyhgnwrnisvm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ2x3emFndXloZ253cm5pc3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTUxMTEsImV4cCI6MjA4NDU3MTExMX0.XSku_Zd_H1Xng1owUcIDSPa5APwCk9dQZdoaNdi3pvg";

const supabaseClient = window.__supabase ?? (window.__supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
));

let currentUser = null;
let currentProfile = null;
let avatarFile = null;

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
    document.getElementById('display-name').textContent = profile.full_name || '——';
    document.getElementById('display-type').textContent = profile.user_type || '——';
    document.getElementById('display-age').textContent = profile.age || '——';
    document.getElementById('display-gender').textContent = profile.gender || '——';
    document.getElementById('display-public').textContent = profile.is_public === false ? 'private chamber' : 'visible to all';
    document.getElementById('display-bio').textContent = profile.bio || '——';
    
    if (profile.avatar_url) {
      document.getElementById('avatar-view-img').src = profile.avatar_url;
      document.getElementById('avatar-preview').src = profile.avatar_url;
    }
    
    document.getElementById('profile-view').style.display = 'block';
    document.getElementById('profile-edit').style.display = 'none';
  } else {
    document.getElementById('profile-view').style.display = 'none';
    document.getElementById('profile-edit').style.display = 'block';
  }
}

document.getElementById('edit-profile-btn')?.addEventListener('click', () => {
  document.getElementById('fullName').value = currentProfile?.full_name || '';
  document.getElementById('userType').value = currentProfile?.user_type || '';
  document.getElementById('age').value = currentProfile?.age || '';
  document.getElementById('gender').value = currentProfile?.gender || '';
  document.getElementById('isPublic').value = currentProfile?.is_public === false ? 'false' : 'true';
  document.getElementById('bio').value = currentProfile?.bio || '';
  
  document.getElementById('profile-view').style.display = 'none';
  document.getElementById('profile-edit').style.display = 'block';
});

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

document.getElementById('avatar-upload')?.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    avatarFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('avatar-preview').src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

async function uploadAvatar(userId, file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabaseClient.storage
    .from('avatars')
    .upload(filePath, file);

  if (uploadError) {
    console.error('avatar upload error:', uploadError);
    return null;
  }

  const { data } = supabaseClient.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

document.getElementById('profile-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const fullName = document.getElementById('fullName').value.trim();
  const userType = document.getElementById('userType').value;
  const age = document.getElementById('age').value;
  const gender = document.getElementById('gender').value;
  const isPublic = document.getElementById('isPublic').value === 'true';
  const bio = document.getElementById('bio').value.trim();
  
  if (!fullName || !userType) {
    alert('a name and presence are needed to continue');
    return;
  }
  
  let avatarUrl = currentProfile?.avatar_url || null;
  
  if (avatarFile) {
    avatarUrl = await uploadAvatar(currentUser.id, avatarFile);
  }
  
  const profileData = {
    id: currentUser.id,
    full_name: fullName,
    user_type: userType,
    age: age || null,
    gender: gender || null,
    is_public: isPublic,
    bio: bio || null,
    avatar_url: avatarUrl,
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
    avatarFile = null;
    await loadProfile();
  }
});

document.getElementById('back-to-orientation')?.addEventListener('click', () => {
  window.location.href = 'orientation.html';
});
