// config.js
// ------------------------------------------------------
// Rôle : centraliser la connexion à Supabase pour TOUT le site.
// - SUPABASE_URL     : l'adresse de ton projet Supabase
// - SUPABASE_ANON_KEY: ta clé publique (anon) — OK côté navigateur
// - sb               : client Supabase prêt à l'emploi dans app.js
// ------------------------------------------------------

const SUPABASE_URL = "https://eiewigilwczsciraepnb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpZXdpZ2lsd2N6c2NpcmFlcG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MDcyMDcsImV4cCI6MjA3MTM4MzIwN30.EZkI_3PyG_8hVdCVUlijnWNE1QmOAuoGskb7e6pkmNU";

// ⚠️ Ne mets JAMAIS la service_role ici (trop puissante).
//    La sécurité côté navigateur repose sur tes policies RLS.

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
