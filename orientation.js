// orientation.js - WORKING WITH YOUR EXISTING TABLES
const SUPABASE_URL = "https://tnglwzaguyhgnwrnisvm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ2x3emFndXloZ253cm5pc3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTUxMTEsImV4cCI6MjA4NDU3MTExMX0.XSku_Zd_H1Xng1owUcIDSPa5APwCk9dQZdoaNdi3pvg";

const supabaseClient = window.__supabase ?? (window.__supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY));

// Check session
checkSession();

async function checkSession() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
        window.location.href = "index.html";
    }
}

// PRESENCE CARD - Shows real user data from your tables
document.getElementById("presence-card").addEventListener("click", async () => {
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (!session) return;
    
    // Fetch user profile
    const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
    }
    
    // Check if user is a student
    const { data: studentData } = await supabaseClient
        .from('students')
        .select(`
            *,
            schools (*),
            student_classes (
                *,
                classes (*)
            )
        `)
        .eq('profile_id', session.user.id)
        .maybeSingle();
    
    // Check if user is a teacher
    const { data: teacherData } = await supabaseClient
        .from('teachers')
        .select(`
            *,
            schools (*),
            teacher_classes (
                *,
                classes (*)
            )
        `)
        .eq('profile_id', session.user.id)
        .maybeSingle();
    
    // Update the brand section
    const brand = document.querySelector(".brand");
    const cardsGrid = document.querySelector(".cards-grid");
    
    // Determine user type and display appropriate info
    let userType = 'public';
    let schoolInfo = '';
    let roleInfo = '';
    
    if (studentData) {
        userType = 'student';
        schoolInfo = studentData.schools?.name ? `at ${studentData.schools.name}` : '';
        if (studentData.student_classes && studentData.student_classes.length > 0) {
            const classInfo = studentData.student_classes[0]?.classes;
            roleInfo = classInfo ? `Class ${classInfo.name} ${classInfo.section || ''}` : '';
        }
    } else if (teacherData) {
        userType = 'teacher';
        schoolInfo = teacherData.schools?.name ? `at ${teacherData.schools.name}` : '';
        roleInfo = teacherData.specialization || 'Teacher';
    }
    
    brand.innerHTML = `
        <h1 class="exa">ZEBEXA</h1>
        <p class="tagline">
          Your Presence<br />
          <span>${profile?.email || session.user.email}</span>
        </p>
    `;
    
    // Build profile display
    let profileHtml = `
        <div class="orientation-card" style="cursor: default;">
            <div class="card-content">
                <h3 class="card-title">Your Profile</h3>
                <div style="margin: 20px 0; text-align: left;">
    `;
    
    if (profile?.full_name) {
        profileHtml += `<p style="margin: 10px 0; color: #fff;"><strong>Name:</strong> ${profile.full_name}</p>`;
    }
    
    profileHtml += `<p style="margin: 10px 0; color: #9ba3af;"><strong>Email:</strong> ${session.user.email}</p>`;
    profileHtml += `<p style="margin: 10px 0; color: #9ba3af;"><strong>Type:</strong> ${userType}</p>`;
    
    if (schoolInfo) {
        profileHtml += `<p style="margin: 10px 0; color: #9ba3af;"><strong>School:</strong> ${schoolInfo}</p>`;
    }
    
    if (roleInfo) {
        profileHtml += `<p style="margin: 10px 0; color: #9ba3af;"><strong>Role:</strong> ${roleInfo}</p>`;
    }
    
    // If student, show classes
    if (studentData && studentData.student_classes && studentData.student_classes.length > 0) {
        profileHtml += `<p style="margin: 15px 0 5px 0; color: #fff;"><strong>Enrolled Classes:</strong></p>`;
        profileHtml += `<ul style="margin: 5px 0 15px 20px; color: #9ba3af;">`;
        studentData.student_classes.forEach(sc => {
            if (sc.classes) {
                profileHtml += `<li>${sc.classes.name} ${sc.classes.section || ''}</li>`;
            }
        });
        profileHtml += `</ul>`;
    }
    
    // If teacher, show classes they teach
    if (teacherData && teacherData.teacher_classes && teacherData.teacher_classes.length > 0) {
        profileHtml += `<p style="margin: 15px 0 5px 0; color: #fff;"><strong>Teaching Classes:</strong></p>`;
        profileHtml += `<ul style="margin: 5px 0 15px 20px; color: #9ba3af;">`;
        teacherData.teacher_classes.forEach(tc => {
            if (tc.classes) {
                profileHtml += `<li>${tc.classes.name} ${tc.classes.section || ''}</li>`;
            }
        });
        profileHtml += `</ul>`;
    }
    
    // Edit button
    profileHtml += `
                    <button id="editProfileBtn" style="width: 100%; padding: 14px; margin-top: 20px; background: linear-gradient(90deg, #7bb0ff, #ff7ac8); border: none; border-radius: 16px; color: #0d1117; font-weight: 500; cursor: pointer;">
                        Edit Profile
                    </button>
                </div>
                <div class="card-tables" style="margin-top: 20px;">
                    Member since: ${new Date(session.user.created_at).toLocaleDateString()}
                </div>
            </div>
        </div>
        
        <div class="orientation-card" id="backToHome" style="background: rgba(255,255,255,0.03);">
            <div class="card-content">
                <p class="card-description" style="text-align: center;">
                    ← Return to orientation
                </p>
            </div>
        </div>
    `;
    
    cardsGrid.innerHTML = profileHtml;
    
    // Add edit profile handler
    document.getElementById('editProfileBtn')?.addEventListener('click', () => {
        showEditProfileForm(profile, session);
    });
    
    // Add back button handler
    document.getElementById('backToHome')?.addEventListener('click', () => {
        window.location.reload();
    });
});

