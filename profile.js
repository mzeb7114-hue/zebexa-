// profile.js - Complete profile with all fields centered
const SUPABASE_URL = "https://tnglwzaguyhgnwrnisvm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ2x3emFndXloZ253cm5pc3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTUxMTEsImV4cCI6MjA4NDU3MTExMX0.XSku_Zd_H1Xng1owUcIDSPa5APwCk9dQZdoaNdi3pvg";

const supabaseClient = window.__supabase ?? (window.__supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
));

let currentUser = null;
let currentRole = 'student';
let existingProfile = null;
let selectedPhotoFile = null;

// DOM Elements
const profileStatus = document.getElementById('profile-status');
const profileMessage = document.getElementById('profile-message');
const roleStudent = document.getElementById('role-student');
const roleTeacher = document.getElementById('role-teacher');
const roleGuardian = document.getElementById('role-guardian');
const roleOther = document.getElementById('role-other');
const customRoleContainer = document.getElementById('custom-role-container');
const customRoleInput = document.getElementById('custom-role');
const studentFields = document.getElementById('student-fields');
const teacherFields = document.getElementById('teacher-fields');
const guardianFields = document.getElementById('guardian-fields');
const otherFields = document.getElementById('other-fields');
const honorificMessage = document.getElementById('honorific-message');
const fullNameInput = document.getElementById('full-name');
const ageInput = document.getElementById('age');
const genderSelect = document.getElementById('gender');
const schoolInput = document.getElementById('school');
const gradeInput = document.getElementById('grade');
const subjectsInput = document.getElementById('subjects');
const institutionInput = document.getElementById('institution');
const studentsInput = document.getElementById('students');
const contactPreferenceInput = document.getElementById('contact-preference');
const purposeInput = document.getElementById('purpose');
const contributionInput = document.getElementById('contribution');
const cityInput = document.getElementById('city');
const countryInput = document.getElementById('country');
const addressInput = document.getElementById('address');
const phoneInput = document.getElementById('phone');
const bioInput = document.getElementById('bio');
const personalNoteInput = document.getElementById('personal-note');
const returnLink = document.getElementById('return-to-orientation');

// Photo elements
const galleryBtn = document.getElementById('gallery-btn');
const cameraBtn = document.getElementById('camera-btn');
const photoUpload = document.getElementById('photo-upload');
const photoPreview = document.getElementById('photo-preview');
const photoPlaceholder = document.getElementById('photo-placeholder');
const photoImage = document.getElementById('photo-image');

// Check authentication on load
document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await supabaseClient.auth.getSession();
  
  if (!session) {
    profileStatus.textContent = 'please arrive first, then we may know you';
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
    return;
  }
  
  currentUser = session.user;
  profileStatus.textContent = `welcome, honored guest`;
  
  // Load existing profile if any
  await loadProfile();
});

// Load profile data if exists
async function loadProfile() {
  const { data: profile, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', currentUser.id)
    .single();
  
  if (profile && !error) {
    existingProfile = profile;
    currentRole = profile.role || 'student';
    
    // Populate fields
    fullNameInput.value = profile.full_name || '';
    ageInput.value = profile.age || '';
    genderSelect.value = profile.gender || '';
    cityInput.value = profile.city || '';
    countryInput.value = profile.country || '';
    addressInput.value = profile.address || '';
    phoneInput.value = profile.phone || '';
    bioInput.value = profile.bio || '';
    personalNoteInput.value = profile.personal_note || '';
    
    // Load profile photo if exists
    if (profile.avatar_url) {
      loadProfilePhoto(profile.avatar_url);
    }
    
    // Handle role selection
    if (profile.role === 'student') {
      selectRole('student');
      schoolInput.value = profile.school || '';
      gradeInput.value = profile.grade || '';
    } else if (profile.role === 'teacher') {
      selectRole('teacher');
      subjectsInput.value = profile.subjects || '';
      institutionInput.value = profile.institution || '';
    } else if (profile.role === 'guardian') {
      selectRole('guardian');
      studentsInput.value = profile.students || '';
      contactPreferenceInput.value = profile.contact_preference || '';
    } else if (profile.role === 'other') {
      selectRole('other');
      if (profile.custom_role) {
        customRoleInput.value = profile.custom_role;
      }
      purposeInput.value = profile.purpose || '';
      contributionInput.value = profile.contribution || '';
    }
    
    honorificMessage.textContent = 'we remember you, and are honored by your return';
    profileStatus.textContent = 'we remember you, and are honored by your return';
  } else {
    honorificMessage.textContent = 'tell us who you are, so we may honor you properly';
  }
}

// Load profile photo from URL
async function loadProfilePhoto(avatarUrl) {
  try {
    const { data } = supabaseClient.storage
      .from('avatars')
      .getPublicUrl(avatarUrl);
    
    if (data?.publicUrl) {
      photoImage.src = data.publicUrl;
      photoImage.style.display = 'block';
      photoPlaceholder.style.display = 'none';
    }
  } catch (error) {
    console.log('Could not load photo');
  }
}

// Photo upload handlers
galleryBtn.addEventListener('click', () => {
  photoUpload.removeAttribute('capture');
  photoUpload.click();
});

cameraBtn.addEventListener('click', () => {
  photoUpload.setAttribute('capture', 'environment');
  photoUpload.click();
});

photoUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedPhotoFile = file;
    
    // Preview image
    const reader = new FileReader();
    reader.onload = (e) => {
      photoImage.src = e.target.result;
      photoImage.style.display = 'block';
      photoPlaceholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }
});

