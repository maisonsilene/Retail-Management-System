/**
 * FICHIER: src/config.js
 * OBJET: Centraliser les constantes de configuration (URL et clé anon).
 * ROLE: C’est la boîte à clés 🗝️ — on ne met ici que les infos brutes.
 * EXPOSE: export const CFG
 */
export const CFG = {
  SUPABASE_URL: "https://eiewigilwczsciraepnb.supabase.co",
  SUPABASE_ANON_KEY:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpZXdpZ2lsd2N6c2NpcmFlcG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MDcyMDcsImV4cCI6MjA3MTM4MzIwN30.EZkI_3PyG_8hVdCVUlijnWNE1QmOAuoGskb7e6pkmNU",
  TAX_RATE_DEFAULT: 0.20, // taux TVA par défaut (optionnel)
};
