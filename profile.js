// profile.js - FINAL COMPLETE

const SUPABASE_URL = "https://tnglwzaguyhgnwrnisvm.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_KEY_HERE";

const supabaseClient =
  window.__supabase ??
  (window.__supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  ));

let currentUser = null;
let selectedPhotoFile = null;

const fullNameInput = document.getElementById("full-name");
const dobInput = document.getElementById("dob");
const genderSelect = document.getElementById("gender");
const photoUpload = document.getElementById("photo-upload");
const profileMessage = document.getElementById("profile-message");
const editBtn = document.getElementById("edit-profile-btn");

document.addEventListener("DOMContentLoaded", async () => {
  const { data: { session } } =
    await supabaseClient.auth.getSession();

  if (!session) {
    window.location.href = "index.html";
    return;
  }

  currentUser = session.user;
});

photoUpload?.addEventListener("change", (e) => {
  selectedPhotoFile = e.target.files[0] || null;
});

async function uploadPhoto(userId, file) {
  const ext = file.name.split(".").pop();
  const path = `${userId}.${ext}`;

  const { error } =
    await supabaseClient.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

  if (error) throw error;

  return path;
}

document
  .getElementById("profile-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = fullNameInput.value.trim();
    const dob = dobInput.value;
    const gender = genderSelect.value;

    if (!name || !dob || !gender) {
      profileMessage.textContent =
        "Fill Full Name, Date of Birth, Gender";
      return;
    }

    try {
      let avatar = null;

      if (selectedPhotoFile) {
        avatar = await uploadPhoto(
          currentUser.id,
          selectedPhotoFile
        );
      }

      const profileData = {
        id: currentUser.id,
        full_name: name,
        date_of_birth: dob,
        gender: gender,
        avatar_url: avatar,
        updated_at: new Date().toISOString(),
      };

      const { error } =
        await supabaseClient
          .from("profiles")
          .upsert(profileData);

      if (error) throw error;

      profileMessage.textContent = "Profile saved";
      setTimeout(() => {
        window.location.href = "orientation.html";
      }, 1200);

    } catch (err) {
      profileMessage.textContent = "Save failed";
    }
  });

// EDIT PROFILE LATER BUTTON
if (editBtn) {
  editBtn.addEventListener("click", () => {
    window.location.href = "orientation.html";
  });
  }