// Edit profile form function
async function showEditProfileForm(profile, session) {
    const cardsGrid = document.querySelector(".cards-grid");
    
    cardsGrid.innerHTML = `
        <div class="orientation-card" style="cursor: default;">
            <div class="card-content">
                <h3 class="card-title">Edit Profile</h3>
                <div style="margin: 20px 0;">
                    <input type="text" id="fullName" placeholder="Full Name" value="${profile?.full_name || ''}" 
                           style="width: 100%; padding: 12px; margin-bottom: 15px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white;">
                    
                    <textarea id="bio" placeholder="Bio" rows="3"
                              style="width: 100%; padding: 12px; margin-bottom: 15px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white; resize: vertical;">${profile?.bio || ''}</textarea>
                    
                    <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 25px; color: #9ba3af;">
                        <input type="checkbox" id="isPublic" ${profile?.is_public ? 'checked' : ''}>
                        Make profile public
                    </label>
                    
                    <div style="display: flex; gap: 10px;">
                        <button id="saveProfileBtn" style="flex: 2; padding: 14px; background: linear-gradient(90deg, #7bb0ff, #ff7ac8); border: none; border-radius: 16px; color: #0d1117; font-weight: 500; cursor: pointer;">
                            Save Changes
                        </button>
                        <button id="cancelEditBtn" style="flex: 1; padding: 14px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 16px; color: #fff; font-weight: 500; cursor: pointer;">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Save profile handler
    document.getElementById('saveProfileBtn')?.addEventListener('click', async () => {
        const fullName = document.getElementById('fullName').value;
        const bio = document.getElementById('bio').value;
        const isPublic = document.getElementById('isPublic').checked;
        
        const { error } = await supabaseClient
            .from('profiles')
            .upsert({
                id: session.user.id,
                email: session.user.email,
                full_name: fullName,
                bio: bio,
                is_public: isPublic,
                updated_at: new Date()
            });
        
        if (error) {
            alert('Error saving profile: ' + error.message);
        } else {
            alert('Profile saved successfully!');
            // Refresh the presence view
            document.getElementById("presence-card").click();
        }
    });
    
    // Cancel handler
    document.getElementById('cancelEditBtn')?.addEventListener('click', () => {
        document.getElementById("presence-card").click();
    });
}

// Learning card - shows subjects/courses
document.getElementById("learning-card").addEventListener("click", async () => {
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (!session) return;
    
    // Fetch subjects
    const { data: subjects } = await supabaseClient
        .from('subjects')
        .select('*')
        .limit(5);
    
    const brand = document.querySelector(".brand");
    brand.innerHTML = `
        <h1 class="exa">ZEBEXA</h1>
        <p class="tagline">
          Learning<br />
          <span>${subjects ? subjects.length + ' subjects available' : 'Browse courses'}</span>
        </p>
    `;
});

// Moments card - shows events/attendance
document.getElementById("moments-card").addEventListener("click", async () => {
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (!session) return;
    
    // Fetch recent events
    const { data: events } = await supabaseClient
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
    
    const brand = document.querySelector(".brand");
    brand.innerHTML = `
        <h1 class="exa">ZEBEXA</h1>
        <p class="tagline">
          Moments<br />
          <span>${events ? events.length + ' upcoming events' : 'Your timeline'}</span>
        </p>
    `;
});

// Auth state change listener
supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
        window.location.href = "index.html";
    }
});
