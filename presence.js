// presence.js — seeing who is here
const SUPABASE_URL = "https://tnglwzaguyhgnwrnisvm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ2x3emFndXloZ253cm5pc3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTUxMTEsImV4cCI6MjA4NDU3MTExMX0.XSku_Zd_H1Xng1owUcIDSPa5APwCk9dQZdoaNdi3pvg";

const supabaseClient = window.__supabase ?? (window.__supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
));

checkAuth();

async function checkAuth() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = "index.html";
    return;
  }
  
  loadPresenceData();
}

async function loadPresenceData() {
  // get current user profile
  const { data: { session } } = await supabaseClient.auth.getSession();
  
  if (session) {
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (profile) {
      document.getElementById('current-user-display').innerHTML = `
        <div class="entity-item">
          <span class="entity-name">${profile.full_name || session.user.email}</span>
          <span class="entity-role">${profile.user_type || '——'}</span>
        </div>
      `;
    } else {
      document.getElementById('current-user-display').innerHTML = `
        <div class="entity-item">
          <span class="entity-name">${session.user.email}</span>
          <span class="entity-role">awaiting presence</span>
        </div>
      `;
    }
  }
  
  // get schools
  const { data: schools } = await supabaseClient
    .from('schools')
    .select('*')
    .limit(5);
  
  if (schools && schools.length > 0) {
    document.getElementById('schools-list').innerHTML = schools.map(school => `
      <div class="entity-item">
        <span class="entity-name">${school.name || 'unnamed school'}</span>
      </div>
    `).join('');
  } else {
    document.getElementById('schools-list').innerHTML = '<div class="entity-item"><span class="entity-name">no schools yet</span></div>';
  }
  
  // get students (from students table)
  const { data: students } = await supabaseClient
    .from('students')
    .select('*, profiles!inner(full_name)')
    .limit(5);
  
  if (students && students.length > 0) {
    document.getElementById('students-list').innerHTML = students.map(student => `
      <div class="entity-item">
        <span class="entity-name">${student.profiles?.full_name || 'student'}</span>
      </div>
    `).join('');
  } else {
    // fallback to profiles with student type
    const { data: studentProfiles } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('user_type', 'student')
      .limit(5);
    
    if (studentProfiles && studentProfiles.length > 0) {
      document.getElementById('students-list').innerHTML = studentProfiles.map(p => `
        <div class="entity-item">
          <span class="entity-name">${p.full_name || 'student'}</span>
        </div>
      `).join('');
    } else {
      document.getElementById('students-list').innerHTML = '<div class="entity-item"><span class="entity-name">no students yet</span></div>';
    }
  }
  
  // get teachers
  const { data: teachers } = await supabaseClient
    .from('teachers')
    .select('*, profiles!inner(full_name)')
    .limit(5);
  
  if (teachers && teachers.length > 0) {
    document.getElementById('teachers-list').innerHTML = teachers.map(teacher => `
      <div class="entity-item">
        <span class="entity-name">${teacher.profiles?.full_name || 'teacher'}</span>
      </div>
    `).join('');
  } else {
    // fallback to profiles with teacher type
    const { data: teacherProfiles } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('user_type', 'teacher')
      .limit(5);
    
    if (teacherProfiles && teacherProfiles.length > 0) {
      document.getElementById('teachers-list').innerHTML = teacherProfiles.map(p => `
        <div class="entity-item">
          <span class="entity-name">${p.full_name || 'teacher'}</span>
        </div>
      `).join('');
    } else {
      document.getElementById('teachers-list').innerHTML = '<div class="entity-item"><span class="entity-name">no teachers yet</span></div>';
    }
  }
            }
