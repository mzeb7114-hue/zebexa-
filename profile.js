// profile.js - Palace-level profile management
const SUPABASE_URL = "https://tnglwzaguyhgnwrnisvm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ2x3emFndXloZ253cm5pc3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTUxMTEsImV4cCI6MjA4NDU3MTExMX0.XSku_Zd_H1Xng1owUcIDSPa5APwCk9dQZdoaNdi3pvg";

const supabaseClient = window.__supabase ?? (window.__supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
));

let currentUser = null;
let currentRole = 'student'; // default
let existingProfile = null;

// DOM Elements
const profileStatus = document.getElementById('profile-status');
const profileMessage = document.getElementById('profile-message');
const roleStudent = document.getElementById('role-student');
const roleTeacher = document.getElementById('role-teacher');
const roleGuardian = document.getElementById('role-guardian');
const studentFields = document.getElementById('student-fields');
const teacherFields = document.getElementById('teacher-fields');
const guardianFields = document.getElementById('guardian-fields');
const honorificMessage = document.getElementById('honorific-message');
const fullNameInput = document.getElementById('full-name');
const schoolInput = document.getElementById('school');
const gradeInput = document.getElementById('grade');
const subjectsInput = document.getElementById('subjects');
const institutionInput = document.getElementById('institution');
const studentsInput = document.getElementById('students');
const contactPreferenceInput = document.getElementById('contact-preference');
const personalNoteInput = document.getElementById('personal-note');
const returnLink = document.getElementById('return-to-orientation');

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
  profileStatus.textContent = `welcome, honored ${session.user.email}`;
  
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
  
  if (profile) {
    existingProfile = profile;
    currentRole = profile.role || 'student';
    
    // Populate fields
    fullNameInput.value = profile.full_name || '';
    
    // Role-specific fields
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
    }
    
    // Personal note (stored in metadata or a separate field - we'll use metadata)
    personalNoteInput.value = profile.personal_note || '';
    
    honorificMessage.textContent = 'we remember you, and are honored by your return';
    profileStatus.textContent = 'we remember you, and are honored by your return';
  } else {
    honorificMessage.textContent = 'tell us who you are, so we may honor you properly';
  }
}

// Role selection handlers
roleStudent.addEventListener('click', () => selectRole('student'));
roleTeacher.addEventListener('click', () => selectRole('teacher'));
roleGuardian.addEventListener('click', () => selectRole('guardian'));

function selectRole(role) {
  currentRole = role;
  
  // Update UI
  [roleStudent, roleTeacher, roleGuardian].forEach(el => {
    el.classList.remove('selected');
  });
  
  document.getElementById(`role-${role}`).classList.add('selected');
  
  // Hide all role fields
  studentFields.style.display = 'none';
  teacherFields.style.display = 'none';
  guardianFields.style.display = 'none';
  
  // Show selected role fields
  if (role === 'student') {
    studentFields.style.display = 'block';
  } else if (role === 'teacher') {
    teacherFields.style.display = 'block';
  } else if (role === 'guardian') {
    guardianFields.style.display = 'block';
  }
}

// Form submission - saving profile with honor
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
  
  profileMessage.textContent = 'your presence is being recorded with honor...';
  
  // Build profile object
  const profileData = {
    id: currentUser.id,
    email: currentUser.email,
    role: currentRole,
    full_name: fullName,
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
  }
  
  // Add personal note (store in a separate field or metadata)
  profileData.personal_note = personalNoteInput.value.trim() || null;
  
  try {
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
      throw result.error;
    }
    
    // Success messages based on role
    const roleMessages = {
      'student': 'the halls of learning welcome you',
      'teacher': 'wisdom has found its home in you',
      'guardian': 'your care is a gift to this place'
    };
    
    profileMessage.textContent = roleMessages[currentRole] || 'your presence honors our halls';
    
    // Update status
    honorificMessage.textContent = 'we know you now, and are grateful';
    
    // Redirect after a dignified pause
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