// Role selection handlers
roleStudent.addEventListener('click', () => selectRole('student'));
roleTeacher.addEventListener('click', () => selectRole('teacher'));
roleGuardian.addEventListener('click', () => selectRole('guardian'));
roleOther.addEventListener('click', () => selectRole('other'));

function selectRole(role) {
  currentRole = role;
  
  // Update UI
  [roleStudent, roleTeacher, roleGuardian, roleOther].forEach(el => {
    el.classList.remove('selected');
  });
  
  document.getElementById(`role-${role}`).classList.add('selected');
  
  // Hide all role fields and custom container
  studentFields.style.display = 'none';
  teacherFields.style.display = 'none';
  guardianFields.style.display = 'none';
  otherFields.style.display = 'none';
  customRoleContainer.style.display = 'none';
  
  // Show selected role fields
  if (role === 'student') {
    studentFields.style.display = 'block';
  } else if (role === 'teacher') {
    teacherFields.style.display = 'block';
  } else if (role === 'guardian') {
    guardianFields.style.display = 'block';
  } else if (role === 'other') {
    otherFields.style.display = 'block';
    customRoleContainer.style.display = 'block';
  }
}

// Upload photo to Supabase Storage
async function uploadPhoto(userId, file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabaseClient.storage
    .from('avatars')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  return filePath;
}

// Form submission
document.getElementById('profile-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  if (!currentUser) {
    profileMessage.textContent = 'please arrive first, noble one';
    return;
  }
  
  const fullName = fullNameInput.value.trim();
  if (!fullName) {
    profileMessage.textContent = 'your name is the first honor you grant us';
    return;
  }
  
  if (currentRole === 'other') {
    const customRole = customRoleInput.value.trim();
    if (!customRole) {
      profileMessage.textContent = 'how would you like to name your presence?';
      return;
    }
  }
  
  profileMessage.textContent = 'your presence is being prepared with honor...';
  
  try {
    let avatarPath = existingProfile?.avatar_url || null;
    
    // Upload photo if selected
    if (selectedPhotoFile) {
      profileMessage.textContent = 'your reflection is being honored...';
      avatarPath = await uploadPhoto(currentUser.id, selectedPhotoFile);
    }
    
    // Build complete profile object
    const profileData = {
      id: currentUser.id,
      email: currentUser.email,
      full_name: fullName,
      age: ageInput.value ? parseInt(ageInput.value) : null,
      gender: genderSelect.value || null,
      role: currentRole,
      avatar_url: avatarPath,
      city: cityInput.value.trim() || null,
      country: countryInput.value.trim() || null,
      address: addressInput.value.trim() || null,
      phone: phoneInput.value.trim() || null,
      bio: bioInput.value.trim() || null,
      personal_note: personalNoteInput.value.trim() || null,
      updated_at: new Date().toISOString()
    };
    
    // Add role-specific fields
    if (currentRole === 'student') {
      profileData.school = schoolInput.value.trim() || null;
      profileData.grade = gradeInput.value.trim() || null;
    } else if (currentRole === 'teacher') {
      profileData.subjects = subjectsInput.value.trim() || null;
      profileData.institution = institutionInput.value.trim() || null;
    } else if (currentRole === 'guardian') {
      profileData.students = studentsInput.value.trim() || null;
      profileData.contact_preference = contactPreferenceInput.value.trim() || null;
    } else if (currentRole === 'other') {
      profileData.custom_role = customRoleInput.value.trim();
      profileData.purpose = purposeInput.value.trim() || null;
      profileData.contribution = contributionInput.value.trim() || null;
    }
    
    let result;
    
    if (existingProfile) {
      // Update existing profile
      result = await supabaseClient
        .from('profiles')
        .update(profileData)
        .eq('id', currentUser.id);
    } else {
      // Insert new profile
      result = await supabaseClient
        .from('profiles')
        .insert([profileData]);
    }
    
    if (result.error) {
      console.error('Database error:', result.error);
      
      // If there's a column error, try with essential fields only
      if (result.error.message.includes('column')) {
        profileMessage.textContent = 'simplifying your presence...';
        
        const minimalData = {
          id: currentUser.id,
          email: currentUser.email,
          full_name: fullName,
          role: currentRole,
          avatar_url: avatarPath,
          updated_at: new Date().toISOString()
        };
        
        if (existingProfile) {
          result = await supabaseClient
            .from('profiles')
            .update(minimalData)
            .eq('id', currentUser.id);
        } else {
          result = await supabaseClient
            .from('profiles')
            .insert([minimalData]);
        }
        
        if (result.error) {
          throw result.error;
        }
      } else {
        throw result.error;
      }
    }
    
    // Success messages
    let successMessage = '';
    if (currentRole === 'other' && customRoleInput.value.trim()) {
      successMessage = `the ${customRoleInput.value.trim()} has arrived, and we are honored`;
    } else {
      const roleMessages = {
        'student': 'the halls of learning welcome you',
        'teacher': 'wisdom has found its home in you',
        'guardian': 'your care is a gift to this place',
        'other': 'your unique presence enriches our halls'
      };
      successMessage = roleMessages[currentRole] || 'your presence honors our halls';
    }
    
    profileMessage.textContent = successMessage;
    honorificMessage.textContent = 'we know you now, and are grateful';
    
    // Redirect
    setTimeout(() => {
      window.location.href = 'orientation.html';
    }, 1500);
    
  } catch (error) {
    console.error('Profile save error:', error);
    profileMessage.textContent = 'an unexpected interruption - please try again';
  }
});

// Return to orientation
returnLink.addEventListener('click', () => {
  window.location.href = 'orientation.html';
});

// Handle auth state changes
supabaseClient.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    window.location.href = 'index.html';
  }
});
