// profile.js — COMPLETE WORKING VERSION WITH PHOTO UPLOAD

const SUPABASE_URL = "https://tnglwzaguyhgnwrnisvm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ2x3emFndXloZ253cm5pc3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTUxMTEsImV4cCI6MjA4NDU3MTExMX0.XSku_Zd_H1Xng1owUcIDSPa5APwCk9dQZdoaNdi3pvg";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let user = null;
let selectedFile = null;

// DOM Elements
const photoUpload = document.getElementById('photo-upload');
const photoImage = document.getElementById('photo-image');
const photoPlaceholder = document.getElementById('photo-placeholder');
const fullName = document.getElementById('full-name');
const gender = document.getElementById('gender');
const dob = document.getElementById('dob');
const profileForm = document.getElementById('profile-form');
const profileMessage = document.getElementById('profile-message');
const saveBtn = document.getElementById('save-profile-btn');
const returnLink = document.getElementById('return-to-orientation');

// check login
document.addEventListener("DOMContentLoaded", async () => {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = "index.html";
    return;
  }

  user = session.user;
  loadProfile();
});

// photo preview
photoUpload?.addEventListener("change", e => {
  selectedFile = e.target.files[0];
  if (!selectedFile) return;

  // Check file size (limit to 2MB)
  if (selectedFile.size > 2 * 1024 * 1024) {
    profileMessage.innerText = "Image should be less than 2MB";
    return;
  }

  // Check file type
  if (!selectedFile.type.startsWith('image/')) {
    profileMessage.innerText = "Please upload an image file";
    return;
  }

  const reader = new FileReader();
  reader.onload = ev => {
    photoImage.src = ev.target.result;
    photoImage.style.display = "block";
    if (photoPlaceholder) photoPlaceholder.style.display = "none";
    profileMessage.innerText = "reflection added";
  };
  reader.readAsDataURL(selectedFile);
});

// save profile
profileForm?.addEventListener("submit", async e => {
  e.preventDefault();

  const name = fullName.value.trim();
  const genderValue = gender.value;
  const dobValue = dob.value;

  if (!name || !genderValue || !dobValue) {
    profileMessage.innerText = "Please fill Full Name, Gender and Date of Birth.";
    return;
  }

  saveBtn.disabled = true;
  saveBtn.textContent = "presenting...";
  profileMessage.innerText = "your reflection is being honored";

  let avatar = null;

  try {
    // Upload photo if selected
    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      
      // Remove old avatar if exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();
      
      if (existingProfile?.avatar_url) {
        await supabase.storage
          .from('avatars')
          .remove([existingProfile.avatar_url]);
      }
      
      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, selectedFile, { 
          upsert: true,
          cacheControl: '3600'
        });

      if (!uploadError) {
        avatar = fileName;
      } else {
        console.error('Upload error:', uploadError);
      }
    }

    // Calculate age from date of birth
    const age = calculateAge(dobValue);

    // Save profile
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        email: user.email,
        full_name: name,
        gender: genderValue,
        date_of_birth: dobValue,
        age: age,
        avatar_url: avatar,
        updated_at: new Date().toISOString()
      });

    if (error) {
      profileMessage.innerText = "Error saving profile";
      console.error(error);
      saveBtn.disabled = false;
      saveBtn.textContent = "present yourself with honor";
      return;
    }

    profileMessage.innerText = "Profile saved. Your presence is honored.";

    setTimeout(() => {
      window.location.href = "orientation.html";
    }, 1200);

  } catch (err) {
    console.error(err);
    profileMessage.innerText = "Unexpected error saving profile";
    saveBtn.disabled = false;
    saveBtn.textContent = "present yourself with honor";
  }
});

// Helper function to calculate age
function calculateAge(dobString) {
  const today = new Date();
  const birthDate = new Date(dobString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// load existing profile
async function loadProfile() {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error || !data) return;

    fullName.value = data.full_name || "";
    gender.value = data.gender || "";
    dob.value = data.date_of_birth || "";

    if (data.avatar_url) {
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(data.avatar_url);

      if (urlData?.publicUrl) {
        photoImage.src = urlData.publicUrl;
        photoImage.style.display = "block";
        if (photoPlaceholder) photoPlaceholder.style.display = "none";
      }
    }
  } catch (err) {
    console.error('Error loading profile:', err);
  }
}

// Return to orientation
returnLink?.addEventListener('click', () => {
  window.location.href = 'orientation.html';
});

// Auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    window.location.href = 'index.html';
  }
});
