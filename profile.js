// profile.js — COMPLETE WORKING VERSION

const SUPABASE_URL = "https://tnglwzaguyhgnwrnisvm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ2x3emFndXloZ253cm5pc3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTUxMTEsImV4cCI6MjA4NDU3MTExMX0.XSku_Zd_H1Xng1owUcIDSPa5APwCk9dQZdoaNdi3pvg";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let user = null;
let selectedFile = null;

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
const upload = document.getElementById("photo-upload");
const img = document.getElementById("photo-image");
const placeholder = document.getElementById("photo-placeholder");

upload?.addEventListener("change", e => {
  selectedFile = e.target.files[0];
  if (!selectedFile) return;

  const r = new FileReader();
  r.onload = ev => {
    img.src = ev.target.result;
    img.style.display = "block";
    if (placeholder) placeholder.style.display = "none";
  };
  r.readAsDataURL(selectedFile);
});

// save profile
document.getElementById("profile-form")?.addEventListener("submit", async e => {
  e.preventDefault();

  const name = document.getElementById("full-name").value.trim();
  const gender = document.getElementById("gender").value;
  const dob = document.getElementById("dob").value;

  if (!name || !gender || !dob) {
    document.getElementById("profile-message").innerText =
      "Please fill Full Name, Gender and Date of Birth.";
    return;
  }

  let avatar = null;

  try {
    if (selectedFile) {
      const ext = selectedFile.name.split(".").pop();
      const fileName = user.id + "." + ext;

      const { error } = await supabase.storage
        .from("avatars")
        .upload(fileName, selectedFile, { upsert: true });

      if (!error) avatar = fileName;
    }

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        email: user.email,
        full_name: name,
        gender: gender,
        date_of_birth: dob,
        avatar_url: avatar
      });

    if (error) {
      document.getElementById("profile-message").innerText =
        "Error saving profile";
      console.error(error);
      return;
    }

    document.getElementById("profile-message").innerText = "Profile saved";

    setTimeout(() => {
      window.location.href = "orientation.html";
    }, 900);

  } catch (err) {
    console.error(err);
    document.getElementById("profile-message").innerText =
      "Unexpected error saving profile";
  }
});

// load existing profile
async function loadProfile() {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!data) return;

  document.getElementById("full-name").value = data.full_name || "";
  document.getElementById("gender").value = data.gender || "";
  document.getElementById("dob").value = data.date_of_birth || "";

  if (data.avatar_url) {
    const { data: url } = supabase.storage
      .from("avatars")
      .getPublicUrl(data.avatar_url);

    img.src = url.publicUrl;
    img.style.display = "block";
    if (placeholder) placeholder.style.display = "none";
  }
                          }
