const SUPABASE_URL = "https://tnglwzaguyhgnwrnisvm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ2x3emFndXloZ253cm5pc3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTUxMTEsImV4cCI6MjA4NDU3MTExMX0.XSku_Zd_H1Xng1owUcIDSPa5APwCk9dQZdoaNdi3pvg";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
